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
  clonedNodes: NodeListOf<ChildNode>,
  formatSwitch: (
    updatedChild: ChildNode,
    clonedChild: Node,
    childText: string,
    cloneWasChild: boolean,
  ) => string | Node,
): string | Node => {
  let updatedChild: string | Node = child;

  Array.from(clonedNodes).forEach(clonedChild => {
    if (typeof updatedChild === 'string') {
      const element = document.createElement('div');
      element.innerHTML = updatedChild;

      updatedChild = element.firstChild as Node;
    }

    const cloneWasChild = clonedChild.nodeName !== '#text';

    updatedChild = formatSwitch(
      updatedChild as ChildNode,
      clonedChild as Node,
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
