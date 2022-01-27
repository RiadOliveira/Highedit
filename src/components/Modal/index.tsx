import React, { AllHTMLAttributes, useCallback, useState } from 'react';
import Input from 'components/Input';
import Select from 'components/Select';
import { AnimatedProps } from 'react-spring';
import { useModal } from 'hooks/modal';
import { Container, ContentBox, Button } from './styles';

type ModalProps = AnimatedProps<AllHTMLAttributes<HTMLDivElement>>;

const Modal: React.FC<ModalProps> = ({ style }) => {
  const {
    modalProps: { text, type, actionFunction },
    hideModal,
  } = useModal();

  const [selectedText, setSelectedText] = useState('');

  const confirmModal = useCallback(() => {
    hideModal();
    actionFunction(selectedText);
  }, [actionFunction, hideModal, selectedText]);

  return (
    <Container style={style}>
      <ContentBox>
        <p>{text}</p>

        {type === 'input' ? (
          <Input onChange={({ target: { value } }) => setSelectedText(value)} />
        ) : (
          <Select setFunction={setSelectedText} />
        )}

        <Button onClick={confirmModal} type="button">
          Confirmar
        </Button>
      </ContentBox>
    </Container>
  );
};

export default Modal;
