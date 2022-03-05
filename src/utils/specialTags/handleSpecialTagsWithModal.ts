/* eslint-disable no-param-reassign */
import { ParsedModalProps } from 'hooks/modal';
import ConvertRGBtoHex from 'utils/convertRgbToHex';
import { SelectedNode } from 'utils/getUpdatedNodes';
import { Property } from 'utils/properties';

const handleSpecialTagsWithModal = (
  property: Property,
  { reference: { firstChild } }: SelectedNode,
  modalFunction: (modalProps: ParsedModalProps) => void,
  afterModalFunction: () => void,
): void => {
  const { name } = property;
  const notModalProperty =
    name !== 'Aa' && name !== 'font' && name !== '#' && name !== 'img';
  if (property.type === 'style' || notModalProperty) {
    afterModalFunction();
    return;
  }

  const actionFunction = (value: string) => {
    const parsedValue = Number(value) ? `${value}px` : value;

    if (value && property.code) {
      if (typeof property.code !== 'string') property.code.value = parsedValue;
      else property.code = parsedValue;
    }
    afterModalFunction();
  };

  const props: ParsedModalProps = {
    actionFunction,
    type: 'input',
    text: '',
  };

  // eslint-disable-next-line default-case
  switch (name) {
    case '#': {
      const rgbValue = firstChild?.parentElement?.style.color;

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

    case 'img': {
      props.text = 'Digite o link da imagem:';
      props.inputType = 'text';

      break;
    }

    case 'font': {
      const fontFamily = firstChild?.parentElement?.style.fontFamily;

      props.initialValue = fontFamily?.replaceAll('"', '');
      props.type = 'select';
      props.text = 'Selecione a fonte desejada:';

      break;
    }
  }

  modalFunction(props);
};

export default handleSpecialTagsWithModal;
