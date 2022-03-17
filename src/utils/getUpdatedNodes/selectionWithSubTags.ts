import { SelectionPoints } from 'utils/formattingCases';
import { Property } from 'utils/properties';
import { SelectedNode } from '.';

import formattingTypeSwtich from './auxiliaries/formattingTypeSwitch';
import getExtremeContentPoints from './auxiliaries/getExtremeContentPoints';

const selectionWithSubTags = (
  child: ChildNode,
  property: Property,
  selectedNodes: SelectedNode[],
  selectionPoints: SelectionPoints,
  onlyOneNode: boolean,
): string | Node => {
  let updatedChild: string | Node = child;

  if (onlyOneNode && selectedNodes.length === 1) {
    const [selectedNode] = selectedNodes;
    const { reference, content } = selectedNode;

    return formattingTypeSwtich(
      updatedChild as ChildNode,
      property,
      reference,
      selectionPoints,
      content,
    );
  }

  selectedNodes.forEach(({ content, reference }, index) => {
    const points = getExtremeContentPoints(
      content,
      reference.textContent || '',
      !index,
    );

    updatedChild = formattingTypeSwtich(
      updatedChild as ChildNode,
      property,
      reference,
      points,
      content,
    );
  });

  return updatedChild;
};

export default selectionWithSubTags;
