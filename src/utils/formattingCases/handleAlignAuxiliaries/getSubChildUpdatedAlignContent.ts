import { SelectedNode } from 'utils/getUpdatedNodes';
import getExtremeContentPoints from 'utils/getUpdatedNodes/auxiliaries/getExtremeContentPoints';
import getExtremeTextsUsingPoints from '../auxiliaries/getExtremeTextsUsingPoints';

export const getInitialChild = (
  template: string,
  previousTemplate: string,
  { reference, content }: SelectedNode,
): string => {
  const childContent = reference.textContent || '';
  const { start } = getExtremeContentPoints(content, childContent, true);

  const { start: startText } = getExtremeTextsUsingPoints(
    childContent,
    { start, end: start },
    reference.firstChild?.parentElement || undefined,
  );

  const updatedContent: string[] = [];
  if (startText) updatedContent.push(previousTemplate.replace('?', startText));
  updatedContent.push(template.replace('?', content));

  return updatedContent.join('');
};

export const getFinalChild = (
  template: string,
  previousTemplate: string,
  { reference, content }: SelectedNode,
): string => {
  const childContent = reference.textContent || '';
  const { end } = getExtremeContentPoints(content, childContent, false);

  const { end: endText } = getExtremeTextsUsingPoints(
    childContent,
    { start: end, end },
    reference.firstChild?.parentElement || undefined,
  );

  const updatedContent: string[] = [];
  if (endText) updatedContent.push(previousTemplate.replace('?', endText));
  updatedContent.push(template.replace('?', content));

  return updatedContent.join('');
};
