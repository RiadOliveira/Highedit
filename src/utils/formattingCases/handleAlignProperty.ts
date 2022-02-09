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

interface Code {
  cssProp: string;
  value: string;
}

const handleAlignProperty = (
  selectedNodes: SelectedNode[],
  points: Selection,
  code: Code,
): string | Node => {
  const { length } = selectedNodes;

  if (length > 1) return childrenSelect(selectedNodes, points, code);
  if (selectedNodes[0].children) return subChildrenSelect();

  return childSelect(selectedNodes[0], code, points);
};

export default handleAlignProperty;
