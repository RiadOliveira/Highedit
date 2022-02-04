import specialFunctions from 'utils/specialTags';
import { tagFormat, styleFormat } from 'utils/formattingCases';
import { Property } from 'utils/properties';
import subChildrenSelection from './subChildrenSelection';

interface SelectionPoints {
  start: number;
  end: number;
}

interface SelectedNode {
  reference: ChildNode;
  content: string;
}

interface SelectedNodeData {
  selectedNodes: SelectedNode[];
  childIndex: number;
}

const getSelectedNodes = (
  selection: Selection,
  childrenArray: ChildNode[],
): SelectedNodeData => {
  const range = selection.getRangeAt(0);
  const clonedNodes = range.cloneContents().childNodes;
  const { startContainer, endContainer } = range;

  const filterNodesBasedOnSelection = (nodeArray: ChildNode[]): ChildNode[] => {
    return nodeArray.filter(node => selection.containsNode(node, true));
  };

  const filteredNodes: ChildNode[] = [];
  const findedSelectedChildIndex = childrenArray.findIndex(
    child =>
      child !== startContainer &&
      child.contains(startContainer) &&
      child.contains(endContainer),
  );

  if (findedSelectedChildIndex !== -1) {
    const subChildrenArray = Array.from(
      childrenArray[findedSelectedChildIndex].childNodes,
    );

    filteredNodes.push(...filterNodesBasedOnSelection(subChildrenArray));
  } else filteredNodes.push(...filterNodesBasedOnSelection(childrenArray));

  const parsedNodes = filteredNodes.map((node, index) => ({
    reference: node,
    content: clonedNodes.item(index).textContent || '',
  }));

  return {
    selectedNodes: parsedNodes,
    childIndex: findedSelectedChildIndex,
  };
};

const formattingTypeSwtich = (
  child: ChildNode,
  property: Property,
  comparativeNode: Node,
  points: SelectionPoints,
  selectedText: string,
): string | Node => {
  switch (property.type) {
    case 'tag':
      return tagFormat(child, selectedText, property.name, points);

    case 'special':
      return specialFunctions.link(child, comparativeNode, selectedText);

    default: {
      const { code } = property;
      const { hasTag, justText } = styleFormat;

      if (child.nodeName === '#text') return justText(child, points, code);

      const element = child.firstChild?.parentElement as HTMLElement;
      return hasTag(element, selectedText, points, comparativeNode, code);
    }
  }
};

// Function to return all nodes, including the updated node with the property pressed.
const getUpdatedNodes = (
  inputRef: React.RefObject<HTMLPreElement>,
  property: Property,
): (Node | string)[] => {
  const selection = window.getSelection() as Selection;
  const textRef = inputRef.current as HTMLPreElement;
  const childrenArray = Array.from(textRef.childNodes);

  if (!selection.toString()) return childrenArray;

  const { selectedNodes, childIndex } = getSelectedNodes(
    selection,
    childrenArray,
  );
  const initialSelectedNodePosition = childrenArray.findIndex(
    child => child === selectedNodes[0].reference,
  );

  // Iterate through all children of the created text.
  const inputNodes: (Node | string)[] = childrenArray.map((child, index) => {
    const hasSubChildren = index === childIndex;

    if (hasSubChildren) {
      return subChildrenSelection(child, property, selectedNodes);
    }

    const indexChildIsSelected =
      index >= initialSelectedNodePosition &&
      index <= initialSelectedNodePosition + selectedNodes.length - 1;

    if (!indexChildIsSelected) return child;

    const iterateSelectedNode =
      selectedNodes[index - initialSelectedNodePosition];

    const comparativeNode =
      child.parentNode !== textRef ? child.parentNode : child;

    const { content, reference } = iterateSelectedNode;
    const start = reference.textContent?.indexOf(content) || 0;
    const end = start + content.length;
    const points = { start, end };

    return formattingTypeSwtich(
      child,
      property,
      comparativeNode as Node,
      points,
      content,
    );
  });

  return inputNodes;
};

export default getUpdatedNodes;
export { formattingTypeSwtich };
export type { SelectedNode };
