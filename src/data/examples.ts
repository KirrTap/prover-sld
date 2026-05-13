export const EXAMPLES: { labelKey: string; value: string }[] = [
  { 
    labelKey: "example_1", 
    value: `parent(jozo, jano).
parent(jozo, erik). 
parent(jozo, maria).
parent(maria, kika).
not_same(jano, maria).
not_same(jano, erik).
sibling(X, Y) :- parent(P, X), parent(P, Y), not_same(X, Y).
?- sibling(jano, S).` 
  },
  { 
    labelKey: "example_2", 
    value: "((∀x)(∀u)(∃m)(((P(x)∧S(x))=>K(x))∧(K(u)∧(L(u)∨O(u))=>B(x))∧P(j)∧S(j)∧L(j)∧O(j)∧P(m)∧S(m)∧L(m)))=>B(S)" 
  },
  {
    labelKey: "example_3",
    value: `edge(a, b).
edge(b, c).
edge(c, d).
edge(a, e).

path(X, Y) :- edge(X, Y).
path(X, Y) :- edge(X, Z), path(Z, Y).

?- path(a, Target).`
  },
];
