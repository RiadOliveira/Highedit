import { SelectedNode } from 'utils/getUpdatedNodes';
import getExtremeTextsUsingPoints from './getExtremeTextsUsingPoints';

interface Code {
  cssProp: string;
  value: string;
}

interface Selection {
  start: number;
  end: number;
}

const childSelect = (
  { content, reference }: SelectedNode,
  { cssProp, value }: Code,
  points: Selection,
): string => {
  const parentElement = reference.parentElement as HTMLElement;
  const updatedContent: string[] = [];

  const updatedElement = document.createElement('section');
  updatedElement.style.setProperty(cssProp, value);

  const tagTemplate =
    parentElement.nodeName === 'SPAN' ? parentElement : undefined;

  const { start, end, template } = getExtremeTextsUsingPoints(
    content,
    points,
    tagTemplate,
  );

  updatedElement.innerHTML = template.replace('?', content);

  if (start) updatedContent.push(start);
  updatedContent.push(updatedElement.outerHTML);
  if (end) updatedContent.push(end);

  return updatedContent.join('');
};

const childrenSelect = (
  selectedNodes: SelectedNode[],
  points: Selection,
  { value }: Code,
): string => {
  return '';
};

const subChildrenSelect = (): string => {
  return '';
};

export { childSelect, childrenSelect, subChildrenSelect };
