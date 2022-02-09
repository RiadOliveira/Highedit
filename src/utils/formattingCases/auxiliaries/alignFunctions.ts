import { SelectedNode } from 'utils/getUpdatedNodes';
import getExtremeTextsUsingPoints from './getExtremeTextsUsingPoints';

interface Selection {
  start: number;
  end: number;
}

const childSelect = (
  { content, reference }: SelectedNode,
  propertyValue: string,
  points: Selection,
): string => {
  const referenceElement = reference.firstChild?.parentElement || undefined;
  const updatedContent: string[] = [];

  const updatedElement = document.createElement('section');
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
  initialPosition: boolean,
  finalPosition: boolean,
  propertyValue: string,
): string => {
  const updatedContent: string[] = [];
  const { reference } = selectedNode;

  if (initialPosition) {
    updatedContent.push(`<section style="text-align: ${propertyValue};">`);
  }

  const referenceHTML = reference.firstChild?.parentElement;
  const childContent = (() => {
    if (reference.nodeName === 'SECTION') return referenceHTML?.innerHTML;
    if (reference.nodeName === 'SPAN') return referenceHTML?.outerHTML;
    return selectedNode.content;
  })();
  updatedContent.push(childContent || '');

  if (finalPosition) updatedContent.push('</section>');
  return updatedContent.join('');
};

const subChildrenSelect = (): string => {
  return '';
};

export { childSelect, childrenSelect, subChildrenSelect };
