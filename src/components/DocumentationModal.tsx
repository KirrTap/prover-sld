import { useState } from "react";
import { useLanguage } from "../translations/LanguageContext";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShortcutsTable = ({ isSk }: { isSk: boolean }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-600">
      <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{isSk ? "Skratky" : "Shortcuts"}</th>
          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 w-16 text-center">Symbol</th>
          <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{isSk ? "Popis" : "Description"}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\and, \land, \&amp;, \wedge, {"/\\"}</code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∧</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Konjunkcia" : "Conjunction"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\or, \lor, \vee, {"\\/"}
          </code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∨</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Disjunkcia" : "Disjunction"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\implies, \rightarrow, \to, \=&gt;, =&gt;</code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">⇒</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Implikácia" : "Implication"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\neg, \not, \!</code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">¬</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Negácia" : "Negation"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\forall</code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∀</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Všeobecný kvantifikátor" : "Universal quantifier"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\exists</code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∃</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Existenčný kvantifikátor" : "Existential quantifier"}</td>
        </tr>
        <tr className="bg-gray-50 dark:bg-gray-700/40">
          <td className="px-4 py-2 text-gray-500 dark:text-gray-400 italic text-xs" colSpan={3}>
            {isSk ? "Prologovské rozšírenia" : "Prolog extensions"}
          </td>
        </tr>
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">!</code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">!</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Cut - zastaví spätné vyhľadávanie" : "Cut - stops backtracking"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">{"\\+"}</code></td>
          <td className="px-4 py-2 text-center font-bold dark:text-gray-200">{"\\+"}</td>
          <td className="px-4 py-2 dark:text-gray-300">{isSk ? "Negácia ako zlyhanie (NAF)" : "Negation as Failure (NAF)"}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const OverviewTab = ({ isSk }: { isSk: boolean }) => isSk ? (
  <>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">O aplikácii</h3>
      <p className="mb-3">
        <strong>ProverSLD</strong> je interaktívny nástroj na demonštráciu <strong>SLD rezolúcie</strong> - metódy automatického dokazovania používanej v logickom programovaní. Aplikácia podporuje dva vstupné jazyky:
      </p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li><strong>Logika prvého rádu (predikátová logika)</strong> - formula sa automaticky transformuje do klauzálnej formy a vykoná sa SLD rezolúcia.</li>
        <li><strong>Prolog</strong> - pravidlá, fakty a cieľ sa zadávajú priamo v Prologovskom zápise.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Výstup aplikácie</h3>
      <p className="mb-4">Po stlačení tlačidla <strong>„Spracovať formulu"</strong> sa zobrazí výsledok v niekoľkých častiach.</p>
      <div className="ml-4 space-y-4">
        <div>
          <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">Transformačné kroky (voliteľné)</h4>
          <p>Zobrazujú postup prevodu formuly do klauzálnej formy (NNF → PNF → SNF → CNF → množina klauzúl). Predvolene sú zbalené - kliknutím sa rozvinú. Pomocou prepínača <em>„Zobraziť kroky transformácie"</em> ich môžete úplne skryť.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">SLD Strom (ľavá strana)</h4>
          <p className="mb-2">Grafická reprezentácia priebehu odvodzovania. Nad stromom sa nachádza lišta s tlačidlami krokovania (Predchádzajúci / Nasledujúci / Zobraz všetko).</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">Priebeh rezolúcie - Tabuľka (pravá strana)</h4>
          <p>Textový zápis priebehu rezolúcie. Obsahuje cieľ, bázu znalostí a jednotlivé kroky algoritmu.</p>
        </div>
      </div>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Panel nastavení</h3>
      <p className="mb-3">Panel medzi transformačnými krokmi a výstupom obsahuje tieto ovládacie prvky:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>DFS / BFS</strong> - prepínač stratégie prehľadávania (do hĺbky / do šírky). Pri použití rezu (!) je BFS nedostupné.</li>
        <li><strong>Ukázať vetvy bez rezu</strong> - zobrazí sa iba ak vstup obsahuje cut (!). Prepína zobrazenie odrezaných vetiev stromu.</li>
        <li><strong>Číslovanie v strome</strong> - zobrazuje/skrýva oranžové čísla na hranách stromu označujúce, ktorá klauzula z bázy znalostí bola použitá.</li>
        <li><strong>Negácia v strome</strong> - zobrazuje/skrýva symbol ¬ v uzloch stromu.</li>
        <li><strong>Unifikačné zátvorky</strong> - prepína formát zápisu unifikačných substitúcií medzi {"{ }"} a {"[ ]"}.</li>
        <li><strong>Generovať LaTeX Strom / Tabuľku</strong> - otvorí dialóg s možnosťami exportu a skopíruje LaTeX kód do schránky.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Prepojenie stromu a tabuľky</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Kliknutie na uzol v strome</strong> - v tabuľke sa okamžite zvýrazní príslušný riadok.</li>
        <li><strong>Kliknutie na riadok v tabuľke</strong> - strom sa odkrokuje na daný stav a príslušný uzol sa zvýrazní.</li>
      </ul>
    </section>
  </>
) : (
  <>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">About</h3>
      <p className="mb-3">
        <strong>ProverSLD</strong> is an interactive tool for demonstrating <strong>SLD resolution</strong> - a method of automated theorem proving used in logic programming. The application supports two input languages:
      </p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li><strong>First-Order Logic (predicate logic)</strong> - the formula is automatically transformed into clausal form and SLD resolution is performed.</li>
        <li><strong>Prolog</strong> - rules, facts, and a goal are entered directly in Prolog notation.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Application Output</h3>
      <p className="mb-4">After clicking <strong>"Process formula"</strong>, the result is displayed in several parts.</p>
      <div className="ml-4 space-y-4">
        <div>
          <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">Transformation Steps (optional)</h4>
          <p>Show the step-by-step conversion of the formula to clausal form (NNF → PNF → SNF → CNF → clause set). Collapsed by default - click to expand. Use the <em>"Show transformation steps"</em> toggle to hide them entirely.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">SLD Tree (left side)</h4>
          <p className="mb-2">Graphical representation of the derivation. Above the tree is a stepper toolbar with Prev / Next / Show All buttons.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">Resolution Trace - Table (right side)</h4>
          <p>Text-based representation of the resolution process. Contains the goal, knowledge base, and individual algorithm steps.</p>
        </div>
      </div>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Settings Panel</h3>
      <p className="mb-3">The panel between the transformation steps and the output contains the following controls:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>DFS / BFS</strong> - search strategy toggle (Depth-First / Breadth-First). BFS is disabled when cut (!) is used.</li>
        <li><strong>Show branches without cut</strong> - only appears when the input contains cut (!). Toggles visibility of pruned branches in the tree.</li>
        <li><strong>Numbering in tree</strong> - shows/hides the orange numbers on tree edges indicating which knowledge base clause was used.</li>
        <li><strong>Negation in tree</strong> - shows/hides the ¬ symbol in tree nodes.</li>
        <li><strong>Unification Bracket</strong> - switches the format of unification substitutions between {"{ }"} and {"[ ]"}.</li>
        <li><strong>Generate LaTeX Tree / Table</strong> - opens an export dialog and copies the LaTeX code to your clipboard.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Tree and Table Interaction</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Clicking a node in the tree</strong> - the corresponding row in the table is immediately highlighted.</li>
        <li><strong>Clicking a row in the table</strong> - the tree steps to that state and the node is highlighted.</li>
      </ul>
    </section>
  </>
);

const InputTab = ({ isSk }: { isSk: boolean }) => isSk ? (
  <>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Spôsoby zadávania</h3>
      <ul className="list-disc pl-5 space-y-3">
        <li><strong>Klávesnica</strong> - priamy zápis symbolov (∧, ∨, ⇒, ¬, ∀, ∃).</li>
        <li><strong>Tlačidlá symbolov</strong> - pod textovým poľom sa nachádzajú tlačidlá pre rýchle vloženie operátorov.</li>
        <li>
          <strong>Skratky (LaTeX-like zápis)</strong> - počas písania sa skratky automaticky nahradzujú príslušnými symbolmi:
          <ShortcutsTable isSk={true} />
        </li>
        <li><strong>Príklady</strong> - tlačidlo <strong>„Príklady"</strong> nad textovým poľom umožňuje načítať hotové ukážky.</li>
        <li><strong>Veľkosť písma</strong> - vedľa tlačidla Príklady si môžete nastaviť veľkosť písma v textovom poli.</li>
        <li><strong>Komentáre</strong> - znak <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">%</code> začína komentár kdekoľvek na riadku, všetko za ním sa pri spracovaní ignoruje.</li>
      </ul>
    </section>
  </>
) : (
  <>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">Input Methods</h3>
      <ul className="list-disc pl-5 space-y-3">
        <li><strong>Keyboard</strong> - directly type symbols (∧, ∨, ⇒, ¬, ∀, ∃).</li>
        <li><strong>Symbol buttons</strong> - buttons below the text area for quick symbol insertion.</li>
        <li>
          <strong>Shortcuts (LaTeX-like notation)</strong> - shortcuts are automatically replaced with the corresponding symbol as you type:
          <ShortcutsTable isSk={false} />
        </li>
        <li><strong>Examples</strong> - the <strong>"Examples"</strong> button above the text area lets you load ready-made samples.</li>
        <li><strong>Font size</strong> - next to the Examples button you can adjust the font size in the text area.</li>
        <li><strong>Comments</strong> - the <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">%</code> character starts a comment anywhere on a line, everything after it is ignored during processing.</li>
      </ul>
    </section>
  </>
);

const ExamplesTab = ({ isSk }: { isSk: boolean }) => (
  <>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">
        {isSk ? "Príklady - Logika prvého rádu" : "Examples - First-Order Logic"}
      </h3>
      <div className="space-y-3">
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm font-mono text-gray-800 dark:text-gray-200">{"(∀x)(human(x) ⇒ mortal(x)) ∧ human(socrates)"}</div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm font-mono text-gray-800 dark:text-gray-200">{"(∀x)(∀y)(parent(x, y) ⇒ ancestor(x, y))"}</div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm font-mono text-gray-800 dark:text-gray-200">{"(∃x)(student(x) ∧ ¬fails(x))"}</div>
      </div>
    </section>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">
        {isSk ? "Príklady - Prolog" : "Examples - Prolog"}
      </h3>
      <div className="space-y-3">
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{"parent(tom, bob).\nparent(bob, ann).\nparent(bob, pat).\n\nancestor(X, Y) :- parent(X, Y).\nancestor(X, Y) :- parent(X, Z), ancestor(Z, Y).\n\n?- ancestor(tom, ann)."}</div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isSk ? "Rez" : "Cut"}</p>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{"i(1).\ni(2).\nj(1).\nq(X,Y):- i(X), !, j(Y).\n\n?- q(X,Y)."}</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isSk ? "Negácia ako zlyhanie" : "Negation as Failure"}</p>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{"bird(x).\npenguin(y).\nbird(y).\n\nflies(X) :- bird(X), \\+penguin(X).\n\n?- flies(x)."}</div>
        </div>
      </div>
    </section>
  </>
);

