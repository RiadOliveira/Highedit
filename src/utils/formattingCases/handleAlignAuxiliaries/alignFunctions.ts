import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '..';
import { getStartChildren, getEndChildren } from './getUnselectedSubChildren';

import getExtremeTextsUsingPoints from '../auxiliaries/getExtremeTextsUsingPoints';
import getUpdatedContentForAlignProperty from './getUpdatedContentForAlignProperty';

interface OneSelectedNodeProps {
  selectedNode: SelectedNode;
  propertyValue: string;
  points: SelectionPoints;
}

const childSelect = ({
  selectedNode: { content, reference },
  propertyValue,
  points,
}: OneSelectedNodeProps): string => {
  const referenceElement = reference.firstChild?.parentElement || undefined;
  const updatedContent: string[] = [];

  const updatedElement = document.createElement('div');
  updatedElement.style.setProperty('text-align', propertyValue);

  const { start, end, template } = getExtremeTextsUsingPoints(
    reference.textContent || '',
    points,
    referenceElement,
  );

  updatedElement.innerHTML = template.replace('?', content);

  if (start) updatedContent.push(start);
  updatedContent.push(updatedElement.outerHTML);
  if (end) updatedContent.push(end);

  return updatedContent.join('');
};

const subChildrenSelect = (
  onlyOneChild: boolean,
  { selectedNode, propertyValue, points }: OneSelectedNodeProps,
): string => {
  const nodeElement = selectedNode.reference.firstChild?.parentElement;
  const previousAlign = nodeElement?.style.getPropertyValue('text-align');

  const childrenArray = Array.from(selectedNode.reference.childNodes);
  const nodeChildren = selectedNode.children as SelectedNode[];

  const updatedElement: string[] = [];
  const previousTemplate = previousAlign
    ? `<div style="text-align: ${previousAlign};">?</div>`
    : '?';

  const startChildren = getStartChildren({ childrenArray, nodeChildren });
  if (startChildren) {
    updatedElement.push(previousTemplate.replace('?', startChildren));
  }

  const updatedContent = getUpdatedContentForAlignProperty(
    nodeChildren,
    propertyValue,
    points,
    previousTemplate,
    previousAlign,
    onlyOneChild,
  );
  updatedElement.push(updatedContent);

  const endChildren = getEndChildren({ childrenArray, nodeChildren });
  if (endChildren) {
    updatedElement.push(previousTemplate.replace('?', endChildren));
  }

  return updatedElement.join('');
};

export { childSelect, subChildrenSelect };
