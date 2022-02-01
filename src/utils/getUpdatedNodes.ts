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
  const { startContainer, endContainer } = selection.getRangeAt(0);

  const startNode =
    startContainer.parentNode !== textRef
      ? startContainer.parentNode
      : startContainer;

  const endNode =
    endContainer.parentNode !== textRef
      ? endContainer.parentNode
      : endContainer;

  const childrenArray = Array.from(textRef.childNodes);
  const firstIndexSelected = childrenArray.indexOf(startNode as ChildNode);
  const lastIndexSelected = childrenArray.indexOf(endNode as ChildNode);

  const { anchorOffset: start, focusOffset: end, anchorNode } = selection;
  const points = {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };
  const parentNode = anchorNode?.parentNode;

  // Iterate through all children of the created text.
  const inputNodes: (Node | string)[] = childrenArray.map((child, index) => {
    if (index < firstIndexSelected || index > lastIndexSelected) return child;

    const isChild = Array.from(child.childNodes).includes(
      startContainer as ChildNode,
    );

    switch (property.type) {
      case 'tag':
        return cases.tag(points, selection.toString(), property.name, child);

      case 'special':
        return specialFunctions.link(
          child,
          startNode as Node,
          selection.toString(),
        );

      default: {
        const { code } = property;
        const {
          style: { hasTag, justText },
        } = cases;

        if (parentNode === textRef) return justText(points, code, child);

        const element = child.firstChild?.parentElement;

        if (element) {
          return isChild
            ? hasTag.isChild(element, startNode as Node, code)
            : hasTag.notChild(element, selection.toString(), points, code);
        }
      }
    }

    return '';
  });

  return inputNodes;
};

export default getUpdatedNodes;
