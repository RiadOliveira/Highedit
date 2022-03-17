import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '..';
import { childSelect } from './alignFunctions';

import getContentFromChild from '../auxiliaries/getContentFromChild';

const getUpdatedContentForAlignProperty = (
  nodeChildren: SelectedNode[],
  propertyValue: string,
  template: string,
  points: SelectionPoints,
  previousAlign: string | undefined,
): string => {
  const removeSelectedContentAlign = propertyValue === previousAlign;

  if (nodeChildren.length > 1) {
    const selectedChildren = nodeChildren
      .map(({ reference }) => getContentFromChild(reference))
      .join('');

    if (removeSelectedContentAlign) return selectedChildren;
    if (!previousAlign) return template.replace('?', selectedChildren);

    const updatedTemplate = template.replace(previousAlign, propertyValue);
    return updatedTemplate.replace('?', selectedChildren);
  }

  return childSelect({
    selectedNode: nodeChildren[0],
    propertyValue,
    points,
  });
};

export default getUpdatedContentForAlignProperty;
