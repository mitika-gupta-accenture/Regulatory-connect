import plTailorYourApp from '../fields/pl/tailor-your-application/tailor-your-application.json';
import isArray from './isArray';
import { QuestionType } from 'core/components/QuestionBuilder';

// Define types for SelectOption and Answer
type SelectOption = {
  value: string;
  // No route property
};

type Answer = {
  value: string;
  route: string; // Has route property
};

// Define a type guard function to check if an object is of type Answer
function isAnswer(a: SelectOption | Answer): a is Answer {
  return (a as Answer).route !== undefined;
}

// Define the types
export type Comparator<T> = (a: T, b: T) => number;

export type GraphQuestionAnswer = {
  answers: {
    identifier: string;
    answer: string;
    route: string;
  }[];
  nextRoute: string | string[];
  identifier: string;
};

export class GraphNode<T> {
  data: T;
  adjacent: GraphNode<T>[];
  comparator: Comparator<T>;

  constructor(data: T, comparator: Comparator<T>) {
    this.data = data;
    this.adjacent = [];
    this.comparator = comparator;
  }

  addAdjacent(node: GraphNode<T>): void {
    this.adjacent.push(node);
  }

  removeAdjacent(data: T): GraphNode<T> | null {
    return this.adjacent.find(n => this.comparator(n.data, data) === 0) || null;
  }
}

export class Graph<T> {
  nodes: Map<T, GraphNode<T>> = new Map();
  comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.comparator = comparator;
  }

  addNode(data: T): GraphNode<T> {
    let node = this.nodes.get(data);

    if (!node) {
      node = new GraphNode(data, this.comparator);
      this.nodes.set(data, node);
    }

    return node;
  }

  removeNode(data: T): GraphNode<T> | null {
    const toRemove = this.nodes.get(data);
    if (!toRemove) {
      return null;
    }

    this.nodes.forEach(n => n.removeAdjacent(toRemove.data));
    this.nodes.delete(data);

    return toRemove;
  }

  addEdge(source: T, dest: T): void {
    const sourceNode = this.addNode(source);
    const destNode = this.addNode(dest);

    sourceNode.addAdjacent(destNode);
  }

  removeEdge(source: T, dest: T): void {
    const sourceNode = this.nodes.get(source);
    const destNode = this.nodes.get(dest);

    if (sourceNode && destNode) {
      sourceNode.removeAdjacent(dest);
    }
  }

  findNodeByDataValue<V>(value: V, nodeToVal: (node: T) => V) {
    return (
      Array.from(this.nodes.keys()).find(x => nodeToVal(x) === value) ?? null
    );
  }
}

export function getReachableNodeIds(
  answers: GraphQuestionAnswer[],
  graph: Graph<GraphQuestion>,
  startId: string,
): string[] {
  let next: string[] = [];
  const thisNodeAnswer = answers.find(a => a.identifier === startId);
  const startNode = graph.findNodeByDataValue(startId, x => x.identifier);
  if (startNode) {
    if (thisNodeAnswer) {
      next = [thisNodeAnswer.nextRoute].flat();
    } else {
      const graphNode = graph.nodes.get(startNode)!;
      next = graphNode.adjacent.map(n => n.data.identifier);
    }
  }

  const nextValidNodes = next.flatMap(n =>
    getReachableNodeIds(answers, graph, n),
  );
  return [startId, ...nextValidNodes];
}

type ConditionalRouteValue =
  | 'default'
  | { equals: { [key: string]: string } }
  | { notEquals: { [key: string]: string } }
  | { lessThen: { [key: string]: string } }
  | { greaterThen: { [key: string]: string } }
  | { and: ConditionalRouteValue[] }
  | { or: ConditionalRouteValue[] };

type ConditionalRoute = {
  [key: string]: ConditionalRouteValue;
};

export type GraphQuestion = {
  routeBase: string | null | ConditionalRoute[];
  identifier: string;
  answers?: {
    value: string;
    route?: string | ConditionalRoute[];
  }[];
};

export const questionComparator: Comparator<GraphQuestion> = (a, b) =>
  a.identifier.localeCompare(b.identifier);

const createQuestionGraph = (questions: GraphQuestion[]) => {
  const graph = new Graph<GraphQuestion>(questionComparator);
  questions.forEach(q => {
    let destinations: GraphQuestion[] = [];
    if (q.answers && q.answers.length > 0) {
      destinations = q.answers.flatMap(a =>
        questions.filter(iq =>
          Array.isArray(a.route)
            ? a.route.some(route => {
                return iq.identifier === Object.keys(route)[0];
              })
            : iq.identifier === a.route,
        ),
      );
    } else if (q.routeBase) {
      destinations = questions.filter(iq =>
        Array.isArray(q.routeBase)
          ? q.routeBase.some(route => {
              return iq.identifier === Object.keys(route)[0];
            })
          : iq.identifier === q.routeBase,
      );
    }
    destinations.forEach(d => graph.addEdge(q, d));
  });
  return graph;
};

export const questionGraph = async (questionJson: QuestionType[]) => {
  return createQuestionGraph(
    questionJson.map(q => ({
      routeBase:
        typeof q.route === 'string' || isArray(q?.route)
          ? q.route || null
          : null,
      answers: q.fields.flatMap(q => {
        if ('answers' in q) {
          return q.answers!.map(a => ({
            route: isAnswer(a) ? a.route : undefined, // Safely check if route exists
            value: a.value,
          }));
        }
        return [];
      }),
      identifier: q.identifier,
    })),
  );
};

export const DEFAULT_START_NODE_ID = 'what-type-of-application-are-you-making';

export const findUnreachableNodes = (
  graph: Graph<GraphQuestion>,
  answers: GraphQuestionAnswer[],
  startNode: GraphQuestion,
) => {
  const reachable = getReachableNodeIds(answers, graph, startNode?.identifier);

  return Array.from(graph.nodes.keys()).filter(
    k => !reachable.includes(k.identifier),
  );
};

export const getNextEmptyNode = (
  graph: Graph<GraphQuestion>,
  answers: GraphQuestionAnswer[],
  start: string,
) => {
  let nextRoute = '';
  const currentNodeVal = graph.findNodeByDataValue(start, n => n.identifier)!;
  let node = graph.nodes.get(currentNodeVal);
  let currentAnswer = answers.find(a => a.identifier === start);
  while (nextRoute === '') {
    if (!node) {
      if (!currentAnswer && currentNodeVal === null) {
        nextRoute = start;
      } else nextRoute = 'check-and-confirm-your-answers'; // This default route can be changed later based on requirement
    } else if (!currentAnswer) {
      nextRoute = node.data.identifier;
    } else {
      node = node.adjacent.find(
        n => n.data.identifier === currentAnswer!.nextRoute,
      );
      currentAnswer = answers.find(a => a.identifier === node?.data.identifier);
    }
  }

  return nextRoute;
};
