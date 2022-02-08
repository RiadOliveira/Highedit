interface Points {
  start: number;
  end: number;
}

const getExtremeContentPoints = (
  selectedContent: string,
  nodeContent: string,
  isInitialPosition: boolean,
): Points => {
  const start = (() => {
    if (isInitialPosition) return nodeContent.lastIndexOf(selectedContent);
    return nodeContent.indexOf(selectedContent);
  })();

  return { start, end: start + selectedContent.length };
};

export default getExtremeContentPoints;
