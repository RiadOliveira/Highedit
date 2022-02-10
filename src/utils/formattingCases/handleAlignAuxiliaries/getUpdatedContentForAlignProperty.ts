import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '..';
import { childSelect } from './alignFunctions';

import getContentFromChild from '../auxiliaries/getContentFromChild';
import buildTemplateElementForAlignProperty from './buildTemplateElementForAlignProperty';

const getUpdatedContentForAlignProperty = (
  nodeChildren: SelectedNode[],
  propertyValue: string,
  previousAlign: string,
  template: string,
  points: SelectionPoints,
): string => {
  const removeSelectedContentAlign = propertyValue === previousAlign;

  if (nodeChildren.length > 1) {
    const selectedChildren = nodeChildren
      .map(({ reference }) => getContentFromChild(reference))
      .join('');

    if (removeSelectedContentAlign) return selectedChildren;

    const updatedTemplate = template.replace(previousAlign, propertyValue);
    return updatedTemplate.replace('?', selectedChildren);
  }

  const updatedChildContent = childSelect({
    selectedNode: nodeChildren[0],
    propertyValue,
    points,
  });

  const templateElement = buildTemplateElementForAlignProperty(
    updatedChildContent,
    template,
    removeSelectedContentAlign,
  );

  return templateElement.innerHTML;
};

export default getUpdatedContentForAlignProperty;
