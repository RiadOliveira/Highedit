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
  propertyValue: string,
  selectionPoints: SelectionPoints,
  previousTemplate: string,
  previousAlign: string | undefined,
  onlyOneNode: boolean,
): string => {
  const removeSelectedContentAlign = propertyValue === previousAlign;

  const alignTemplate = `<div style="text-align: ${propertyValue}">?</div>`;
  const template = removeSelectedContentAlign ? '?' : alignTemplate;

  if (onlyOneNode && nodeChildren.length === 1) {
    const [{ reference, content }] = nodeChildren;

    const { start, end } = getExtremeTextsUsingPoints(
      reference.textContent || '',
      selectionPoints,
      reference.firstChild?.parentElement || undefined,
    );

    const updatedContent: string[] = [];

    if (start) updatedContent.push(previousTemplate.replace('?', start));
    updatedContent.push(template.replace('?', content));
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
