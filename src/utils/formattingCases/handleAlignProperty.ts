import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '.';
import {
  childSelect,
  childrenSelect,
  subChildrenSelect,
} from './handleAlignAuxiliaries/alignFunctions';

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

  const oneSelectedNodeProps = {
    selectedNode,
    propertyValue,
    points,
  };

  if (selectedNode.children) return subChildrenSelect(oneSelectedNodeProps);
  return childSelect(oneSelectedNodeProps);
};

export default handleAlignProperty;
