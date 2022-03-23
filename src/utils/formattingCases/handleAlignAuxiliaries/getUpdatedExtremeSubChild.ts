import { SelectedNode } from 'utils/getUpdatedNodes';
import getExtremeContentPoints from 'utils/getUpdatedNodes/auxiliaries/getExtremeContentPoints';
import { SelectionPoints } from '..';
import getExtremeTextsUsingPoints from '../auxiliaries/getExtremeTextsUsingPoints';

const getUpdatedExtremeSubChild = (
  template: string,
  previousTemplate: string,
  isInitialPosition: boolean,
  { reference, content }: SelectedNode,
  selectionPoints?: SelectionPoints,
): string => {
  const childContent = reference.textContent || '';

  const points = (() => {
    if (selectionPoints) return selectionPoints;

    // To get spans texts with their styles.
    const { start, end } = getExtremeContentPoints(
      content,
      childContent,
      isInitialPosition,
    );

    const point = isInitialPosition ? start : end;
    return {
      start: point,
      end: point,
    };
  })();

  const {
    start: startText,
    end: endText,
    template: tagTemplate,
  } = getExtremeTextsUsingPoints(
    childContent,
    points,
    reference.firstChild?.parentElement || undefined,
  );

  const updatedContent: string[] = [];
  const contentWithTemplate = tagTemplate.replace('?', content);
  const finalUpdatedContent = template.replace('?', contentWithTemplate);

  const parsedStartText =
    (selectionPoints || isInitialPosition) && startText
      ? previousTemplate.replace('?', startText)
      : '';

  const parsedEndText =
    (selectionPoints || !isInitialPosition) && endText
      ? previousTemplate.replace('?', endText)
      : '';

  if (parsedStartText) updatedContent.push(parsedStartText);
  updatedContent.push(finalUpdatedContent);
  if (parsedEndText) updatedContent.push(parsedEndText);

  return updatedContent.join('');
};

export default getUpdatedExtremeSubChild;
