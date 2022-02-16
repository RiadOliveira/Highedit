import getParsedNodeChildren from './getUpdatedNodes/auxiliaries/getParsedNodeChildren';
import { SelectedNode } from './getUpdatedNodes';

const getSelectedNodes = (
  selection: Selection,
  childrenArray: ChildNode[],
): SelectedNode[] => {
  const range = selection.getRangeAt(0);
  const clonedNodes = range.cloneContents().childNodes;

  const filteredNodes: ChildNode[] = childrenArray.filter(node =>
    selection.containsNode(node, true),
  );
  const parsedNodes: SelectedNode[] = [];

  for (let ind = 0; ind < filteredNodes.length; ind++) {
    const node = filteredNodes[ind];
    const isTextTag = node.nodeName === 'SPAN' || node.nodeName === '#text';

    const parsedNode: SelectedNode = {
      reference: node,
      content: '',
    };

    if (isTextTag) parsedNode.content = clonedNodes.item(ind).textContent || '';
    else {
      const { children, indexAddition } = getParsedNodeChildren(
        node,
        selection,
        clonedNodes,
        ind,
      );

      parsedNode.children = children;
      ind += indexAddition;
    }

    parsedNodes.push(parsedNode);
  }

  return parsedNodes;
};

export default getSelectedNodes;
