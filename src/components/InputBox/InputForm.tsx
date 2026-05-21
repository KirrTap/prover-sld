import { useRef, useState, useMemo } from "react";
import { EXAMPLES } from "../../data/examples";
import { useLanguage } from "../../translations/LanguageContext";
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
}

export const InputForm = ({
  onProcess,
  externalError,
  setExternalError,
}: InputFormProps) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const lineCount = useMemo(() => inputValue.split("\n").length, [inputValue]);
  const [showExamples, setShowExamples] = useState(false);
  const exampleBtnRef = useRef<HTMLButtonElement>(null);
  const handleExampleSelect = (exampleValue: string) => {
    setInputValue(exampleValue);
    setShowExamples(false);
    setExternalError(null);
    onProcess(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
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
      <div className="mb-4">
        <div className="relative inline-block">
          <button
            ref={exampleBtnRef}
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 min-w-[120px] cursor-pointer"
            style={{ minWidth: 120 }}
            onClick={() => setShowExamples((v) => !v)}
          >
            <span className="flex-1 text-left">{t("examples")}</span>
            <svg
              className="w-4 h-4 ml-2"
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
            <div
              className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg mt-1 left-0 min-w-[140px]"
            >
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.labelKey}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer"
                  onClick={() => handleExampleSelect(ex.value)}
                  type="button"
                >
                  {t(ex.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className="flex w-full border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent mb-4 overflow-hidden"
        style={{ height: "12rem", minHeight: "12rem", resize: "vertical" }}
      >
        <div
          ref={lineNumbersRef}
          className="bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 pt-4 pb-4 px-2 select-none text-right text-gray-400 dark:text-gray-500 text-base overflow-hidden flex-shrink-0"
          style={{ minWidth: "2.5rem" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} style={{ height: "1.75rem", lineHeight: "1.75rem" }}>
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleTextareaChange}
          onScroll={(e) => {
            if (lineNumbersRef.current)
              lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
          }}
          spellCheck={false}
          className="flex-1 h-full p-4 resize-none focus:outline-none text-gray-700 dark:text-gray-200 dark:bg-gray-800 text-lg"
          style={{ lineHeight: "1.75rem" }}
        />
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
          <SymbolButton symbol="=>" onClick={handleInsertSymbol} />
          <SymbolButton symbol="¬" onClick={handleInsertSymbol} />
          <SymbolButton symbol="∀" onClick={handleInsertSymbol} />
          <SymbolButton symbol="∃" onClick={handleInsertSymbol} />
        </div>
        <div className="flex items-center gap-12 flex-wrap">
          <ProcessButton onClick={handleProcess} />
        </div>
      </div>
    </div>
  );
};
