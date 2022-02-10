import { SelectionPoints } from 'utils/formattingCases';

const getExtremeContentPoints = (
  selectedContent: string,
  nodeContent: string,
  isInitialPosition: boolean,
): SelectionPoints => {
  const start = (() => {
    if (isInitialPosition) return nodeContent.lastIndexOf(selectedContent);
    return nodeContent.indexOf(selectedContent);
  })();

  return { start, end: start + selectedContent.length };
};

export default getExtremeContentPoints;
