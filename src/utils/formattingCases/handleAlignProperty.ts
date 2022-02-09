import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '.';
import {
  childSelect,
  childrenSelect,
  subChildrenSelect,
} from './auxiliaries/alignFunctions';

const handleAlignProperty = (
  selectedNode: SelectedNode,
  selectedNodesLength: number,
  selectedNodePosition: number,
  points: SelectionPoints,
  propertyValue: string,
): string => {
  if (selectedNodesLength > 1) {
    const initialPosition = !selectedNodePosition;
    const finalPosition = selectedNodePosition === selectedNodesLength - 1;

    return childrenSelect(
      selectedNode,
      initialPosition,
      finalPosition,
      propertyValue,
    );
  }

  if (selectedNode.children) {
    return subChildrenSelect(selectedNode, propertyValue);
  }

  return childSelect(selectedNode, propertyValue, points);
};

export default handleAlignProperty;
