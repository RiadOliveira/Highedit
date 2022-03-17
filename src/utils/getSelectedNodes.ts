import getParsedNodeChildren from './getUpdatedNodes/auxiliaries/getParsedNodeChildren';
import { SelectedNode } from './getUpdatedNodes';

const getSelectedNodes = (
  selection: Selection,
  childrenArray: ChildNode[],
  isImageProperty: boolean,
): SelectedNode[] => {
  if (isImageProperty) {
    const findedNode = childrenArray.find(node =>
      selection.containsNode(node, true),
    ) as ChildNode;

    const isTextTag = findedNode.nodeName !== 'DIV';
    let children;

    if (!isTextTag) {
      const { anchorNode } = selection;
      const { parentNode } = anchorNode as Node;

      const comparativeChild =
        parentNode?.nodeName !== 'DIV' ? parentNode : anchorNode;

      const findedChild = Array.from(findedNode?.childNodes).find(
        child => child === comparativeChild,
      ) as ChildNode;

      const parsedChild = {
        reference: findedChild,
        content: findedChild.textContent || '',
      };

      children = [parsedChild];
    }

    const parsedNode: SelectedNode = {
      reference: findedNode,
      content: '',
      children,
    };

    return [parsedNode];
  }

  const range = selection.getRangeAt(0);
  const clonedNodes = range.cloneContents().childNodes;

  const filteredNodes: ChildNode[] = childrenArray.filter(node =>
    selection.containsNode(node, true),
  );

  const parsedNodes: SelectedNode[] = [];

  for (let ind = 0; ind < filteredNodes.length; ind++) {
    const node = filteredNodes[ind];
    const isTextTag = node.nodeName !== 'DIV';

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
