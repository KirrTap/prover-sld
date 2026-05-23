export const EXAMPLES: { labelKey: string; value: string }[] = [
  { 
    labelKey: "example_1", 
    value: "((∀x)(∀u)(∃m)(((P(x)∧S(x))⇒K(x))∧(K(u)∧(L(u)∨O(u))⇒B(x))∧P(j)∧S(j)∧L(j)∧O(j)∧P(m)∧S(m)∧L(m)))⇒B(S)" 
  },
  { 
    labelKey: "example_2", 
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
    labelKey: "example_3",
    value: 
`i(1).
i(2).
j(1).
j(2).
j(3).
q(X,Y):- i(X), !, j(Y).
?- q(X,Y).`
  },
  {
    labelKey: "example_4",
    value: 
`person(john).
person(mary).
person(peter).
person(eve).
works(john).
works(mary).
student(peter).
student(eve).
has_car(john).
has_car(peter).
can_travel_by_car(X) :- person(X), has_car(X), \\+ student(X).
?- can_travel_by_car(X).`
  }
];
