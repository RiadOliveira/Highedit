import { Property } from 'utils/properties';
import { formattingTypeSwtich } from '.';

interface Containers {
  startContainer: Node;
  endContainer: Node;
}

const differentParents = (
  { startContainer, endContainer }: Containers,
  childrenArray: ChildNode[],
  index: number,
): boolean => {
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

  return index >= startNodeIndex && index <= endNodeIndex;
};

const sameParents = (
  child: ChildNode,
  property: Property,
  clonedNodes: NodeListOf<ChildNode>,
  startContainer: Node,
): string | Node => {
  let updatedChild: string | Node = child;
  const childrenArray = Array.from(child.childNodes);
  const updatedPoints = { start: 0, end: 0 };

  const initialClonedNodePosition = childrenArray.findIndex(
    subChild =>
      subChild === startContainer || subChild === startContainer.parentElement,
  );

  Array.from(clonedNodes).forEach((clonedChild, index) => {
    if (typeof updatedChild === 'string') {
      const element = document.createElement('template');
      element.innerHTML = updatedChild;

      updatedChild = element.content;
    }

    const referredChild = childrenArray[initialClonedNodePosition + index];

    const clonedNodeContent = clonedChild.textContent;
    if (clonedNodeContent) {
      const startIndex =
        referredChild.textContent?.indexOf(clonedNodeContent) || 0;
      const endIndex = startIndex + clonedNodeContent.length;

      updatedPoints.start = startIndex;
      updatedPoints.end = endIndex;
    }

    const comparativeNode = Array.from(updatedChild.childNodes).find(subChild =>
      subChild.isEqualNode(referredChild),
    );

    updatedChild = formattingTypeSwtich(
      updatedChild as ChildNode,
      property,
      comparativeNode as Node,
      updatedPoints,
      clonedChild.textContent || '',
    );
  });

  return updatedChild;
};

export { differentParents, sameParents };