const GrammarRow = ({ rule, def, comment }: { rule: string; def: string; comment?: string }) => (
  <tr>
    <td className="px-4 py-2 font-mono text-blue-700 dark:text-blue-400 whitespace-nowrap align-top">{rule}</td>
    <td className="px-4 py-2 font-mono text-gray-500 dark:text-gray-400 align-top">::=</td>
    <td className="px-4 py-2 align-top">
      <span className="font-mono text-gray-800 dark:text-gray-200 text-sm">{def}</span>
      {comment && <span className="ml-3 text-xs text-gray-400 dark:text-gray-500 italic">{comment}</span>}
    </td>
  </tr>
);

const GrammarTab = ({ isSk }: { isSk: boolean }) => (
  <>
    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">
        {isSk ? "Gramatika - Logika prvého rádu" : "Grammar - First-Order Logic"}
      </h3>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{isSk ? "Zápis vo formáte BNF. Symbol | oddeľuje alternatívy." : "BNF notation. The | symbol separates alternatives."}</p>
      <div className="overflow-x-auto">
        <table className="text-sm text-left w-full border border-gray-200 dark:border-gray-600 rounded">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            <GrammarRow
              rule={isSk ? "Formula" : "Formula"}
              def={isSk ? "Formula ⇒ Formula | Formula ∨ Formula | Formula ∧ Formula | ¬Formula | (∀x)Formula | (∃x)Formula | Predikát(Term,...,Term) | Predikát" : "Formula ⇒ Formula | Formula ∨ Formula | Formula ∧ Formula | ¬Formula | (∀x)Formula | (∃x)Formula | Predicate(Term,...,Term) | Predicate"}
            />
            <GrammarRow
              rule={isSk ? "Term" : "Term"}
              def={isSk ? "Premenná | Konštanta | Funkcia(Term,...,Term)" : "Variable | Constant | Function(Term,...,Term)"}
            />
            <GrammarRow
              rule={isSk ? "Predikát" : "Predicate"}
              def={isSk ? "identifikátor na úrovni formuly (veľkosť písmen nie je rozhodujúca)" : "identifier at formula level (case-insensitive)"}
            />
            <GrammarRow
              rule={isSk ? "Premenná" : "Variable"}
              def={isSk ? "identifikátor viazaný kvantifikátorom (veľkosť písmen nie je rozhodujúca)" : "identifier bound by a quantifier (case-insensitive)"}
            />
            <GrammarRow
              rule={isSk ? "Konštanta" : "Constant"}
              def={isSk ? "identifikátor v pozícii argumentu, neviazaný kvantifikátorom" : "identifier in argument position, not bound by a quantifier"}
            />
            <GrammarRow
              rule={isSk ? "Funkcia" : "Function"}
              def={isSk ? "identifikátor s argumentmi v zátvorkách, v pozícii argumentu" : "identifier with arguments in parentheses, in argument position"}
            />
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {isSk
          ? "Podmienka: formula musí obsahovať aspoň jednu binárnu spojku (⇒, ∨, ∧)."
          : "Constraint: the formula must contain at least one binary connective (⇒, ∨, ∧)."}
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">
        {isSk ? "Gramatika - Prolog" : "Grammar - Prolog"}
      </h3>
      <div className="overflow-x-auto">
        <table className="text-sm text-left w-full border border-gray-200 dark:border-gray-600 rounded">
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            <GrammarRow
              rule={isSk ? "Klauzula" : "Clause"}
              def={isSk ? "Predikát. | Predikát :- Telo. | ?- Telo." : "Predicate. | Predicate :- Body. | ?- Body."}
            />
            <GrammarRow
              rule={isSk ? "Telo" : "Body"}
              def={isSk ? "Literál | Literál , Telo" : "Literal | Literal , Body"}
            />
            <GrammarRow
              rule={isSk ? "Literál" : "Literal"}
              def={isSk ? "Predikát | \\+Predikát | !" : "Predicate | \\+Predicate | !"}
            />
            <GrammarRow
              rule={isSk ? "Predikát" : "Predicate"}
              def={isSk ? "názov(Term,...,Term) | názov" : "name(Term,...,Term) | name"}
            />
            <GrammarRow
              rule={isSk ? "Term" : "Term"}
              def={isSk ? "Premenná | Konštanta | Funkcia(Term,...,Term)" : "Variable | Constant | Function(Term,...,Term)"}
            />
            <GrammarRow
              rule={isSk ? "Premenná" : "Variable"}
              def={isSk ? "identifikátor začínajúci veľkým písmenom" : "identifier starting with an uppercase letter"}
            />
            <GrammarRow
              rule={isSk ? "Konštanta" : "Constant"}
              def={isSk ? "identifikátor začínajúci malým písmenom" : "identifier starting with a lowercase letter"}
            />
            <GrammarRow
              rule={isSk ? "Funkcia" : "Function"}
              def={isSk ? "identifikátor s argumentmi v zátvorkách" : "identifier with arguments in parentheses"}
            />
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {isSk
          ? "Detekcia jazyka prebieha automaticky - vstup obsahujúci ?- alebo :- je spracovaný ako Prolog, inak ako logika prvého rádu."
          : "Language detection is automatic - input containing ?- or :- is treated as Prolog, otherwise as first-order logic."}
      </p>
    </section>
  </>
);

export const DocumentationModal = ({ isOpen, onClose }: DocumentationModalProps) => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const isSk = lang === 'sk';

  const tabs = isSk
    ? [
        { id: 'overview', label: 'Prehľad' },
        { id: 'input', label: 'Vstup' },
        { id: 'grammar', label: 'Gramatika' },
        { id: 'examples', label: 'Príklady' },
      ]
    : [
        { id: 'overview', label: 'Overview' },
        { id: 'input', label: 'Input' },
        { id: 'grammar', label: 'Grammar' },
        { id: 'examples', label: 'Examples' },
      ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("documentation")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
          {activeTab === 'overview' && <OverviewTab isSk={isSk} />}
          {activeTab === 'input' && <InputTab isSk={isSk} />}
          {activeTab === 'grammar' && <GrammarTab isSk={isSk} />}
          {activeTab === 'examples' && <ExamplesTab isSk={isSk} />}
        </div>
      </div>
    </div>
  );
};
