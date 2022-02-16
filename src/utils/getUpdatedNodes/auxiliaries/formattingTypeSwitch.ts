import { SelectionPoints, styleFormat } from 'utils/formattingCases';
import { Property } from 'utils/properties';
import specialTags from 'utils/specialTags';

const formattingTypeSwtich = (
  child: ChildNode,
  property: Property,
  comparativeNode: Node,
  points: SelectionPoints,
  selectedText: string,
): string | Node => {
  if (property.code) {
    const { code } = property;
    const { withTag, justText } = styleFormat;

    if (child.nodeName === '#text') return justText(child, points, code);

    const element = child.firstChild?.parentElement as HTMLElement;
    return withTag(element, selectedText, points, comparativeNode, code);
  }

  const { linkTag } = specialTags;

  switch (property.name) {
    case 'a':
      return linkTag(child, comparativeNode, selectedText, points);

    default:
      return '';
  }
};

export default formattingTypeSwtich;
