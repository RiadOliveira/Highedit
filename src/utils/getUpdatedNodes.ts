import cases from 'utils/formattingCases';
import specialFunctions from 'utils/specialTags';
import { Property } from 'utils/properties';

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

  const clonedNodes = range.cloneContents().childNodes;

  const { anchorOffset: start, focusOffset: end } = selection;
  const points = {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };

  // Iterate through all children of the created text.
  const inputNodes: (Node | string)[] = childrenArray.map((child, index) => {
    let selectedText = '';
    let isChild = false;
    let comparativeNode: Node | null | undefined;

    const containersHaveSameParent =
      startContainer !== endContainer &&
      child.contains(startContainer) &&
      child.contains(endContainer);

    if (clonedNodes.length === 1 || containersHaveSameParent) {
      const { anchorNode } = selection;
      const { parentNode } = anchorNode as Node;

      if (containersHaveSameParent) comparativeNode = child;
      else comparativeNode = parentNode !== textRef ? parentNode : anchorNode;

      isChild = Array.from(child.childNodes).includes(
        comparativeNode as ChildNode,
      );

      // If the child isn't the selected, return it without changes.
      if (comparativeNode !== child && !isChild) return child;

      selectedText = selection.toString();
    } else {
      const getExtremeIndex = (point: 'begin' | 'end') => {
        const container = point === 'begin' ? startContainer : endContainer;

        return childrenArray.findIndex(
          searchChild =>
            searchChild === container ||
            searchChild === (container.parentNode as Node),
        );
      };

      const startNodeIndex = getExtremeIndex('begin');
      const endNodeIndex = getExtremeIndex('end');

      if (index < startNodeIndex || index > endNodeIndex) return child;

      comparativeNode = clonedNodes.item(index);

      const { textContent } = comparativeNode;
      selectedText = textContent || '';
    }

    switch (property.type) {
      case 'tag':
        return cases.tag(points, selectedText, property.name, child);

      case 'special':
        return specialFunctions.link(
          child,
          comparativeNode as Node,
          selectedText,
        );

      default: {
        const { code } = property;
        const {
          style: { hasTag, justText },
        } = cases;

        if (child.nodeName === '#text') return justText(points, code, child);

        const element = child.firstChild?.parentElement;

        if (element) {
          return isChild
            ? hasTag.isChild(element, comparativeNode as Node, code)
            : hasTag.notChild(element, selectedText, points, code);
        }
      }
    }

    return '';
  });

  return inputNodes;
};

export default getUpdatedNodes;
