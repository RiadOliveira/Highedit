import { Property } from 'utils/properties';
import { formattingTypeSwtich, SelectedNode } from '.';
import getExtremeContentPoints from './auxiliaries/getExtremeContentPoints';

const subChildrenSelection = (
  child: ChildNode,
  property: Property,
  selectedNodes: SelectedNode[],
): string | Node => {
  let updatedChild: string | Node = child;

  selectedNodes.forEach(({ content, reference }, index) => {
    if (typeof updatedChild === 'string') {
      const element = document.createElement('template');
      element.innerHTML = updatedChild;
      updatedChild = element.content;
    }

    const points = getExtremeContentPoints(
      content,
      reference.textContent || '',
      !index, // First index, index === 0.
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

export default subChildrenSelection;
