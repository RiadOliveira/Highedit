import replaceTagName from './replaceTagName';
import unifyAndSetElementChildren from './unifyAndSetElementChildren';

interface Selection {
  start: number;
  end: number;
}

interface Code {
  cssProp: string;
  value: string;
}

interface HasTagFunctionProps {
  element: HTMLElement;
  selectedText: string;
  points: Selection;
  code: Code;
}

// -----------
// Auxiliaries
// -----------

const getContentTools = (
  child: ChildNode,
): { updatedText: string[]; content: string } => {
  let content = '';

  if (!child.childNodes.length) {
    content = child.textContent || '';
  } else {
    const childrenArray = Array.from(child.childNodes);

    content = childrenArray
      .map(({ firstChild, textContent }) => {
        const subChildHTML = firstChild?.parentElement?.outerHTML;
        return subChildHTML || textContent;
      })
      .join('');
  }

  return {
    updatedText: [],
    content,
  };
};

// Used when removes a style/tag on some part of text.
const getExtremePointsWithTemplate = (
  template: HTMLElement | string,
  content: string,
  start: number,
  end: number,
): { start: string; end: string } => {
  const verifiedTemplate =
    typeof template === 'string'
      ? template
      : template.outerHTML.replace(template.innerText, '?');

  const finalTexts = {
    start: '',
    end: '',
  };

  const startText = content.slice(0, start);
  if (start !== 0 && startText.trim()) {
    finalTexts.start = verifiedTemplate.replace('?', startText);
  }

  const endText = content.slice(end);
  if (end !== content.length && endText.trim()) {
    finalTexts.end = verifiedTemplate.replace('?', endText);
  }

  return finalTexts;
};

const handleHasTagWithoutFullText = (
  childElement: HTMLElement,
  childText: string,
  selectedText: string,
  { cssProp, value }: Code,
  { start, end }: Selection,
) => {
  const { style } = childElement;
  const propertyValue = style.getPropertyValue(cssProp);

  if (propertyValue) {
    const updatedText: string[] = [];
    const { start: startText, end: endText } = getExtremePointsWithTemplate(
      childElement,
      childText,
      start,
      end,
    );

    if (startText) updatedText.push(startText);

    // If has different value, update it, else, remove all styles.
    if (propertyValue !== value) {
      const tagName = cssProp === 'text-align' ? 'section' : 'span';
      updatedText.push(
        `<${tagName} style="${cssProp}:${value};">${selectedText}</${tagName}>`,
      );
    } else updatedText.push(selectedText);

    if (endText) updatedText.push(endText);
    return updatedText.join('');
  }

  // Adding property.
  return childElement.outerHTML.replace(
    selectedText,
    `<span style="${cssProp}:${value};">${selectedText}</span>`,
  );
};

// --------------------
// Formatting functions
// --------------------

const tagFormat = (
  child: ChildNode,
  selectedText: string,
  propertyName: string,
  { start, end }: Selection,
): string => {
  const childElement = child.firstChild?.parentElement;

  const styles = childElement?.getAttribute('style');
  const hasTag = child.nodeName !== '#text';

  const childTagName = child.nodeName.toLowerCase();
  const sameTagName = propertyName === childTagName;

  const childText = child.textContent || '';
  const childInnerHTML = childElement?.innerHTML || '';
  const childOuterHTML = childElement?.outerHTML || '';

  if (hasTag && selectedText.trim() !== childInnerHTML.trim()) {
    // Part of tag's text, removing its tag.
    const { updatedText, content } = getContentTools(child);

    const element = child.firstChild?.parentElement as HTMLElement;
    const template = element.outerHTML.replace(childInnerHTML, '?');
    const { start: startText, end: endText } = getExtremePointsWithTemplate(
      template,
      content,
      start,
      end,
    );

    if (startText) updatedText.push(startText);

    // Keep styles with another tag.
    if (styles) {
      const tagWhenRemove = styles?.includes('text-align') ? 'section' : 'span';
      const tagName = sameTagName ? tagWhenRemove : propertyName;

      updatedText.push(
        template.replaceAll(childTagName, tagName).replace('?', selectedText),
      );
    } else updatedText.push(selectedText);

    if (endText) updatedText.push(endText);
    return updatedText.join('');
  }

  // All tag's text.
  if (!hasTag) {
    return childText.replace(
      selectedText,
      `<${propertyName}>${selectedText}</${propertyName}>`,
    );
  }

  if (!sameTagName) {
    return replaceTagName(childOuterHTML, childTagName, propertyName);
  }

  if (!styles) return selectedText;

  const tagName = styles?.includes('text-align') ? 'section' : 'span';
  return `<${tagName} style="${styles}">${selectedText}</${tagName}>`;
};

