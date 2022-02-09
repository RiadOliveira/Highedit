import { SelectedNode } from 'utils/getUpdatedNodes';
import getContentFromChild from './getContentFromChild';
import getExtremeTextsUsingPoints from './getExtremeTextsUsingPoints';
import { getEndChildren, getStartChildren } from './getUnselectedSubChildren';

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

const subChildrenSelect = (
  selectedNode: SelectedNode,
  propertyValue: string,
): string => {
  const nodeElement = selectedNode.reference.firstChild?.parentElement;
  const previousAlign = nodeElement?.style.getPropertyValue('text-align');

  if (!selectedNode.children || !previousAlign) return '';

  const childrenArray = Array.from(selectedNode.reference.childNodes);
  const { children: nodeChildren } = selectedNode;

  const updatedElement: string[] = [];
  const template = `<section style="text-align: ${previousAlign};">?</section>`;

  const startChildren = getStartChildren({ childrenArray, nodeChildren });
  if (startChildren) updatedElement.push(template.replace('?', startChildren));

  const updatedContent = (() => {
    const selectedChildren = nodeChildren
      .map(({ reference }) => getContentFromChild(reference))
      .join('');

    if (propertyValue === previousAlign) return selectedChildren;

    const updatedTemplate = template.replace(previousAlign, propertyValue);
    return updatedTemplate.replace('?', selectedChildren);
  })();

  updatedElement.push(updatedContent);

  const endChildren = getEndChildren({ childrenArray, nodeChildren });
  if (endChildren) updatedElement.push(template.replace('?', endChildren));

  return updatedElement.join('');
};

export { childSelect, childrenSelect, subChildrenSelect };
