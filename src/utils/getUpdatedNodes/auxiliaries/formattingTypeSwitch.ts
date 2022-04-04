import { SelectionPoints, styleFormat } from 'utils/formattingCases';
import { Property } from 'utils/properties';
import { linkTag, imageTag } from 'utils/specialTags';

const formattingTypeSwtich = (
  child: ChildNode,
  property: Property,
  comparativeNode: Node,
  points: SelectionPoints,
  selectedText: string,
): Node => {
  if (property.code && typeof property.code !== 'string') {
    const { code } = property;
    const { withTag, justText } = styleFormat;

    if (child.nodeName === '#text') return justText(child, points, code);

    const element = child.firstChild?.parentElement as HTMLElement;
    return withTag(element, selectedText, points, comparativeNode, code);
  }

  switch (property.name) {
    case 'a':
      return linkTag(
        child,
        comparativeNode,
        selectedText,
        property.code || '',
        points,
      );

    case 'img':
      return imageTag(child, comparativeNode, property.code || '', points);

    default:
      return new Node();
  }
};

export default formattingTypeSwtich;
