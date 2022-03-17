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

const handleAlignProperty = (props: HandleAlignPropertyProps): string => {
  const {
    selectedNode: { children },
  } = props;

  if (children) return subChildrenSelect(props);
  return childSelect(props);
};

export default handleAlignProperty;
