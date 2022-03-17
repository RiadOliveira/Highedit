import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '.';
import {
  childSelect,
  subChildrenSelect,
} from './handleAlignAuxiliaries/alignFunctions';

interface HandleAlignPropertyProps {
  selectedNode: SelectedNode;
  points: SelectionPoints;
  propertyValue: string;
}

const handleAlignProperty = (
  onlyOneChild: boolean,
  props: HandleAlignPropertyProps,
): string => {
  const {
    selectedNode: { children },
  } = props;

  if (children) return subChildrenSelect(onlyOneChild, props);
  return childSelect(props);
};

export default handleAlignProperty;
