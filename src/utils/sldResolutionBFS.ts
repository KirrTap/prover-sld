import { parseLiteralToPredicate, unifyPredicates, unifyTerms, applySubstitutionToPredicate, termToString, type Predicate, type Term, type Substitution } from "./unification";
import type { SLDNode, SLDEdge, SLDTreeData } from "./sldResolutionDFS";
import { isTruePredicate, isFailPredicate, isNAFPredicate, isUnifyPredicate, isNotUnifyPredicate, extractNAFGoalPredicate, tryProveGoals, buildSubstLabel } from "./sldResolutionDFS";

export function generateSLDTreeBFS(knowledgeBase: string[][], initialGoals: string[][], maxDepth: number = 15, variables: string[] = []): SLDTreeData {
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
    return clause.map(p => ({
      ...p,
      args: p.args.map(renameTerm)
    }));
  }

  const queue: { node: SLDNode; depth: number }[] = [{ node: rootNode, depth: 0 }];

  while (queue.length > 0) {
    const { node, depth } = queue.shift()!;

    if (depth >= maxDepth) {
      node.status = "failure";
      hitMaxDepth = true;
      continue;
    }

    if (node.goals.length === 0) {
      node.status = "success";
      continue;
    }

    const currentGoal = node.goals[0];
    const remainingGoals = node.goals.slice(1);

    if (isTruePredicate(currentGoal)) {
      const trueChildId = `n${nodeIdCounter++}`;
      const trueChildNode: SLDNode = {
        id: trueChildId,
        goals: remainingGoals,
        parent: node.id,
        builtinName: "true",
        status: remainingGoals.length === 0 ? "success" : "open",
      };
      nodes.push(trueChildNode);
      edges.push({ id: `e-${node.id}-${trueChildId}`, source: node.id, target: trueChildId, label: "{ }" });
      queue.push({ node: trueChildNode, depth: depth + 1 });
      continue;
    }

    if (isFailPredicate(currentGoal)) {
      node.status = "failure";
      continue;
    }

    if (isNAFPredicate(currentGoal)) {
      const innerGoal = extractNAFGoalPredicate(currentGoal);
      const provable = tryProveGoals([innerGoal], kbParsed, maxDepth, depth + 1);
      const nafChildId = `n${nodeIdCounter++}`;
      const nafChildNode: SLDNode = {
        id: nafChildId,
        goals: provable ? [] : remainingGoals,
        parent: node.id,
        builtinName: "\\+",
        status: provable ? "failure" : (remainingGoals.length === 0 ? "success" : "open"),
      };
      nodes.push(nafChildNode);
      edges.push({ id: `e-${node.id}-${nafChildId}`, source: node.id, target: nafChildId, label: "{ }" });
      if (!provable) queue.push({ node: nafChildNode, depth: depth + 1 });
      continue;
    }

    if (isUnifyPredicate(currentGoal)) {
      const subst: Substitution = new Map();
      const success = unifyTerms(currentGoal.args[0], currentGoal.args[1], subst);
      if (!success) {
        node.status = "failure";
        continue;
      }
      const nextGoals = remainingGoals.map(g => applySubstitutionToPredicate(g, subst));
      const childId = `n${nodeIdCounter++}`;
      const childNode: SLDNode = {
        id: childId,
        goals: nextGoals,
        parent: node.id,
        builtinName: "=",
        status: nextGoals.length === 0 ? "success" : "open",
      };
      nodes.push(childNode);
      edges.push({ id: `e-${node.id}-${childId}`, source: node.id, target: childId, label: buildSubstLabel(subst) });
      queue.push({ node: childNode, depth: depth + 1 });
      continue;
    }

    if (isNotUnifyPredicate(currentGoal)) {
      const subst: Substitution = new Map();
      const canUnify = unifyTerms(currentGoal.args[0], currentGoal.args[1], subst);
      if (canUnify) {
        node.status = "failure";
        continue;
      }
      const childId = `n${nodeIdCounter++}`;
      const childNode: SLDNode = {
        id: childId,
        goals: remainingGoals,
        parent: node.id,
        builtinName: "\\=",
        status: remainingGoals.length === 0 ? "success" : "open",
      };
      nodes.push(childNode);
      edges.push({ id: `e-${node.id}-${childId}`, source: node.id, target: childId, label: "{ }" });
      queue.push({ node: childNode, depth: depth + 1 });
      continue;
    }

    let hasChildren = false;

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
          const newSubGoals = kbBody.map(p => ({ ...p }));
        
        const nextGoalsUnsubstituted = [...newSubGoals, ...remainingGoals];
        
        const nextGoals = nextGoalsUnsubstituted.map(g => applySubstitutionToPredicate(g, subst));
        
        const childId = `n${nodeIdCounter++}`;
        const childNode: SLDNode = {
          id: childId,
          goals: nextGoals,
          parent: node.id,
          usedClauseIndex: kbIdx,
          status: nextGoals.length === 0 ? "success" : "open"
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
          label: substStr
        });

        queue.push({ node: childNode, depth: depth + 1 });
      }
      }
    }
    
    if (!hasChildren && node.goals.length > 0) {
      node.status = "failure";
    }
  }

  return { nodes, edges, hitMaxDepth };
}
