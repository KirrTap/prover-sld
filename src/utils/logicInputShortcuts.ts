export const LOGIC_SYMBOL_REPLACEMENTS = [
  { shortcut: /\\and|\\land|\\&|\\wedge|\/\\/g, symbol: "∧" },
  { shortcut: /\\lor|\\or|\\vee|\\\//g, symbol: "∨" },
  { shortcut: /\\implies|\\rightarrow|\\to|\\=>/g, symbol: "⇒" },
  { shortcut: /\\neg|\\not|\\!/g, symbol: "¬" },
  { shortcut: /\\forall/g, symbol: "∀" },
  { shortcut: /\\exists/g, symbol: "∃" },
];

export function replaceShortcutsRealtime(str: string) {
  return str
    .split("\n")
    .map((line) => {
      const pctIdx = line.indexOf("%");
      const code = pctIdx === -1 ? line : line.slice(0, pctIdx);
      const comment = pctIdx === -1 ? "" : line.slice(pctIdx);
      let out = code;
      for (const { shortcut, symbol } of LOGIC_SYMBOL_REPLACEMENTS) {
        out = out.replace(shortcut, symbol);
      }
      return out + comment;
    })
    .join("\n");
}
