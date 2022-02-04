import { Property } from 'utils/properties';
import { formattingTypeSwtich, SelectedNode } from '.';

const subChildrenSelection = (
  child: ChildNode,
  property: Property,
  selectedNodes: SelectedNode[],
): string | Node => {
  let updatedChild: string | Node = child;

  selectedNodes.forEach(({ content, reference }) => {
    if (typeof updatedChild === 'string') {
      const element = document.createElement('template');
      element.innerHTML = updatedChild;
      updatedChild = element.content;
    }

    const start = reference.textContent?.indexOf(content) || 0;
    const end = start + content.length;
    const points = {
      start,
      end,
    };

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
