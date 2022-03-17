import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '..';

import getContentFromChild from '../auxiliaries/getContentFromChild';
import getExtremeTextsUsingPoints from '../auxiliaries/getExtremeTextsUsingPoints';
import {
  getFinalChild,
  getInitialChild,
} from './getSubChildUpdatedAlignContent';

const getUpdatedContentForAlignProperty = (
  nodeChildren: SelectedNode[],
  template: string,
  selectionPoints: SelectionPoints,
  previousTemplate: string,
  onlyOneNode: boolean,
): string => {
  if (onlyOneNode && nodeChildren.length === 1) {
    const [{ reference, content }] = nodeChildren;

    // To get spans texts with their styles.
    const {
      start,
      end,
      template: tagTemplate,
    } = getExtremeTextsUsingPoints(
      reference.textContent || '',
      selectionPoints,
      reference.firstChild?.parentElement || undefined,
    );

    const updatedContent: string[] = [];
    const contentWithTemplate = tagTemplate.replace('?', content);

    if (start) updatedContent.push(previousTemplate.replace('?', start));
    updatedContent.push(template.replace('?', contentWithTemplate));
    if (end) updatedContent.push(previousTemplate.replace('?', end));

    return updatedContent.join('');
  }

  const selectedChildren = nodeChildren.map((child, index) => {
    if (index === 0) return getInitialChild(template, previousTemplate, child);

    if (index === nodeChildren.length - 1) {
      return getFinalChild(template, previousTemplate, child);
    }

    const childContent = getContentFromChild(child.reference);
    return template.replace('?', childContent);
  });

  return selectedChildren.join('');
};

export default getUpdatedContentForAlignProperty;
