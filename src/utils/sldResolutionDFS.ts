import { parseLiteralToPredicate, unifyPredicates, applySubstitutionToPredicate, termToString, type Predicate, type Term } from "./unification";

export interface SLDNode {
  id: string;
  goals: Predicate[];
  parent?: string;
  usedRule?: string;
  usedClauseIndex?: number;
  builtinName?: string;
  subst?: Record<string, string>;
  status: "open" | "success" | "failure";
  isFailLabel?: boolean;
  isCut?: boolean;
  isPruned?: boolean;
}

export interface SLDEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  isPruned?: boolean;
}

export interface SLDTreeData {
  nodes: SLDNode[];
  edges: SLDEdge[];
  hitMaxDepth: boolean;
}

export function isCutPredicate(p: Predicate): boolean {
  return p.name === "!" && p.args.length === 0;
}

export function isTruePredicate(p: Predicate): boolean {
  return p.name === "true" && p.args.length === 0 && !p.isNegated;
}

export function isFailPredicate(p: Predicate): boolean {
  return p.name === "fail" && p.args.length === 0 && !p.isNegated;
}

export function isNAFPredicate(p: Predicate): boolean {
  return p.name === "\\+" && p.args.length === 1 && !p.isNegated;
}

export function extractNAFGoalPredicate(p: Predicate): Predicate {
  const inner = p.args[0];
  if (inner.type === "Function") {
    return { name: inner.name, args: inner.args, isNegated: true };
  }
  return { name: inner.name, args: [], isNegated: true };
}

export function tryProveGoals(
  goals: Predicate[],
  kbParsed: Predicate[][],
  maxDepth: number,
  depth = 0,
): boolean {
  if (depth >= maxDepth) return false;
  if (goals.length === 0) return true;

  const [first, ...rest] = goals;

  if (first.name === "true" && first.args.length === 0) return tryProveGoals(rest, kbParsed, maxDepth, depth);
  if (first.name === "fail" && first.args.length === 0) return false;
  if (first.name === "!" && first.args.length === 0) return tryProveGoals(rest, kbParsed, maxDepth, depth);
  if (first.name === "\\+" && first.args.length === 1) {
    const inner = extractNAFGoalPredicate(first);
    if (tryProveGoals([inner], kbParsed, maxDepth, depth + 1)) return false;
    return tryProveGoals(rest, kbParsed, maxDepth, depth);
  }

  const renameTerm = (t: Term, sfx: number): Term => {
    if (t.type === "Variable") return { type: "Variable", name: `${t.name}_tp${sfx}` };
    if (t.type === "Function") return { type: "Function", name: t.name, args: t.args.map(a => renameTerm(a, sfx)) };
    return t;
  };

  for (let kbIdx = 0; kbIdx < kbParsed.length; kbIdx++) {
    const sfx = depth * 10000 + kbIdx;
    const kbClause = kbParsed[kbIdx].map(p => ({ ...p, args: p.args.map((a: Term) => renameTerm(a, sfx)) }));
    for (let headIdx = 0; headIdx < kbClause.length; headIdx++) {
      if (kbClause[headIdx].isNegated === first.isNegated) continue;
      const subst = unifyPredicates(
        { ...first, isNegated: false },
        { ...kbClause[headIdx], isNegated: false },
      );
      if (subst) {
        const kbBody = kbClause.filter((_, idx) => idx !== headIdx);
        const nextGoals = [...kbBody, ...rest].map(g => applySubstitutionToPredicate(g, subst));
        if (tryProveGoals(nextGoals, kbParsed, maxDepth, depth + 1)) return true;
      }
    }
  }
  return false;
}

