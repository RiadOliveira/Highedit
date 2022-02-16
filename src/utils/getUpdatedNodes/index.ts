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
}: GetUpdatedNodesProps): (Node | string)[] => {
  const initialSelectedNodePosition = childrenArray.findIndex(
    child => child === selectedNodes[0].reference,
  );

  // Iterate through all children of the created text.
  const inputNodes: (Node | string)[] = childrenArray.map((child, index) => {
    const relativeSelectedNodePosition = index - initialSelectedNodePosition;
    const iterateSelectedNode = selectedNodes[relativeSelectedNodePosition];

    if (!iterateSelectedNode) return child;

    const { content, reference } = iterateSelectedNode;
    const points = (() => {
      if (selectedNodes.length === 1) return selectionPoints;

      return getExtremeContentPoints(
        content,
        reference.textContent || '',
        index === initialSelectedNodePosition,
      );
    })();

    if (property.code?.cssProp === 'text-align') {
      return handleAlignProperty(
        iterateSelectedNode,
        selectedNodes.length,
        relativeSelectedNodePosition,
        points,
        property.code.value,
      );
    }

    const subChildren = iterateSelectedNode.children;
    if (subChildren) return selectionWithSubTags(child, property, subChildren);

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
