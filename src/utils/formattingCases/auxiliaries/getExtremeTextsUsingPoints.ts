import { SelectionPoints } from '..';

// Used when removes a style/tag on some part of text.
const getExtremeTextsUsingPoints = (
  content: string,
  { start, end }: SelectionPoints,
  template?: HTMLElement,
): { start: string; end: string; template: string } => {
  const verifiedTemplate = template
    ? template.outerHTML.replace(template.innerText, '?')
    : '?';

  const finalTexts = {
    start: '',
    end: '',
  };

  const startText = content.slice(0, start);
  if (start !== 0 && startText) {
    finalTexts.start = verifiedTemplate.replace('?', startText);
  }

  const endText = content.slice(end);
  if (end !== content.length && endText) {
    finalTexts.end = verifiedTemplate.replace('?', endText);
  }

  return { template: verifiedTemplate, ...finalTexts };
};

export default getExtremeTextsUsingPoints;
