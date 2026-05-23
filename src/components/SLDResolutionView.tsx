import { useMemo, useRef, useEffect, useState } from "react";
import { decideLogicType, type LogicToken } from "../utils/tokenizer";
import { parseStandardFormula } from "../utils/parserStandard";
import { parsePrologFormula } from "../utils/parserProlog";
import {
  negateFormula,
  replaceImplies,
  toNNF,
  renameQuantifierVariables,
  toPNF,
  skolemize,
  removeForallQuantifiers,
  toCNF,
  flattenCNF,
} from "../utils/transformSteps";
import { prepareSLD } from "../utils/sldResolution";
import { generateSLDTreeDFS } from "../utils/sldResolutionDFS";
import { generateSLDTreeBFS } from "../utils/sldResolutionBFS";
import { SLDTree } from "./SLDTree";
import { useLanguage } from "../translations/LanguageContext";
import { predicateToString } from "../utils/unification";

interface SLDResolutionViewProps {
  tokens: LogicToken[];
  strategy: "dfs" | "bfs";
  onStrategyChange: (strategy: "dfs" | "bfs") => void;
}

export const SLDResolutionView = ({ tokens, strategy, onStrategyChange }: SLDResolutionViewProps) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleSteps, setVisibleSteps] = useState<number>(1);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const hasCut = useMemo(() => tokens.some(tok => tok.type === "cut"), [tokens]);
  const [showAllBranches, setShowAllBranches] = useState(false);

  useEffect(() => {
    if (hasCut && strategy === "bfs") onStrategyChange("dfs");
    if (!hasCut) setShowAllBranches(false);
  }, [hasCut, strategy, onStrategyChange]);

  const [isLatexModalOpen, setIsLatexModalOpen] = useState(false);
  const [latexExportType, setLatexExportType] = useState<'document' | 'table'>('table');
  const [latexOrientation, setLatexOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showCycleModal, setShowCycleModal] = useState(false);

  const resolutionData = useMemo(() => {
    try {
      const type = decideLogicType(tokens);
      const ast = type === "prolog" ? parsePrologFormula(tokens) : parseStandardFormula(tokens);
      const negated = negateFormula(ast);
      const withoutImplies = replaceImplies(negated);
      const nnf = toNNF(withoutImplies);
      const nnfUniqueVars = renameQuantifierVariables(nnf);
      const pnf = toPNF(nnfUniqueVars);
      const skolemized = skolemize(pnf);
      const removedForall = removeForallQuantifiers(skolemized);
      const cnf = toCNF(removedForall);
      const { clauses, variables } = flattenCNF(cnf);

      const sld = prepareSLD(clauses);
      let treeData;
      if (strategy === "bfs") {
        treeData = generateSLDTreeBFS(sld.knowledgeBase, sld.goals, 15, variables);
      } else {
        treeData = generateSLDTreeDFS(sld.knowledgeBase, sld.goals, 15, variables);
      }
      return { treeData, knowledgeBase: sld.knowledgeBase, goals: sld.goals, hitMaxDepth: treeData.hitMaxDepth };
    } catch {
      return null;
    }
  }, [tokens, strategy]);

  useEffect(() => {
    setVisibleSteps(1);
    setHighlightedNodeId(null); 
    if (resolutionData && resolutionData.treeData && resolutionData.treeData.nodes.length > 0) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [resolutionData]);

  useEffect(() => {
    if (highlightedNodeId) {

      const row = document.getElementById(`row-${highlightedNodeId}`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (resolutionData?.treeData) {
        const nodeIndex = resolutionData.treeData.nodes.findIndex(n => n.id === highlightedNodeId);
        if (nodeIndex !== -1 && nodeIndex + 1 > visibleSteps) {
          setVisibleSteps(nodeIndex + 1);
        }
      }
    }
  }, [highlightedNodeId, resolutionData, visibleSteps]);

  useEffect(() => {
    if (resolutionData?.hitMaxDepth && visibleSteps >= resolutionData.treeData.nodes.length && resolutionData.treeData.nodes.length > 0) {
      setShowCycleModal(true);
    }
  }, [visibleSteps, resolutionData]);

  const copyToLatex = () => {
    setIsLatexModalOpen(true);
  };

  const handleConfirmLatexCopy = () => {
    if (!resolutionData || !resolutionData.treeData) return;

    const { treeData, knowledgeBase, goals } = resolutionData;
    const latexKBWithIdx = knowledgeBase.map((c, i) => ({ clause: c, origIdx: i }));
    const latexSortedKBWithIdx = [
      ...latexKBWithIdx.filter(({ clause }) => clause.length === 1),
      ...latexKBWithIdx.filter(({ clause }) => clause.length > 1),
    ];
    const latexSortedKB = latexSortedKBWithIdx.map(({ clause }) => clause);
    const latexKBIdxToRow: Record<number, number> = {};
    latexSortedKBWithIdx.forEach(({ origIdx }, displayIdx) => {
      latexKBIdxToRow[origIdx] = displayIdx + 1;
    });
    const initialClauses = [...latexSortedKB, ...goals];
    const visibleNodes = treeData.nodes.slice(0, visibleSteps);
    const stepMap: Record<string, number> = {};
    if (treeData.nodes.length > 0) {
      stepMap[treeData.nodes[0].id] = initialClauses.length;
      treeData.nodes.slice(1).forEach((n, i) => {
        stepMap[n.id] = initialClauses.length + i + 1;
      });
    }

    let latex = "";
    
    if (latexExportType === 'table') {
      latex += `% ${t("latex_export_warning")}\n`;
      latex += `% \\usepackage{amssymb}\n`;
      latex += `% \\usepackage{longtable}\n`;
      if (latexOrientation === 'landscape') {
        latex += `% \\usepackage{pdflscape}\n`;
      }
      latex += `\n`;
    }

    if (latexExportType === 'document') {
      const margin = latexOrientation === 'landscape' ? '[a4paper, margin=1cm]' : '[a4paper, margin=1cm]';
      latex += `\\documentclass{article}
\\usepackage{amssymb}
\\usepackage${margin}{geometry}
\\usepackage{longtable}
${latexOrientation === 'landscape' ? '\\usepackage{pdflscape}\n' : ''}
\\begin{document}

`;
    }

    if (latexOrientation === 'landscape') {
      latex += `\\begin{landscape}\n`;
    }

    latex += `\\begin{longtable}{|c|l|c|c|}
\\hline
\\textbf{Step} & \\textbf{Clause} & \\textbf{Resolved} & \\textbf{Unification} \\\\
\\hline
\\endhead
`;

   
    initialClauses.forEach((clause, idx) => {
      const clauseLatex = clause.join(", ").replace(/[~¬]/g, '\\neg ').replace(/_/g, '\\_');
      latex += `${idx + 1} & $${clauseLatex}$ & & \\\\\n\\hline\n`;
    });

   
    visibleNodes.slice(1).forEach((node, idx) => {
      let resolventText = "";
      if (node.goals.length === 0) {
        resolventText = "\\Box";
      } else {
        resolventText = node.goals.map(g => predicateToString(g)).join(", ").replace(/[~¬]/g, '\\neg ').replace(/_/g, '\\_');
      }

      const parentStep = node.parent ? stepMap[node.parent] : '?';
      const kbStep = node.usedClauseIndex !== undefined ? latexKBIdxToRow[node.usedClauseIndex] : node.builtinName ?? '?';
      const resolvedWithText = node.isFailLabel ? "" : `${parentStep},${kbStep}`;
      
      const edge = treeData.edges.find(e => e.target === node.id);
      const unificationText = edge && edge.label ? edge.label : "";
      const displayUnificationText = unificationText === "{}" ? "\\{\\}" : unificationText.replace(/{/g, "\\{").replace(/}/g, "\\}").replace(/_/g, '\\_');

      latex += `${initialClauses.length + idx + 1} & $${resolventText}$ & ${resolvedWithText} & $${displayUnificationText}$ \\\\\n\\hline\n`;
    });

    latex += `\\end{longtable}`;

    if (latexOrientation === 'landscape') {
      latex += `\n\\end{landscape}`;
    }

    if (latexExportType === 'document') {
      latex += `

\\end{document}`;
    }

    navigator.clipboard.writeText(latex);
    setIsLatexModalOpen(false);
  };

  if (!resolutionData || !resolutionData.treeData || resolutionData.treeData.nodes.length === 0) return null;

  const { treeData, knowledgeBase, goals } = resolutionData;

  // Sort KB for display: unit clauses (facts) first, multi-literal (rules) second
  const kbWithOrigIdx = knowledgeBase.map((c, i) => ({ clause: c, origIdx: i }));
  const sortedKBWithIdx = [
    ...kbWithOrigIdx.filter(({ clause }) => clause.length === 1),
    ...kbWithOrigIdx.filter(({ clause }) => clause.length > 1),
  ];
  const sortedKB = sortedKBWithIdx.map(({ clause }) => clause);
  const kbOrigIdxToRow: Record<number, number> = {};
  sortedKBWithIdx.forEach(({ origIdx }, displayIdx) => {
    kbOrigIdxToRow[origIdx] = displayIdx + 1;
  });

  // Display order: facts → rules → goal
  const initialClauses = [...sortedKB, ...goals];
  const visibleNodes = treeData.nodes.slice(0, visibleSteps);

  const stepMap: Record<string, number> = {};
  if (treeData.nodes.length > 0) {
    stepMap[treeData.nodes[0].id] = initialClauses.length; // goal is last initial row
    treeData.nodes.slice(1).forEach((n, i) => {
      stepMap[n.id] = initialClauses.length + i + 1;
    });
  }

  const nodeClauseRef: Record<string, string> = {};
  treeData.nodes.slice(1).forEach(node => {
    if (node.usedClauseIndex !== undefined) {
      const kbStep = kbOrigIdxToRow[node.usedClauseIndex];
      if (kbStep !== undefined) nodeClauseRef[node.id] = String(kbStep);
    }
  });

  const formatWithBreaks = (text: string) => {
    return text.split(",").map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 && <>,&#8203;</>}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row w-full gap-4 scroll-mt-6">
      <div className="w-full lg:w-[60%] flex flex-col">
        <SLDTree
          treeData={treeData}
          visibleSteps={visibleSteps}
          setVisibleSteps={setVisibleSteps}
          nodeClauseRef={nodeClauseRef}
          highlightedNodeId={highlightedNodeId}
          onNodeClick={(nodeId) => {
            setHighlightedNodeId(prev => prev === nodeId ? null : nodeId);
          }}
          strategy={strategy}
          onStrategyChange={onStrategyChange}
          hasCut={hasCut}
          showAllBranches={showAllBranches}
          onToggleAllBranches={() => setShowAllBranches(v => !v)}
        />
      </div>

      <div className="w-full lg:w-[40%] flex flex-col bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[500px] lg:h-[769px] overflow-hidden">
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">{t("resolution_trace")}</h3>
          <button 
            onClick={copyToLatex}
            className="px-5 py-1.5 min-w-[140px] bg-purple-600 text-white rounded-md border border-purple-600 shadow-sm hover:bg-purple-700 hover:border-purple-700 font-bold transition-all text-sm"
          >
            {t("export_table_latex")}
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto rounded-lg shadow-sm border border-gray-300 dark:border-gray-600">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 shadow-[0_1px_0_#d1d5db]">
              <tr>
                <th className="bg-gray-100 dark:bg-gray-700 border-b border-r border-gray-300 dark:border-gray-600 p-2 font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap w-12 text-center">{t("table_number")}</th>
                <th className="bg-gray-100 dark:bg-gray-700 border-b border-r border-gray-300 dark:border-gray-600 p-2 font-semibold text-gray-700 dark:text-gray-200">{t("clause")}</th>
                <th className="bg-gray-100 dark:bg-gray-700 border-b border-r border-gray-300 dark:border-gray-600 p-2 font-semibold text-gray-700 dark:text-gray-200 text-center whitespace-nowrap">{t("resolved_with")}</th>
                <th className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2 font-semibold text-gray-700 dark:text-gray-200 text-center">{t("unification")}</th>
              </tr>
            </thead>
            <tbody>
              {initialClauses.map((clause, idx) => {
                const isRootGoal = idx === initialClauses.length - 1;
                const nodeId = isRootGoal && treeData.nodes.length > 0 ? treeData.nodes[0].id : null;
                const isHighlighted = highlightedNodeId && nodeId === highlightedNodeId;

                return (
                  <tr
                    id={nodeId ? `row-${nodeId}` : undefined}
                    key={`init-${idx}`}
                    className={`transition-colors ${nodeId ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-50 dark:bg-gray-900'} ${isHighlighted ? 'bg-blue-200 dark:bg-blue-900 hover:bg-blue-300 dark:hover:bg-blue-800' : (nodeId ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : '')}`}
                    onClick={() => nodeId && setHighlightedNodeId(prev => prev === nodeId ? null : nodeId)}
                  >
                    <td className={`border-b border-r border-gray-300 dark:border-gray-600 p-2 font-medium text-center ${isHighlighted ? 'bg-blue-300/50 dark:bg-blue-800/50 text-gray-800 dark:text-gray-100' : (nodeId ? 'bg-gray-50/50 dark:bg-gray-700/30 text-gray-800 dark:text-gray-200' : 'bg-gray-100/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500')}`}>{idx + 1}</td>
                    <td className={`border-b border-r border-gray-300 dark:border-gray-600 p-2 font-mono text-sm break-words ${nodeId ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                      {formatWithBreaks(clause.join(", "))}
                    </td>
                    <td className="border-b border-r border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 font-medium text-center"></td>
                    <td className="border-b border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 font-medium text-center"></td>
                  </tr>
                );
              })}
              
              {visibleNodes.slice(1).map((node, idx) => {
                let resolventText = "";
                let isSpecial = false;

                if (node.goals.length === 0) {
                  resolventText = "□";
                  isSpecial = true;
                } else {
                  resolventText = node.goals.map(g => predicateToString(g)).join(", ");
                }

                const parentStep = node.parent ? stepMap[node.parent] : '?';
                const kbStep = node.usedClauseIndex !== undefined ? kbOrigIdxToRow[node.usedClauseIndex] : node.builtinName ?? '?';
                const resolvedWithText = node.isFailLabel ? "" : `${parentStep},${kbStep}`;
                
                const edge = treeData.edges.find(e => e.target === node.id);
                const unificationText = edge && edge.label ? edge.label : "";
                const displayUnificationText = unificationText === "{}" ? "{ }" : unificationText;
                
                const isHighlighted = highlightedNodeId === node.id;

                return (
                  <tr 
                    id={`row-${node.id}`}
                    key={node.id} 
                    className={`transition-colors cursor-pointer ${isHighlighted ? 'bg-blue-200 dark:bg-blue-900 hover:bg-blue-300 dark:hover:bg-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => setHighlightedNodeId(prev => prev === node.id ? null : node.id)}
                  >
                    <td className={`border-b border-r border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 font-medium text-center ${isHighlighted ? 'bg-blue-300/50 dark:bg-blue-800/50' : 'bg-gray-50/50 dark:bg-gray-700/30'}`}>{initialClauses.length + idx + 1}</td>
                    <td className={`border-b border-r border-gray-300 dark:border-gray-600 p-2 font-mono text-sm break-words ${isSpecial ? (node.isFailLabel ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-gray-100 font-bold') : 'text-gray-800 dark:text-gray-200'}`}>
                      {formatWithBreaks(resolventText)}
                    </td>
                    <td className="border-b border-r border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 font-mono text-sm text-center whitespace-nowrap">{resolvedWithText}</td>
                    <td className="border-b border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 font-mono text-sm text-center break-words">{formatWithBreaks(displayUnificationText)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isLatexModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">{t("export_latex_title")}</h3>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">{t("export_latex_scope")}</label>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" value="table" checked={latexExportType === 'table'} onChange={() => setLatexExportType('table')} className="mr-2 cursor-pointer" />
                  {t("export_latex_table_only")}
                </label>
                <label className="inline-flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" value="document" checked={latexExportType === 'document'} onChange={() => setLatexExportType('document')} className="mr-2 cursor-pointer" />
                  {t("export_latex_full_document")}
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">{t("export_latex_orientation")}</label>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" value="portrait" checked={latexOrientation === 'portrait'} onChange={() => setLatexOrientation('portrait')} className="mr-2 cursor-pointer" />
                  {t("export_latex_portrait")}
                </label>
                <label className="inline-flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input type="radio" value="landscape" checked={latexOrientation === 'landscape'} onChange={() => setLatexOrientation('landscape')} className="mr-2 cursor-pointer" />
                  {t("export_latex_landscape")}
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" onClick={() => setIsLatexModalOpen(false)}>{t("cancel")}</button>
              <button className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors" onClick={handleConfirmLatexCopy}>{t("copy")}</button>
            </div>
          </div>
        </div>
      )}

      {showCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h3 className="text-lg font-bold mb-4 text-amber-800">{t("infinite_cycle_warning")}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t("infinite_cycle_message")}
            </p>
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 text-white bg-amber-500 hover:bg-amber-600 rounded transition-colors" 
                onClick={() => setShowCycleModal(false)}
              >
                {t("infinite_cycle_close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};