import { SelectedNode } from 'utils/getUpdatedNodes';
import getExtremeContentPoints from 'utils/getUpdatedNodes/auxiliaries/getExtremeContentPoints';
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

const childrenSelect = (
  selectedNode: SelectedNode,
  isInitialPosition: boolean,
  isFinalPosition: boolean,
  propertyValue: string,
): string => {
  const updatedContent: string[] = [];
  const { reference, content } = selectedNode;

  if (isInitialPosition) {
    const { start } = getExtremeContentPoints(
      content,
      reference.textContent || '',
      true,
    );

    const template =
      reference.nodeName === 'SPAN'
        ? (reference.firstChild?.parentElement as HTMLElement)
        : undefined;

    const { start: startText, end: endText } = getExtremeTextsUsingPoints(
      reference.textContent || '',
      { start, end: start },
      template,
    );

    updatedContent.push(startText);
    updatedContent.push(`<div style="text-align: ${propertyValue};">`);
    updatedContent.push(endText);
  } else if (isFinalPosition) {
    const { end } = getExtremeContentPoints(
      content,
      reference.textContent || '',
      false,
    );

    const template =
      reference.nodeName === 'SPAN'
        ? (reference.firstChild?.parentElement as HTMLElement)
        : undefined;

    const { start: startText, end: endText } = getExtremeTextsUsingPoints(
      reference.textContent || '',
      { start: end, end },
      template,
    );

    updatedContent.push(startText);
    updatedContent.push('</div>');
    updatedContent.push(endText);
  } else {
    const referenceHTML = reference.firstChild?.parentElement;
    const childContent = (() => {
      if (reference.nodeName === 'DIV') return referenceHTML?.innerHTML;
      if (reference.nodeName === 'SPAN') return referenceHTML?.outerHTML;
      return selectedNode.content;
    })();
    updatedContent.push(childContent || '');
  }

  return updatedContent.join('');
};

const subChildrenSelect = ({
  selectedNode,
  propertyValue,
  points,
}: OneSelectedNodeProps): string => {
  const nodeElement = selectedNode.reference.firstChild?.parentElement;
  const previousAlign = nodeElement?.style.getPropertyValue('text-align');

  const childrenArray = Array.from(selectedNode.reference.childNodes);
  const nodeChildren = selectedNode.children as SelectedNode[];

  const updatedElement: string[] = [];
  const template = `<div style="text-align: ${
    previousAlign || propertyValue
  };">?</div>`;

  const startChildren = getStartChildren({ childrenArray, nodeChildren });
  if (startChildren) updatedElement.push(template.replace('?', startChildren));

  const updatedContent = getUpdatedContentForAlignProperty(
    nodeChildren,
    propertyValue,
    template,
    points,
    previousAlign,
  );

  updatedElement.push(updatedContent);

  const endChildren = getEndChildren({ childrenArray, nodeChildren });
  if (endChildren) updatedElement.push(template.replace('?', endChildren));

  return updatedElement.join('');
};

export { childSelect, childrenSelect, subChildrenSelect };
