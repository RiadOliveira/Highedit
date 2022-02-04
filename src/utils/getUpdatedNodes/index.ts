import cases from 'utils/formattingCases';
import specialFunctions from 'utils/specialTags';
import { Property } from 'utils/properties';
import multipleNodesSelectionFunctions from './multipleNodesSelectionFunctions';

const formattingTypeSwtich = (
  child: ChildNode,
  property: Property,
  comparativeNode: Node,
  points: {
    start: number;
    end: number;
  },
  selectedText: string,
): string | Node => {
  switch (property.type) {
    case 'tag':
      return cases.tag(child, selectedText, property.name, points);

    case 'special':
      return specialFunctions.link(child, comparativeNode, selectedText);

    default: {
      const { code } = property;
      const {
        style: { hasTag, justText },
      } = cases;

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

  if (!selection.toString().trim()) return childrenArray;

  const range = selection.getRangeAt(0);
  const { startContainer, endContainer } = range;

  const initialClonedNodePosition = childrenArray.findIndex(
    child => child === startContainer || child.contains(startContainer),
  );

  const clonedNodes = range.cloneContents().childNodes;

  const { anchorOffset: start, focusOffset: end } = selection;
  const points = {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };

  // Iterate through all children of the created text.
  const inputNodes: (Node | string)[] = childrenArray.map((child, index) => {
    const containersHaveSameParent =
      startContainer !== endContainer &&
      child.contains(startContainer) &&
      child.contains(endContainer);

    if (containersHaveSameParent) {
      const {
        sameParents: { tagType, otherTypes },
      } = multipleNodesSelectionFunctions;

      if (property.type === 'tag') {
        return tagType(child, property.name, points);
      }

      return otherTypes(child, property, clonedNodes, startContainer);
    }

    const { differentParents } = multipleNodesSelectionFunctions;
    const indexChildIsSelected = differentParents(
      { startContainer, endContainer },
      childrenArray,
      index,
    );

    if (!indexChildIsSelected) return child;

    const iterateClonedNode = clonedNodes.item(
      index - initialClonedNodePosition,
    );

    const clonedNodeContent = iterateClonedNode.textContent;
    if (clonedNodeContent) {
      const startIndex = child.textContent?.indexOf(clonedNodeContent) || 0;
      const endIndex = startIndex + clonedNodeContent.length;

      points.start = startIndex;
      points.end = endIndex;
    }

    const { firstChild } = iterateClonedNode;
    let comparativeClonedNode = iterateClonedNode;

    if (firstChild && firstChild.nodeName !== '#text') {
      comparativeClonedNode = firstChild;
    }

    const { textContent } = comparativeClonedNode;
    const selectedText = textContent || '';
    const comparativeNode =
      child.parentNode !== textRef ? child.parentNode : child;

    return formattingTypeSwtich(
      child,
      property,
      comparativeNode as Node,
      points,
      selectedText,
    );
  });

  return inputNodes;
};

export default getUpdatedNodes;
export { formattingTypeSwtich };
