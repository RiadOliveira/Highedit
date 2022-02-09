import { SelectedNode } from 'utils/getUpdatedNodes';
import getContentFromChild from './getContentFromChild';

interface GetUnselectedSubChildrenFunctionsProps {
  nodeChildren: SelectedNode[];
  childrenArray: ChildNode[];
}

const getStartChildren = ({
  nodeChildren,
  childrenArray,
}: GetUnselectedSubChildrenFunctionsProps): string => {
  const firstSelectedChild = nodeChildren[0];
  const firstChildIndex = childrenArray.indexOf(firstSelectedChild.reference);

  const startChildrenContent: string[] = [];

  for (let ind = 0; ind < firstChildIndex; ind++) {
    startChildrenContent.push(getContentFromChild(childrenArray[ind]) || '');
  }

  return startChildrenContent.join('');
};

const getEndChildren = ({
  nodeChildren,
  childrenArray,
}: GetUnselectedSubChildrenFunctionsProps): string => {
  const lastSelectedChildPosition = nodeChildren.length - 1;
  const lastSelectedChild = nodeChildren[lastSelectedChildPosition];
  const lastChildIndex = childrenArray.indexOf(lastSelectedChild.reference);

  const endChildrenContent: string[] = [];

  for (let ind = childrenArray.length - 1; ind > lastChildIndex; ind--) {
    endChildrenContent.push(getContentFromChild(childrenArray[ind]) || '');
  }

  return endChildrenContent.join('');
};

export { getStartChildren, getEndChildren };
