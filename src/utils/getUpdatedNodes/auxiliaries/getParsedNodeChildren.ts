import { SelectedNode } from '..';

interface GetParsedNodeChildrenReturn {
  children: SelectedNode[];
  indexAddition: number;
}

const getParsedNodeChildren = (
  node: ChildNode,
  selection: Selection,
  clonedNodes: NodeListOf<ChildNode>,
  index: number,
): GetParsedNodeChildrenReturn => {
  const selectedChildren = Array.from(node.childNodes).filter(subChild =>
    selection.containsNode(subChild, true),
  );

  const onlyClonedNode = clonedNodes.item(index).nodeName !== node.nodeName;
  let indexAddition = 0;

  const children: SelectedNode[] = selectedChildren.map((subChild, subInd) => {
    const iteratedClonedItem = clonedNodes.item(index + indexAddition);
    let content = '';

    if (!onlyClonedNode) {
      const subClonedItem = iteratedClonedItem.childNodes.item(subInd);
      content = subClonedItem.textContent || '';
    } else {
      content = iteratedClonedItem.textContent || '';
      indexAddition += 1;
    }

    return {
      reference: subChild,
      content,
    };
  });

  return {
    children,
    indexAddition,
  };
};

export default getParsedNodeChildren;
