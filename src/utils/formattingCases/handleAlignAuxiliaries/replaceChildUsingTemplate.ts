import getContentFromChild from '../auxiliaries/getContentFromChild';

interface ReplaceChildUsingTemplateProps {
  templateContent: DocumentFragment;
  templateContentChild: ChildNode;
  templateToUse: string;
}

// Replace child by it with template.
const replaceChildUsingTemplate = ({
  templateContent,
  templateContentChild,
  templateToUse,
}: ReplaceChildUsingTemplateProps): void => {
  const childContent = getContentFromChild(templateContentChild);

  const childTemplate = document.createElement('template');
  childTemplate.innerHTML = templateToUse.replace('?', childContent);

  templateContent.replaceChild(
    childTemplate.content.firstChild as ChildNode,
    templateContentChild,
  );
};

export default replaceChildUsingTemplate;
