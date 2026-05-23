import { useRef, useState, useMemo } from "react";
import { EXAMPLES } from "../../data/examples";
import { useLanguage } from "../../translations/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { replaceShortcutsRealtime } from "../../utils/logicInputShortcuts";
import { logicTokenize, type LogicToken } from "../../utils/tokenizer";
import { ErrorMessage } from "./ErrorMessage";
import { SymbolButton } from "./SymbolButton";
import { ProcessButton } from "./ProcessButton";

export type SearchStrategy = "bfs" | "dfs";

interface InputFormProps {
  onProcess: (tokens: LogicToken[] | null) => void;
  externalError: { key: string; params: Record<string, string> } | null;
  setExternalError: (
    error: { key: string; params: Record<string, string> } | null,
  ) => void;
  showSteps: boolean;
  onToggleSteps: () => void;
}

export const InputForm = ({
  onProcess,
  externalError,
  setExternalError,
  showSteps,
  onToggleSteps,
}: InputFormProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineCount = useMemo(() => inputValue.split("\n").length, [inputValue]);
  const [showExamples, setShowExamples] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const lineHeight = Math.round(fontSize * 1.75);
  const exampleBtnRef = useRef<HTMLButtonElement>(null);
  const handleExampleSelect = (exampleValue: string) => {
    setInputValue(exampleValue);
    setShowExamples(false);
    setExternalError(null);
    onProcess(null);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(0, 0);
        textareaRef.current.scrollTop = 0;
      }
      if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = 0;
      if (highlightRef.current) highlightRef.current.scrollTop = 0;
    }, 0);
  };

  const handleInsertSymbol = (symbol: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        inputValue.slice(0, start) + symbol + inputValue.slice(end);
      setInputValue(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + symbol.length,
          start + symbol.length,
        );
      }, 0);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(replaceShortcutsRealtime(e.target.value));
    setExternalError(null);
    onProcess(null);
  };

  const commentColor = theme === "dark" ? "#6a9955" : "#15803d";
  const caretColor = theme === "dark" ? "#e5e7eb" : "#374151";

  function getHighlightedContent(text: string) {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const pctIdx = line.indexOf("%");
      const isLast = idx === lines.length - 1;
      if (pctIdx === -1) {
        return (
          <span key={idx}>
            {line}
            {!isLast && "\n"}
          </span>
        );
      }
      return (
        <span key={idx}>
          {line.slice(0, pctIdx)}
          <span style={{ color: commentColor }}>{line.slice(pctIdx)}</span>
          {!isLast && "\n"}
        </span>
      );
    });
  }

  const handleProcess = () => {
    const rawTokens = logicTokenize(inputValue);
    const unknownToken = rawTokens.find(
      (t): t is { type: "unknown"; value: string } => t.type === "unknown",
    );

    if (unknownToken) {
      setExternalError({
        key: "errors.error_unknown_character",
        params: {
          value: unknownToken.value,
        },
      });
      onProcess(null);
      return;
    }

    setExternalError(null);
    onProcess(rawTokens);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-4 px-8 flex flex-col">
      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {t("enter_formula")}
      </label>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative" style={{ display: "inline-grid" }}>
          {/* Invisible sizer — determines width from longest example label */}
          <div
            className="invisible pointer-events-none select-none flex items-center gap-2 px-4 py-2 font-medium whitespace-nowrap"
            style={{ gridArea: "1/1" }}
            aria-hidden="true"
          >
            <span className="flex-1">
              {EXAMPLES.reduce((longest, ex) => {
                const label = t(ex.labelKey);
                return label.length > longest.length ? label : longest;
              }, t("examples"))}
            </span>
            <span className="w-6 flex-shrink-0" />
          </div>
          <button
            ref={exampleBtnRef}
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
            style={{ gridArea: "1/1" }}
            onClick={() => setShowExamples((v) => !v)}
          >
            <span className="flex-1 text-left">{t("examples")}</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${showExamples ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showExamples && (
            <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg top-full mt-1 left-0 w-full">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.labelKey}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => handleExampleSelect(ex.value)}
                  type="button"
                >
                  {t(ex.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2">
          <span className="text-gray-800 dark:text-gray-200 whitespace-nowrap font-medium">{t("font_size")}</span>
          <button
            type="button"
            onClick={() => setFontSize(v => Math.max(10, v - 1))}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-lg leading-none select-none cursor-pointer"
          >−</button>
          <span className="w-8 text-center text-gray-800 dark:text-gray-200 font-medium tabular-nums">{fontSize}</span>
          <button
            type="button"
            onClick={() => setFontSize(v => Math.min(32, v + 1))}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-lg leading-none select-none cursor-pointer"
          >+</button>
          <span className="text-gray-800 dark:text-gray-200">px</span>
        </div>
      </div>
      <div
        className="flex w-full border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent mb-4 overflow-hidden"
        style={{ height: "18rem", minHeight: "18rem", resize: "vertical" }}
      >
        <div
          ref={lineNumbersRef}
          className="bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 pt-4 pb-4 px-2 select-none text-right text-gray-400 dark:text-gray-500 text-base overflow-hidden flex-shrink-0"
          style={{ minWidth: "2.5rem" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight}px`, fontSize: `${fontSize}px` }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex-1 relative bg-white dark:bg-gray-800 overflow-hidden">
          <div
            ref={highlightRef}
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none select-none text-gray-700 dark:text-gray-200"
            style={{
              padding: "1rem",
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              fontFamily: "inherit",
            }}
          >
            {getHighlightedContent(inputValue)}
          </div>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onScroll={(e) => {
              if (lineNumbersRef.current)
                lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
              if (highlightRef.current) {
                highlightRef.current.scrollTop = e.currentTarget.scrollTop;
                highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
              }
            }}
            spellCheck={false}
            className="absolute inset-0 w-full h-full resize-none focus:outline-none"
            style={{
              padding: "1rem",
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              fontFamily: "inherit",
              background: "transparent",
              color: "transparent",
              caretColor: caretColor,
              border: "none",
              outline: "none",
              overflow: "auto",
            }}
          />
        </div>
      </div>
      {externalError && (
        <ErrorMessage
          message={t(externalError.key).replace(
            "{value}",
            externalError.params.value,
          )}
        />
      )}
      <div className="flex flex-wrap gap-4 items-end justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          <SymbolButton symbol="∧" onClick={handleInsertSymbol} />
          <SymbolButton symbol="∨" onClick={handleInsertSymbol} />
          <SymbolButton symbol="⇒" onClick={handleInsertSymbol} />
          <SymbolButton symbol="¬" onClick={handleInsertSymbol} />
          <SymbolButton symbol="∀" onClick={handleInsertSymbol} />
          <SymbolButton symbol="∃" onClick={handleInsertSymbol} />
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
              {t("show_transformation_steps")}
            </span>
            <div
              onClick={onToggleSteps}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showSteps ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showSteps ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
          </label>
          <ProcessButton onClick={handleProcess} />
        </div>
      </div>
    </div>
  );
};
