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
): string | Node => {
  let updatedChild: string | Node = child;

  selectedNodes.forEach(({ content, reference }, index) => {
    const points = (() => {
      if (selectedNodes.length === 1) return selectionPoints;

      return getExtremeContentPoints(
        content,
        reference.textContent || '',
        !index, // First index, index === 0.
      );
    })();

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
