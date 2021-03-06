import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '..';
import { getStartChildren, getEndChildren } from './getUnselectedSubChildren';

import getExtremeTextsUsingPoints from '../auxiliaries/getExtremeTextsUsingPoints';
import getUpdatedContentForAlignProperty from './getUpdatedContentForAlignProperty';
import generateTemplateElementFromString from '../auxiliaries/generateTemplateElementFromString';

interface OneSelectedNodeProps {
  selectedNode: SelectedNode;
  propertyValue: string;
  points: SelectionPoints;
}

const childSelect = ({
  selectedNode: { content, reference },
  propertyValue,
  points,
}: OneSelectedNodeProps): Node => {
  const referenceElement = reference.firstChild?.parentElement || undefined;
  const updatedContent: string[] = [];

  const updatedElement = document.createElement('div');
  updatedElement.style.setProperty('text-align', propertyValue);

  const { start, end, template } = getExtremeTextsUsingPoints(
    reference.textContent || '',
    points,
    referenceElement,
  );

  updatedElement.innerHTML = (() => {
    const firstChild = referenceElement?.firstChild;
    if (!firstChild) return template.replace('?', content);

    const childElement = firstChild.parentElement as HTMLElement;
    const childTemplate = childElement.outerHTML.replace(
      childElement.innerHTML,
      '?',
    );

    return template.replace('?', childTemplate.replace('?', content));
  })();

  if (start) updatedContent.push(start);
  updatedContent.push(updatedElement.outerHTML);
  if (end) updatedContent.push(end);

  return generateTemplateElementFromString(updatedContent.join(''));
};

const subChildrenSelect = (
  onlyOneNode: boolean,
  { selectedNode, propertyValue, points }: OneSelectedNodeProps,
): Node => {
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

  const alignTemplate = `<div style="text-align: ${propertyValue}">?</div>`;
  // If are equal, removes div.
  const template = propertyValue === previousAlign ? '?' : alignTemplate;
  const onlyOneChild = nodeChildren.length === 1;

  const updatedContent = getUpdatedContentForAlignProperty(
    nodeChildren,
    template,
    previousTemplate,
    onlyOneChild,
    onlyOneNode && onlyOneChild ? points : undefined,
  );
  updatedElement.push(updatedContent);

  const endChildren = getEndChildren({ childrenArray, nodeChildren });
  if (endChildren) {
    updatedElement.push(previousTemplate.replace('?', endChildren));
  }

  return generateTemplateElementFromString(updatedElement.join(''));
};

export { childSelect, subChildrenSelect };
