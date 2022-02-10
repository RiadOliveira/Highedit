import replaceChildUsingTemplate from './replaceChildUsingTemplate';

const buildTemplateElementForAlignProperty = (
  updatedChildContent: string,
  template: string,
  removeSelectedContentAlign: boolean,
): HTMLTemplateElement => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = updatedChildContent;

  const { content } = templateElement;
  const { childNodes } = content;
  const { length } = childNodes;

  const replaceChildUsingTemplateProps = {
    templateContent: content,
    templateToUse: template,
  };

  if (length > 1) {
    replaceChildUsingTemplate({
      templateContentChild: content.firstChild as ChildNode,
      ...replaceChildUsingTemplateProps,
    });
  }

  if (length === 3) {
    replaceChildUsingTemplate({
      templateContentChild: content.lastChild as ChildNode,
      ...replaceChildUsingTemplateProps,
    });
  }

  // If same value, removes property of selected child part.
  if (removeSelectedContentAlign) {
    const selectedChild = length === 1 ? childNodes[0] : childNodes[1];
    content.replaceChild(selectedChild.firstChild as ChildNode, selectedChild);
  }

  return templateElement;
};

export default buildTemplateElementForAlignProperty;
