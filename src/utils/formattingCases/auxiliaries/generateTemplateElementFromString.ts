const generateTemplateElementFromString = (content: string): Node => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = content;

  return templateElement.content;
};

export default generateTemplateElementFromString;
