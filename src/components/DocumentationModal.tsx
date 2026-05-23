import { useLanguage } from "../translations/LanguageContext";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal = ({ isOpen, onClose }: DocumentationModalProps) => {
  const { t, lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("documentation")}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
          {lang === 'sk' ? (
            <>
              <section>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">1. Zadávanie vstupu</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Ako zapisovať (3 spôsoby):</strong>
                    <ul className="list-[circle] pl-6 mt-2 space-y-1">
                      <li><strong>Klávesnica</strong></li>
                      <li><strong>Tlačidlá</strong></li>
                      <li>
                        <strong>Príkazy:</strong> Typickým LaTeX zápisom.
                        <div className="mt-3 overflow-x-auto">
                          <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                              <tr>
                                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Skratky</th>
                                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 w-16 text-center">Symbol</th>
                                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Popis</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\and, \land, \&amp;, \wedge, {"/\\"}</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∧</td>
                                <td className="px-4 py-2 dark:text-gray-300">Konjunkcia</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\or, \lor, \vee,{"\\/"}
                                </code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∨</td>
                                <td className="px-4 py-2 dark:text-gray-300">Disjunkcia</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\implies, \rightarrow, \to, \=&gt;</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">⇒</td>
                                <td className="px-4 py-2 dark:text-gray-300">Implikácia</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\neg, \not, \!</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">¬</td>
                                <td className="px-4 py-2 dark:text-gray-300">Negácia</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\forall</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∀</td>
                                <td className="px-4 py-2 dark:text-gray-300">Všeobecný kvantifikátor</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\exists</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∃</td>
                                <td className="px-4 py-2 dark:text-gray-300">Existenčný kvantifikátor</td>
                              </tr>
                              <tr className="bg-gray-50 dark:bg-gray-700/40">
                                <td className="px-4 py-2 text-gray-500 dark:text-gray-400 italic text-xs" colSpan={3}>Prologovské rozšírenia</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">!</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">!</td>
                                <td className="px-4 py-2 dark:text-gray-300">Cut — zastaví spätné vyhľadávanie</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">{"\\+"}</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">{"\\+"}</td>
                                <td className="px-4 py-2 dark:text-gray-300">Negácia ako zlyhanie (NAF)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li><strong>Príklady:</strong> Nad textovým poľom sa nachádza tlačidlo <strong>„Príklady"</strong>, kde si viete vybrať z hotových ukážok.</li>
                  <li><strong>Vyhodnotenie:</strong> Transformácia krokov sa spustí po stlačení zeleného tlačidla "Spracovať formulu".</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">2. Čo je vidno po stlačení "Spracovať formulu"</h3>
                <p className="mb-4">
                  Ak zadáte formulu v klasickej logike, najprv sa pod vstupom zobrazia <strong>transformačné kroky</strong>. Tieto kroky sú predvolene zbalené – ak si ich chcete pozrieť detailne, stačí na ne kliknúť a rozbalia sa. Následne sa v spodnej časti obrazovky zobrazí grafická reprezentácia rozdelená na <strong>dve časti</strong>.
                </p>

                <div className="ml-4 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">SLD Strom (Ľavá strana)</h4>
                    <p className="mb-2">Zobrazuje grafický vývoj odvodzovania. Nad stromom sa nachádza hlavný <strong>Tool bar (ovládací panel)</strong>, ktorý obsahuje:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Generovať LaTeX:</strong> Hneď vedľa nadpisu "SLD Strom". Po kliknutí sa vám do schránky skopíruje vygenerovaný LaTeX kód tohto stromu. Skonvertuje sa len to, čo momentálne vidíte.</li>
                      <li><strong>Stratégia prehľadávania:</strong> Prepínač uprostred, kde si viete zvoliť, či sa má použiť <strong>DFS</strong> (do hĺbky) alebo <strong>BFS</strong> (do šírky). Strom aj tabuľka sa hneď prepočítajú.</li>
                      <li><strong>Krokovanie:</strong> Napravo sú tlačidlá pre krokovanie algoritmu. Môžete prechádzať strom po jednom kroku vpred a vzad, alebo kliknúť na tlačidlo „Zobraziť všetko" a nechať si vykresliť celý výsledok naraz.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">Tabuľka (Pravá strana)</h4>
                    <p className="mb-2">Zobrazuje textový priebeh rezolúcie. V tabuľke sa nachádza najprv cieľ, pod ním nasledujú fakty a pravidlá (báza znalostí), a následne sa dopĺňa samotný postup, ako sa vykonáva DFS alebo BFS algoritmus. Tabuľka taktiež obsahuje:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Generovať LaTeX:</strong> Hneď nad tabuľkou (vedľa nadpisu "Priebeh rezolúcie") nájdete <strong>ikonu</strong>, ktorá vám vygeneruje LaTeX kód tejto tabuľky podľa aktuálne viditeľných krokov.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">3. Interaktivita (Prepojenie stromu a tabuľky)</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Kliknutie v strome:</strong> Ak kliknete na nejaký uzol (obdĺžnik) priamo v nakreslenom strome, v tabuľke vpravo sa okamžite nájde a modrou farbou zvýrazní príslušný riadok tohto kroku.</li>
                  <li><strong>Kliknutie v tabuľke:</strong> Ak kliknete na nejaký riadok v tabuľke, strom sa vľavo automaticky odkrokuje na tento stav a daný uzol sa v strome zvýrazní.</li>
                </ul>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">1. Input Entry</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>How to write (3 ways):</strong>
                    <ul className="list-[circle] pl-6 mt-2 space-y-1">
                      <li><strong>Keyboard</strong></li>
                      <li><strong>Buttons</strong></li>
                      <li>
                        <strong>Commands:</strong> Using LaTeX-like notation.
                        <div className="mt-3 overflow-x-auto">
                          <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                              <tr>
                                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Shortcuts</th>
                                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 w-16 text-center">Symbol</th>
                                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\and, \land, \&amp;, \wedge, {"/\\"}</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∧</td>
                                <td className="px-4 py-2 dark:text-gray-300">Conjunction</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\or, \lor, \vee,{"\\/"}
                                </code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∨</td>
                                <td className="px-4 py-2 dark:text-gray-300">Disjunction</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\implies, \rightarrow, \to, \=&gt;</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">⇒</td>
                                <td className="px-4 py-2 dark:text-gray-300">Implication</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\neg, \not, \!</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">¬</td>
                                <td className="px-4 py-2 dark:text-gray-300">Negation</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\forall</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∀</td>
                                <td className="px-4 py-2 dark:text-gray-300">Universal quantifier</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">\exists</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">∃</td>
                                <td className="px-4 py-2 dark:text-gray-300">Existential quantifier</td>
                              </tr>
                              <tr className="bg-gray-50 dark:bg-gray-700/40">
                                <td className="px-4 py-2 text-gray-500 dark:text-gray-400 italic text-xs" colSpan={3}>Prolog extensions</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">!</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">!</td>
                                <td className="px-4 py-2 dark:text-gray-300">Cut — stops backtracking</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2"><code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">{"\\+"}</code></td>
                                <td className="px-4 py-2 text-center font-bold dark:text-gray-200">{"\\+"}</td>
                                <td className="px-4 py-2 dark:text-gray-300">Negation as Failure (NAF)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li><strong>Examples:</strong> Above the text field is an <strong>"Examples"</strong> button where you can select ready-made samples.</li>
                  <li><strong>Process:</strong> The process is started by clicking the green "Process formula" button.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">2. What you see after processing</h3>
                <p className="mb-4">
                  If you enter a formula in classical logic, the <strong>transformation steps</strong> will appear first below the input. These steps are collapsed by default – to view them in detail, simply click on them to expand. Then, the graphical representation is displayed at the bottom, divided into <strong>two connected parts</strong>.
                </p>

                <div className="ml-4 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">SLD Tree (Left side)</h4>
                    <p className="mb-2">Displays the graphical evolution of the derivation. Above the tree is the main <strong>Tool bar</strong> containing:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Generate LaTeX:</strong> Right next to the "SLD Tree" title. Clicking it copies the generated LaTeX code of this tree to your clipboard. It only converts what you currently see.</li>
                      <li><strong>Search Strategy:</strong> A switch in the middle where you can choose between <strong>DFS</strong> (Depth-First) and <strong>BFS</strong> (Breadth-First). The tree and table recalculate immediately.</li>
                      <li><strong>Stepper:</strong> On the right are buttons for stepping through the algorithm. You can step forward and backward, or click "Show all" to draw the entire result at once.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400">Resolution Trace / Table (Right side)</h4>
                    <p className="mb-2">Displays the text-based derivation process. The table first lists the goal, followed by facts and rules (knowledge base), and then the actual steps of the DFS or BFS algorithm are appended. The table also contains:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Generate LaTeX:</strong> Right above the table, you will find an <strong>icon</strong> that generates the LaTeX code for this table based on the currently visible steps.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">3. Interactivity</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Clicking in the tree:</strong> If you click on a node in the drawn tree, the corresponding row in the table on the right is immediately found and highlighted in blue.</li>
                  <li><strong>Clicking in the table:</strong> If you click on a row in the table, the tree on the left automatically steps to this state and the node is highlighted.</li>
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
