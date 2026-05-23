import { useState, useMemo, useEffect } from "react";
import "./index.css";
import { LanguageDropdown } from "./components/TopBar/LanguageDropdown.tsx";
import { ThemeToggle } from "./components/TopBar/ThemeToggle.tsx";
import { Logo } from "./components/TopBar/Logo.tsx";
import { useLanguage } from "./translations/LanguageContext";
import { InputForm, type SearchStrategy } from "./components/InputBox/InputForm.tsx";
import { StepsToSetNotation } from "./components/StepsToSetNotation.tsx";
import { SLDResolutionView } from "./components/SLDResolutionView.tsx";
import { ControlBar } from "./components/ControlBar.tsx";
import { DocumentationModal } from "./components/DocumentationModal.tsx";
import { type LogicToken } from "./utils/tokenizer";

function Content() {
  const { t } = useLanguage();
  const [tokens, setTokens] = useState<LogicToken[] | null>(null);
  const [strategy, setStrategy] = useState<SearchStrategy>("dfs");
  const [error, setError] = useState<{
    key: string;
    params: Record<string, string>;
  } | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const [showAllBranches, setShowAllBranches] = useState(false);
  const [showNumbering, setShowNumbering] = useState(true);
  const [showNegation, setShowNegation] = useState(true);
  const [bracketStyle, setBracketStyle] = useState<"{}" | "[]">("{}");
  const [treeLatexTrigger, setTreeLatexTrigger] = useState(0);
  const [tableLatexTrigger, setTableLatexTrigger] = useState(0);

  const hasCut = useMemo(
    () => tokens?.some((tok) => tok.type === "cut") ?? false,
    [tokens]
  );

  useEffect(() => {
    if (hasCut && strategy === "bfs") setStrategy("dfs");
    if (!hasCut) setShowAllBranches(false);
  }, [hasCut, strategy]);

  const handleProcess = (newTokens: LogicToken[] | null) => {
    setTokens(newTokens);
  };

  const handleParserError = (errorMessage: string) => {
    if (errorMessage.includes("|")) {
      const [key, value] = errorMessage.split("|");
      setError({ key, params: { value } });
    } else {
      setError({
        key: errorMessage,
        params: { value: "" },
      });
    }
    setTokens(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-1">
          <Logo />
          <h1 className="text-3xl font-semibold leading-none dark:text-white">
            {t("title")}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => {}}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 cursor-pointer"
          >
            {t("tutorial")}
          </button>
          <button
            onClick={() => setShowDocs(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 cursor-pointer"
          >
            {t("documentation")}
          </button>
          <ThemeToggle />
          <LanguageDropdown />
        </div>
      </div>
      <InputForm
        onProcess={handleProcess}
        externalError={error}
        setExternalError={setError}
        showSteps={showSteps}
        onToggleSteps={() => setShowSteps((v) => !v)}
      />

      {tokens && !error && (
        <div className="flex flex-col gap-8 mt-8 pb-10">
          {showSteps && <StepsToSetNotation tokens={tokens} onError={handleParserError} />}
          <ControlBar
            strategy={strategy}
            onStrategyChange={setStrategy}
            hasCut={hasCut}
            showAllBranches={showAllBranches}
            onToggleAllBranches={() => setShowAllBranches((v) => !v)}
            showNumbering={showNumbering}
            onToggleNumbering={() => setShowNumbering((v) => !v)}
            showNegation={showNegation}
            onToggleNegation={() => setShowNegation((v) => !v)}
            bracketStyle={bracketStyle}
            onToggleBracketStyle={() =>
              setBracketStyle((s) => (s === "{}" ? "[]" : "{}"))
            }
            onExportTreeLatex={() => setTreeLatexTrigger((n) => n + 1)}
            onExportTableLatex={() => setTableLatexTrigger((n) => n + 1)}
          />
          <SLDResolutionView
            tokens={tokens}
            strategy={strategy}
            onStrategyChange={setStrategy}
            showAllBranches={showAllBranches}
            showNumbering={showNumbering}
            showNegation={showNegation}
            bracketStyle={bracketStyle}
            treeLatexTrigger={treeLatexTrigger}
            tableLatexTrigger={tableLatexTrigger}
            controlBar={
              <ControlBar
                strategy={strategy}
                onStrategyChange={setStrategy}
                hasCut={hasCut}
                showAllBranches={showAllBranches}
                onToggleAllBranches={() => setShowAllBranches((v) => !v)}
                showNumbering={showNumbering}
                onToggleNumbering={() => setShowNumbering((v) => !v)}
                showNegation={showNegation}
                onToggleNegation={() => setShowNegation((v) => !v)}
                bracketStyle={bracketStyle}
                onToggleBracketStyle={() => setBracketStyle((s) => (s === "{}" ? "[]" : "{}"))}
                onExportTreeLatex={() => setTreeLatexTrigger((n) => n + 1)}
                onExportTableLatex={() => setTableLatexTrigger((n) => n + 1)}
              />
            }
          />
        </div>
      )}

      <DocumentationModal isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </div>
  );
}

export default Content;
