import { ParsedModalProps } from 'hooks/modal';
import ConvertRGBtoHex from 'utils/convertRgbToHex';
import { SelectedNode } from 'utils/getUpdatedNodes';
import { Property } from 'utils/properties';

const specialTagsSwitch = (
  property: Property,
  { reference: { firstChild } }: SelectedNode,
  modalFunction: (modalProps: ParsedModalProps) => void,
  afterModalFunction: () => void,
): void => {
  const { name } = property;
  const notModalProperty = name !== 'Aa' && name !== 'font' && name !== '#';
  if (property.type === 'style' || notModalProperty) {
    afterModalFunction();
    return;
  }

  const actionFunction = (value: string) => {
    const parsedValue = Number(value) ? `${value}px` : value;
    // eslint-disable-next-line no-param-reassign
    if (value && property.code) property.code.value = parsedValue;
    afterModalFunction();
  };

  const props: ParsedModalProps = {
    actionFunction,
    type: 'input',
    text: '',
  };

  const elementStyle = firstChild?.parentElement?.style;

  switch (name) {
    case '#': {
      const rgbValue = elementStyle?.color;
      props.initialValue = rgbValue ? ConvertRGBtoHex(rgbValue) : '#000000';

      props.text = 'Insira a cor desejada:';
      props.inputType = 'color';

      break;
    }

    case 'Aa': {
      props.text = 'Digite o tamanho da fonte:';
      props.inputType = 'text';

      break;
    }

    // Case font.
    default: {
      props.initialValue = elementStyle?.fontFamily;
      props.type = 'select';
      props.text = 'Selecione a fonte desejada:';
    }
  }

  modalFunction(props);
};

export default specialTagsSwitch;
