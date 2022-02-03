import { Property } from 'utils/properties';
import { formattingTypeSwtich } from '.';

interface Containers {
  startContainer: Node;
  endContainer: Node;
}

interface Selection {
  start: number;
  end: number;
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

const tagType = (child: ChildNode): string => {
  const selectedContent = Array.from(child.childNodes)
    .map(subChild => {
      const subChildHTML = subChild.firstChild?.parentElement?.outerHTML;
      return subChildHTML || subChild.textContent;
    })
    .join('');

  return selectedContent;
};

const otherTypes = (
  child: ChildNode,
  property: Property,
  clonedNodes: NodeListOf<ChildNode>,
  startContainer: Node,
  points: Selection,
): string | Node => {
  let updatedChild: string | Node = child;
  const childrenArray = Array.from(child.childNodes);

  const initialClonedNodePosition = childrenArray.findIndex(
    subChild => subChild === startContainer,
  );

  Array.from(clonedNodes).forEach((clonedChild, index) => {
    if (typeof updatedChild === 'string') {
      const element = document.createElement('div');
      element.innerHTML = updatedChild;

      updatedChild = element.firstChild as Node;
    }

    const cloneWasChild = clonedChild.nodeName !== '#text';
    const updatedPoints = points;

    const clonedNodeContent = clonedChild.textContent;
    if (index > initialClonedNodePosition && clonedNodeContent) {
      const subChild = childrenArray[index];

      const startIndex = subChild.textContent?.indexOf(clonedNodeContent) || 0;
      const endIndex = startIndex + clonedNodeContent.length;

      updatedPoints.start = startIndex;
      updatedPoints.end = endIndex;
    }

    updatedChild = formattingTypeSwtich(
      updatedChild as ChildNode,
      property,
      updatedChild.childNodes.item(index),
      updatedPoints,
      clonedChild.textContent || '',
      cloneWasChild,
    );
  });

  return updatedChild;
};

export default {
  differentParents,
  sameParents: {
    tagType,
    otherTypes,
  },
};
