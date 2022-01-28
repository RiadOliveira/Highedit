import cases from 'utils/formattingCases';
import specialFunctions from 'utils/specialTags';
import { Property } from 'utils/properties';

// Function to return all nodes, including the updated node with the property pressed.
const getNodes = (
  inputRef: React.RefObject<HTMLPreElement>,
  property: Property,
): (Node | string)[] => {
  const selection = window.getSelection();
  const textRef = inputRef.current;

  // Will store all nodes.
  const inputNodes: (Node | string)[] = [];

  if (selection && textRef) {
    const { anchorOffset: start, focusOffset: end, anchorNode } = selection;
    const points = {
      start: Math.min(start, end),
      end: Math.max(start, end),
    };
    const parentNode = anchorNode?.parentNode;

    // Gets selectedNode without error.
    const comparativeNode: Node | null | undefined =
      parentNode !== textRef ? parentNode : anchorNode;

    // Iterate through all children of the created text.
    textRef.childNodes.forEach(child => {
      const isChild = Array.from(child.childNodes).includes(
        comparativeNode as ChildNode,
      );

      // If the child isn't the selected, return it without changes.
      if (comparativeNode !== child && !isChild) {
        inputNodes.push(child);
        return;
      }

      switch (property.type) {
        case 'tag':
          inputNodes.push(
            cases.tag(points, selection.toString(), property.name, child),
          );
          break;

        case 'special':
          inputNodes.push(
            specialFunctions.link(
              child,
              comparativeNode as Node,
              selection.toString(),
            ),
          );
          break;

        default: {
          const { code } = property;
          const {
            style: { hasTag, justText },
          } = cases;

          if (parentNode === textRef) {
            inputNodes.push(justText(points, code, child));
            return;
          }

          const element = child.firstChild?.parentElement;

          if (element) {
            if (isChild)
              inputNodes.push(
                hasTag.isChild(element, comparativeNode as Node, code),
              );
            else
              inputNodes.push(
                hasTag.notChild(element, selection.toString(), points, code),
              );
          }
        }
      }
    });
  }

  return inputNodes;
};

export default getNodes;
