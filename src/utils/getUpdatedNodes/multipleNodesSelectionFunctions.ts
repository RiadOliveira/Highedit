import { Property } from 'utils/properties';
import cases from '../formattingCases';
import { formattingTypeSwtich } from '.';

interface Selection {
  start: number;
  end: number;
}

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

// ------------
// Same parents
// ------------

const tagType = (
  child: ChildNode,
  propertyName: string,
  points: Selection,
): string => {
  const selectedContent = Array.from(child.childNodes)
    .map(subChild => {
      const subChildHTML = subChild.firstChild?.parentElement?.outerHTML;
      return subChildHTML || subChild.textContent;
    })
    .join('');

  return cases.tag(child, selectedContent, propertyName, points);
};

const otherTypes = (
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
      const element = document.createElement('div');
      element.innerHTML = updatedChild;

      updatedChild = element.firstChild as Node;
    }

    const clonedNodeContent = clonedChild.textContent;
    if (clonedNodeContent) {
      const subChild = childrenArray[index];

      const startIndex = subChild.textContent?.indexOf(clonedNodeContent) || 0;
      const endIndex = startIndex + clonedNodeContent.length;

      updatedPoints.start = startIndex;
      updatedPoints.end = endIndex;
    }

    const comparativeNode = Array.from(updatedChild.childNodes).find(subChild =>
      subChild.isEqualNode(childrenArray[initialClonedNodePosition + index]),
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

export default {
  differentParents,
  sameParents: {
    tagType,
    otherTypes,
  },
};
