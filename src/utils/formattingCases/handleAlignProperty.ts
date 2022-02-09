import { SelectedNode } from 'utils/getUpdatedNodes';
import {
  childSelect,
  childrenSelect,
  subChildrenSelect,
} from './auxiliaries/alignFunctions';

interface Selection {
  start: number;
  end: number;
}

const handleAlignProperty = (
  selectedNode: SelectedNode,
  selectedNodesLength: number,
  selectedNodePosition: number,
  points: Selection,
  propertyValue: string,
): string | Node => {
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
