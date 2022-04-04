import { Property } from 'utils/properties';
import { SelectionPoints } from 'utils/formattingCases';

import handleAlignProperty from 'utils/formattingCases/handleAlignProperty';
import selectionWithSubTags from './selectionWithSubTags';
import getExtremeContentPoints from './auxiliaries/getExtremeContentPoints';
import formattingTypeSwtich from './auxiliaries/formattingTypeSwitch';

interface SelectedNode {
  reference: ChildNode;
  content: string;
  children?: SelectedNode[];
}

interface GetUpdatedNodesProps {
  textRef: HTMLPreElement;
  childrenArray: ChildNode[];
  selectedNodes: SelectedNode[];
  property: Property;
  selectionPoints: SelectionPoints;
}

// Function to return all nodes, including the updated node with the property pressed.
const getUpdatedNodes = ({
  textRef,
  childrenArray,
  selectedNodes,
  property,
  selectionPoints,
}: GetUpdatedNodesProps): Node[] => {
  const initialSelectedNodePosition = childrenArray.findIndex(
    child => child === selectedNodes[0].reference,
  );

  const onlyOneNode = selectedNodes.length === 1;
  const isAlign =
    typeof property.code !== 'string' &&
    property.code?.cssProp === 'text-align';

  // Iterate through all children of the created text.
  const inputNodes: Node[] = childrenArray.map((child, index) => {
    const relativeSelectedNodePosition = index - initialSelectedNodePosition;
    const iterateSelectedNode = selectedNodes[relativeSelectedNodePosition];

    if (!iterateSelectedNode) return child;
    const { content, reference } = iterateSelectedNode;

    const subChildren = iterateSelectedNode.children;
    if (subChildren && !isAlign) {
      return selectionWithSubTags(
        child,
        property,
        subChildren,
        selectionPoints,
        onlyOneNode,
      );
    }

    const points = (() => {
      if (onlyOneNode) return selectionPoints;

      return getExtremeContentPoints(
        content,
        reference.textContent || '',
        index === initialSelectedNodePosition,
      );
    })();

    if (isAlign) {
      return handleAlignProperty(selectedNodes.length === 1, {
        selectedNode: iterateSelectedNode,
        points,
        propertyValue: (property.code as { value: string }).value,
      });
    }

    const { parentNode } = child;
    const comparativeNode = parentNode !== textRef ? parentNode : child;

    return formattingTypeSwtich(
      child,
      property,
      comparativeNode as Node,
      points,
      content,
    );
  });

  return inputNodes;
};

export default getUpdatedNodes;
export type { SelectedNode };