export function generateSLDTreeDFS(knowledgeBase: string[][], initialGoals: string[][], maxDepth: number = 15, variables: string[] = []): SLDTreeData {
  const nodes: SLDNode[] = [];
  const edges: SLDEdge[] = [];
  let hitMaxDepth = false;

  if (initialGoals.length === 0) return { nodes, edges, hitMaxDepth };

  const kbParsed = knowledgeBase.map(clause => clause.map(lit => parseLiteralToPredicate(lit, variables)));
  const rootGoals = initialGoals[0].map(lit => parseLiteralToPredicate(lit, variables));

  let nodeIdCounter = 0;

  const rootNode: SLDNode = {
    id: `n${nodeIdCounter++}`,
    goals: rootGoals,
    status: "open"
  };

  nodes.push(rootNode);

  function renameVariablesInClause(clause: Predicate[], suffix: number): Predicate[] {
    const renameTerm = (t: Term): Term => {
      if (t.type === "Variable") return { type: "Variable", name: `${t.name}_${suffix}` };
      if (t.type === "Function") return { type: "Function", name: t.name, args: t.args.map(renameTerm) };
      return t;
    };
    return clause.map(p => ({ ...p, args: p.args.map(renameTerm) }));
  }

  function explore(node: SLDNode, depth: number, isPruned: boolean = false): boolean {
    if (depth >= maxDepth) {
      node.status = "failure";
      hitMaxDepth = true;
      return false;
    }

    if (node.goals.length === 0) {
      node.status = "success";
      return false;
    }

    if (isCutPredicate(node.goals[0])) {
      node.isCut = true;
      const remainingAfterCut = node.goals.slice(1);
      const cutChildId = `n${nodeIdCounter++}`;
      const cutChildNode: SLDNode = {
        id: cutChildId,
        goals: remainingAfterCut,
        parent: node.id,
        builtinName: "!",
        status: remainingAfterCut.length === 0 ? "success" : "open",
        isPruned: isPruned,
      };
      nodes.push(cutChildNode);
      edges.push({
        id: `e-${node.id}-${cutChildId}`,
        source: node.id,
        target: cutChildId,
        label: "{ }",
        isPruned: isPruned,
      });
      explore(cutChildNode, depth + 1, isPruned);
      return true;
    }

    if (isTruePredicate(node.goals[0])) {
      const remainingAfterTrue = node.goals.slice(1);
      const trueChildId = `n${nodeIdCounter++}`;
      const trueChildNode: SLDNode = {
        id: trueChildId,
        goals: remainingAfterTrue,
        parent: node.id,
        builtinName: "true",
        status: remainingAfterTrue.length === 0 ? "success" : "open",
        isPruned: isPruned,
      };
      nodes.push(trueChildNode);
      edges.push({
        id: `e-${node.id}-${trueChildId}`,
        source: node.id,
        target: trueChildId,
        label: "{ }",
        isPruned: isPruned,
      });
      explore(trueChildNode, depth + 1, isPruned);
      return false;
    }

    if (isFailPredicate(node.goals[0])) {
      node.status = "failure";
      return false;
    }

    if (isNAFPredicate(node.goals[0])) {
      const innerGoal = extractNAFGoalPredicate(node.goals[0]);
      const provable = tryProveGoals([innerGoal], kbParsed, maxDepth, depth + 1);
      const remainingAfterNAF = node.goals.slice(1);
      const nafChildId = `n${nodeIdCounter++}`;
      const nafChildNode: SLDNode = {
        id: nafChildId,
        goals: provable ? [] : remainingAfterNAF,
        parent: node.id,
        builtinName: "\\+",
        status: provable ? "failure" : (remainingAfterNAF.length === 0 ? "success" : "open"),
        isPruned: isPruned,
      };
      nodes.push(nafChildNode);
      edges.push({
        id: `e-${node.id}-${nafChildId}`,
        source: node.id,
        target: nafChildId,
        label: "{ }",
        isPruned: isPruned,
      });
      if (!provable) {
        explore(nafChildNode, depth + 1, isPruned);
      }
      return false;
    }

    const currentGoal = node.goals[0];
    const remainingGoals = node.goals.slice(1);
    let hasChildren = false;
    let propagateCut = false;
    let pruningActive = isPruned;

    for (let kbIdx = 0; kbIdx < kbParsed.length; kbIdx++) {
      const kbClause = renameVariablesInClause(kbParsed[kbIdx], nodeIdCounter);

      for (let headIdx = 0; headIdx < kbClause.length; headIdx++) {
        if (kbClause[headIdx].isNegated === currentGoal.isNegated) continue;

        const head = kbClause[headIdx];
        const goalToUnify = { ...currentGoal, isNegated: false };
        const headToUnify = { ...head, isNegated: false };
        const subst = unifyPredicates(goalToUnify, headToUnify);

        if (subst) {
          hasChildren = true;

          const kbBody = kbClause.filter((_, idx) => idx !== headIdx);
          const bodyHasCut = kbBody.some(isCutPredicate);
          const newSubGoals = kbBody.map(p => ({ ...p }));
          const nextGoalsUnsubstituted = [...newSubGoals, ...remainingGoals];
          const nextGoals = nextGoalsUnsubstituted.map(g => applySubstitutionToPredicate(g, subst));

          const childId = `n${nodeIdCounter++}`;
          const childNode: SLDNode = {
            id: childId,
            goals: nextGoals,
            parent: node.id,
            usedClauseIndex: kbIdx,
            status: nextGoals.length === 0 ? "success" : "open",
            isPruned: pruningActive,
          };

          nodes.push(childNode);

          const substStrings: string[] = [];
          const seenKeys = new Set<string>();
          subst.forEach((val, key) => {
            const cleanKey = key.replace(/_\d+$/, "");
            const cleanVal = termToString(val);
            if (!seenKeys.has(cleanKey) && cleanVal !== cleanKey) {
              seenKeys.add(cleanKey);
              substStrings.push(`${cleanVal}/${cleanKey}`);
            }
          });
          const substStr = substStrings.length > 0 ? `{ ${substStrings.join(", ")} }` : "{ }";

          edges.push({
            id: `e-${node.id}-${childId}`,
            source: node.id,
            target: childId,
            label: substStr,
            isPruned: pruningActive,
          });

          const cutSignal = explore(childNode, depth + 1, pruningActive);

          if (cutSignal) {
            pruningActive = true;
            if (!bodyHasCut) {
              propagateCut = true;
            }
          }
        }
      }
    }

    if (!hasChildren && node.goals.length > 0) {
      node.status = "failure";
    }
    return propagateCut;
  }

  explore(rootNode, 0);

  return { nodes, edges, hitMaxDepth };
}
