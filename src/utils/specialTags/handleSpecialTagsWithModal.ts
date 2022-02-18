import { ParsedModalProps } from 'hooks/modal';
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
    options: [],
  };

  if (name === '#') {
    props.initialValue = firstChild?.parentElement?.style.color || '#000000';
    props.text = 'Insira a cor desejada:';
    props.inputType = 'color';
  } else if (name === 'Aa') {
    props.text = 'Digite o tamanho da fonte:';
    props.inputType = 'text';
  } else {
    props.type = 'select';
    props.text = 'Selecione a fonte desejada:';
  }

  modalFunction(props);
};

export default specialTagsSwitch;