// Styles formatting
const justText = (
  child: ChildNode,
  { start, end }: Selection,
  { cssProp, value }: Code,
): string => {
  const { updatedText, content } = getContentTools(child);

  if (start !== 0) updatedText.push(content.slice(0, start));

  const tagName = cssProp === 'text-align' ? 'section' : 'span';

  updatedText.push(
    `<${tagName} style="${cssProp}:${value};">${content.slice(
      start,
      end,
    )}</${tagName}>`,
  );
  updatedText.push(content.slice(end));

  return updatedText.join('');
};

// Child of a created element.
const hasTagIsChild = (
  { element, selectedText, code, points }: HasTagFunctionProps,
  comparativeNode: Node,
): string | Node => {
  const childText = comparativeNode.textContent || '';
  const childElement = comparativeNode.firstChild?.parentElement as HTMLElement;

  switch (selectedText) {
    case childText:
    case childText.trim(): {
      // All text of the tag.
      const { cssProp, value } = code;
      const { nodeName, style } = childElement;

      const hasProp = style.getPropertyValue(cssProp);
      const isAlign = cssProp === 'text-align';

      // If already has property, remove it.
      if (hasProp && value === hasProp) {
        style.removeProperty(cssProp);

        const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'SECTION';
        const isEmptyTag =
          !childElement.getAttribute('style') && verifyEmptyTag;

        if (isEmptyTag) {
          element.replaceChild(
            document.createTextNode(childText),
            comparativeNode,
          );

          const nodesArray = Array.from(element.childNodes);
          unifyAndSetElementChildren(nodesArray, element);
        }
      } else if (isAlign && (nodeName === 'SPAN' || nodeName === 'A')) {
        const updatedElement = document.createElement('section');

        updatedElement.style.setProperty(cssProp, value);
        updatedElement.appendChild(childElement);

        element.replaceChild(updatedElement, comparativeNode);
      } else style.setProperty(cssProp, value);

      return element;
    }

    default: {
      const finalElement = handleHasTagWithoutFullText(
        childElement,
        childText,
        selectedText,
        code,
        points,
      );

      const childContent = childElement.outerHTML;
      return element.outerHTML.replace(childContent, finalElement);
    }
  }
};

// Has tag, but it's just text selected, without children tags.
const hasTagNotChild = ({
  element,
  selectedText,
  code,
  points,
}: HasTagFunctionProps): string | Node => {
  const { innerText: elementText } = element;

  switch (selectedText) {
    case elementText:
    case elementText.trim(): {
      // All text of the tag.
      const { cssProp, value } = code;
      const { nodeName, style } = element;
      const hasProp = style.getPropertyValue(cssProp);

      // If the property is align, modify all parent tag style.

      // If already has property, remove it.
      if (hasProp && value === hasProp) {
        style.removeProperty(cssProp);

        const verifyEmptyTag = nodeName === 'SPAN' || nodeName === 'SECTION';
        const isEmptyTag = !element.getAttribute('style') && verifyEmptyTag;

        if (isEmptyTag) return elementText;
      } else {
        const isAlign = cssProp === 'text-align';

        if (isAlign && (nodeName === 'SPAN' || nodeName === 'A')) {
          const updatedElement = document.createElement('section');

          updatedElement.style.setProperty(cssProp, value);
          updatedElement.appendChild(element);

          return updatedElement;
        }

        style.setProperty(cssProp, value);
      }

      return element;
    }

    default:
      return handleHasTagWithoutFullText(
        element,
        elementText,
        selectedText,
        code,
        points,
      );
  }
};

export default {
  tag: tagFormat,
  style: {
    justText,
    hasTag: {
      isChild: hasTagIsChild,
      notChild: hasTagNotChild,
    },
  },
};
