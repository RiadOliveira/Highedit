import { Property } from 'utils/properties';
import { formattingTypeSwtich, SelectedNode } from '.';

interface Selection {
  start: number;
  end: number;
}

const subChildrenSelection = (
  child: ChildNode,
  property: Property,
  selectedNodes: SelectedNode[],
  points: Selection,
): string | Node => {
  let updatedChild: string | Node = child;
  const updatedPoints = points;

  selectedNodes.forEach((selectedNode, index) => {
    if (typeof updatedChild === 'string') {
      const element = document.createElement('template');
      element.innerHTML = updatedChild;

      updatedChild = element.content;
    }

    const selectedNodeContent = selectedNode.content;
    if (selectedNodeContent && index > 0) {
      const startIndex =
        selectedNode.reference.textContent?.indexOf(selectedNodeContent) || 0;
      const endIndex = startIndex + selectedNodeContent.length;

      updatedPoints.start = startIndex;
      updatedPoints.end = endIndex;
    }

    updatedChild = formattingTypeSwtich(
      updatedChild as ChildNode,
      property,
      selectedNode.reference,
      updatedPoints,
      selectedNode.content,
    );
  });

  return updatedChild;
};

export default subChildrenSelection;
