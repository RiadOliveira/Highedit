import { SelectedNode } from 'utils/getUpdatedNodes';
import getExtremeContentPoints from 'utils/getUpdatedNodes/auxiliaries/getExtremeContentPoints';
import getExtremeTextsUsingPoints from '../auxiliaries/getExtremeTextsUsingPoints';

export const getInitialChild = (
  template: string,
  previousTemplate: string,
  { reference, content }: SelectedNode,
): string => {
  const childContent = reference.textContent || '';

  // To get spans texts with their styles.
  const { start } = getExtremeContentPoints(content, childContent, true);
  const { start: startText, template: tagTemplate } =
    getExtremeTextsUsingPoints(
      childContent,
      { start, end: start },
      reference.firstChild?.parentElement || undefined,
    );

  const updatedContent: string[] = [];
  if (startText) updatedContent.push(previousTemplate.replace('?', startText));

  const contentWithTemplate = tagTemplate.replace('?', content);
  updatedContent.push(template.replace('?', contentWithTemplate));

  return updatedContent.join('');
};

export const getFinalChild = (
  template: string,
  previousTemplate: string,
  { reference, content }: SelectedNode,
): string => {
  const childContent = reference.textContent || '';

  // To get spans texts with their styles.
  const { end } = getExtremeContentPoints(content, childContent, false);
  const { end: endText, template: tagTemplate } = getExtremeTextsUsingPoints(
    childContent,
    { start: end, end },
    reference.firstChild?.parentElement || undefined,
  );

  const updatedContent: string[] = [];
  const contentWithTemplate = tagTemplate.replace('?', content);

  updatedContent.push(template.replace('?', contentWithTemplate));
  if (endText) updatedContent.push(previousTemplate.replace('?', endText));

  return updatedContent.join('');
};
