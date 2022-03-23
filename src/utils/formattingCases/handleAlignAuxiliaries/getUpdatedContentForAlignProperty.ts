import { SelectedNode } from 'utils/getUpdatedNodes';
import { SelectionPoints } from '..';

import getContentFromChild from '../auxiliaries/getContentFromChild';
import getUpdatedExtremeSubChild from './getUpdatedExtremeSubChild';

const getUpdatedContentForAlignProperty = (
  nodeChildren: SelectedNode[],
  template: string,
  previousTemplate: string,
  onlyOneChild: boolean,
  selectionPoints?: SelectionPoints,
): string => {
  const { length } = nodeChildren;

  const selectedChildren = nodeChildren.map((child, index) => {
    if (index === 0 || index === length - 1) {
      return getUpdatedExtremeSubChild(
        template,
        previousTemplate,
        index === 0,
        onlyOneChild,
        child,
        selectionPoints,
      );
    }

    const childContent = getContentFromChild(child.reference);
    return template.replace('?', childContent);
  });

  return selectedChildren.join('');
};

export default getUpdatedContentForAlignProperty;
