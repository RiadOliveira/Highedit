const replaceTagName = (
  outerHTML: string,
  oldTagName: string,
  newTagName: string,
): string =>
  outerHTML
    .replace(`<${oldTagName}`, `<${newTagName}`)
    .replace(`${oldTagName}>`, `${newTagName}>`);

export default replaceTagName;
