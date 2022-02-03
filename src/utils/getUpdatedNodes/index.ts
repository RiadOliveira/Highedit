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
  isChild: boolean,
): string | Node => {
  switch (property.type) {
    case 'tag':
      return cases.tag(points, selectedText, property.name, child);

    case 'special':
      return specialFunctions.link(child, comparativeNode, selectedText);

    default: {
      const { code } = property;
      const {
        style: { hasTag, justText },
      } = cases;

      if (child.nodeName === '#text') return justText(points, code, child);

      const element = child.firstChild?.parentElement;

      if (element) {
        return isChild
          ? hasTag.isChild(element, selectedText, points, code, comparativeNode)
          : hasTag.notChild(element, selectedText, points, code);
      }
    }
  }

  return '';
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
    const { anchorNode } = selection;
    const { parentNode } = anchorNode as Node;

    let selectedText = '';
    let isChild = false;
    const comparativeNode: Node | null | undefined =
      parentNode !== textRef ? parentNode : anchorNode;

    const containersHaveSameParent =
      startContainer !== endContainer &&
      child.contains(startContainer) &&
      child.contains(endContainer);

    // Only one child selected.
    if (clonedNodes.length === 1) {
      isChild = Array.from(child.childNodes).includes(
        comparativeNode as ChildNode,
      );

      // If the child isn't the selected, return it without changes.
      if (comparativeNode !== child && !isChild) return child;

      selectedText = selection.toString();
    } else {
      const iterateClonedNode = clonedNodes.item(
        index - initialClonedNodePosition,
      );

      if (!containersHaveSameParent) {
        const { differentParents } = multipleNodesSelectionFunctions;
        const indexChildIsSelected = differentParents(
          { startContainer, endContainer },
          childrenArray,
          index,
        );

        if (!indexChildIsSelected) return child;

        const clonedNodeContent = iterateClonedNode.textContent;
        if (index > initialClonedNodePosition && clonedNodeContent) {
          const startIndex = child.textContent?.indexOf(clonedNodeContent) || 0;
          const endIndex = startIndex + clonedNodeContent.length;

          points.start = startIndex;
          points.end = endIndex;
        }
      } else {
        const {
          sameParents: { tagType, otherTypes },
        } = multipleNodesSelectionFunctions;

        if (property.type === 'tag') {
          return cases.tag(points, tagType(child), property.name, child);
        }

        return otherTypes(
          child,
          clonedNodes,
          (updatedChild, clonedChild, childText, cloneWasChild) =>
            formattingTypeSwtich(
              updatedChild,
              property,
              clonedChild,
              points,
              childText,
              cloneWasChild,
            ),
        );
      }

      const { firstChild } = iterateClonedNode;
      let comparativeClonedNode = iterateClonedNode;

      if (firstChild && firstChild.nodeName !== '#text') {
        comparativeClonedNode = firstChild;
        isChild = true;
      }

      const { textContent } = comparativeClonedNode;
      selectedText = textContent || '';
    }

    return formattingTypeSwtich(
      child,
      property,
      comparativeNode as Node,
      points,
      selectedText,
      isChild,
    );
  });

  return inputNodes;
};

export default getUpdatedNodes;
