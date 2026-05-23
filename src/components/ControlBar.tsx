import { useLanguage } from "../translations/LanguageContext";
import { SearchStrategySwitcher } from "./InputBox/SearchStrategySwitcher";

interface ControlBarProps {
  strategy: "dfs" | "bfs";
  onStrategyChange: (s: "dfs" | "bfs") => void;
  hasCut: boolean;
  showAllBranches: boolean;
  onToggleAllBranches: () => void;
  showNumbering: boolean;
  onToggleNumbering: () => void;
  showNegation: boolean;
  onToggleNegation: () => void;
  bracketStyle: "{}" | "[]";
  onToggleBracketStyle: () => void;
  onExportTreeLatex: () => void;
  onExportTableLatex: () => void;
}

const ToggleSwitch = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <span className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
      {label}
    </span>
    <div
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
        checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-500"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  </label>
);

const Divider = () => (
  <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
);

export const ControlBar = ({
  strategy,
  onStrategyChange,
  hasCut,
  showAllBranches,
  onToggleAllBranches,
  showNumbering,
  onToggleNumbering,
  showNegation,
  onToggleNegation,
  bracketStyle,
  onToggleBracketStyle,
  onExportTreeLatex,
  onExportTableLatex,
}: ControlBarProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-6 py-3 flex flex-wrap items-center gap-6">
      <SearchStrategySwitcher
        strategy={strategy}
        setStrategy={onStrategyChange}
        hasCut={hasCut}
        showAllBranches={showAllBranches}
        onToggleAllBranches={onToggleAllBranches}
      />

      <Divider />

      <ToggleSwitch
        label={t("show_numbering_in_tree")}
        checked={showNumbering}
        onToggle={onToggleNumbering}
      />

      <ToggleSwitch
        label={t("show_negation_in_tree")}
        checked={showNegation}
        onToggle={onToggleNegation}
      />

      <Divider />

      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
          {t("bracket_style")}
        </span>
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
          <button
            onClick={() => bracketStyle !== "{}" && onToggleBracketStyle()}
            className={`px-3 py-1 text-sm font-bold rounded-md transition-all cursor-pointer ${
              bracketStyle === "{}"
                ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-gray-600/50"
            }`}
          >
            {"{ }"}
          </button>
          <button
            onClick={() => bracketStyle !== "[]" && onToggleBracketStyle()}
            className={`px-3 py-1 text-sm font-bold rounded-md transition-all cursor-pointer ${
              bracketStyle === "[]"
                ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-gray-600/50"
            }`}
          >
            {"[ ]"}
          </button>
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={onExportTreeLatex}
        className="px-5 py-1.5 bg-purple-600 text-white rounded-md border border-purple-600 shadow-sm hover:bg-purple-700 hover:border-purple-700 font-bold transition-all text-sm whitespace-nowrap cursor-pointer"
      >
        {t("export_tree_latex")}
      </button>
      <button
        onClick={onExportTableLatex}
        className="px-5 py-1.5 bg-purple-600 text-white rounded-md border border-purple-600 shadow-sm hover:bg-purple-700 hover:border-purple-700 font-bold transition-all text-sm whitespace-nowrap cursor-pointer"
      >
        {t("export_table_latex")}
      </button>
    </div>
  );
};
