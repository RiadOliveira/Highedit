import specialFunctions from 'utils/specialTags';
import { styleFormat } from 'utils/formattingCases/index';
import { Property } from 'utils/properties';
import handleAlignProperty from 'utils/formattingCases/handleAlignProperty';
import selectionWithSubTags from './selectionWithSubTags';
import getExtremeContentPoints from './auxiliaries/getExtremeContentPoints';

interface SelectionPoints {
  start: number;
  end: number;
}

interface SelectedNode {
  reference: ChildNode;
  content: string;
  children?: SelectedNode[];
}

const getSelectedNodes = (
  selection: Selection,
  childrenArray: ChildNode[],
): SelectedNode[] => {
  const range = selection.getRangeAt(0);
  const clonedNodes = range.cloneContents().childNodes;

  const filteredNodes: ChildNode[] = childrenArray.filter(node =>
    selection.containsNode(node, true),
  );
  const parsedNodes: SelectedNode[] = [];

  for (let ind = 0; ind < filteredNodes.length; ind++) {
    const node = filteredNodes[ind];
    const isTextTag = node.nodeName === 'SPAN' || node.nodeName === '#text';

    const parsedNode: SelectedNode = {
      reference: node,
      content: '',
    };

    if (isTextTag) parsedNode.content = clonedNodes.item(ind).textContent || '';
    else {
      const selectedChildren = Array.from(node.childNodes).filter(subChild =>
        selection.containsNode(subChild, true),
      );

      const onlyClonedNode = clonedNodes.item(ind).nodeName !== node.nodeName;

      const children: SelectedNode[] = selectedChildren.map(
        (subChild, subInd) => {
          const iteratedClonedItem = clonedNodes.item(ind);
          let content = '';

          if (!onlyClonedNode) {
            const subClonedItem = iteratedClonedItem.childNodes.item(subInd);
            content = subClonedItem.textContent || '';
          } else {
            content = iteratedClonedItem.textContent || '';
            ind += 1;
          }

          return {
            reference: subChild,
            content,
          };
        },
      );

      parsedNode.children = children;
    }

    parsedNodes.push(parsedNode);
  }

  return parsedNodes;
};

const formattingTypeSwtich = (
  child: ChildNode,
  property: Property,
  comparativeNode: Node,
  points: SelectionPoints,
  selectedText: string,
): string | Node => {
  switch (property.type) {
    case 'special':
      return specialFunctions.link(child, comparativeNode, selectedText);

    default: {
      const { code } = property;
      const { withTag, justText } = styleFormat;

      if (child.nodeName === '#text') return justText(child, points, code);

      const element = child.firstChild?.parentElement as HTMLElement;
      return withTag(element, selectedText, points, comparativeNode, code);
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

  const selectedNodes = getSelectedNodes(selection, childrenArray);
  const initialSelectedNodePosition = childrenArray.findIndex(
    child => child === selectedNodes[0].reference,
  );

  // Iterate through all children of the created text.
  const inputNodes: (Node | string)[] = childrenArray.map((child, index) => {
    const relativeSelectedNodePosition = index - initialSelectedNodePosition;
    const iterateSelectedNode = selectedNodes[relativeSelectedNodePosition];

    if (!iterateSelectedNode) return child;

    const { content, reference } = iterateSelectedNode;

    const points = (() => {
      if (selectedNodes.length === 1) {
        const { anchorOffset: start, focusOffset: end } = selection;

        return {
          start,
          end,
        };
      }

      return getExtremeContentPoints(
        content,
        reference.textContent || '',
        index === initialSelectedNodePosition,
      );
    })();

    if (property.code?.cssProp === 'text-align') {
      return handleAlignProperty(
        iterateSelectedNode,
        selectedNodes.length,
        relativeSelectedNodePosition,
        points,
        property.code.value,
      );
    }

    const subChildren = iterateSelectedNode.children;
    if (subChildren) return selectionWithSubTags(child, property, subChildren);

    const { parentNode } = child;
    const comparativeNode = parentNode !== textRef ? parentNode : child;

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