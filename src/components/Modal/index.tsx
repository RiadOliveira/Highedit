import React, { AllHTMLAttributes, useCallback, useState } from 'react';
import Input from 'components/Input';
import Select from 'components/Select';
import { AnimatedProps } from 'react-spring';
import { useModal } from 'hooks/modal';
import { Container, ContentBox, Button } from './styles';

type ModalProps = AnimatedProps<AllHTMLAttributes<HTMLDivElement>>;

const Modal: React.FC<ModalProps> = ({ style }) => {
  const {
    modalProps: { text, type, actionFunction, inputType, initialValue },
    hideModal,
  } = useModal();

  const [selectedText, setSelectedText] = useState('');

  const confirmModal = useCallback(() => {
    hideModal();
    actionFunction(selectedText);
  }, [actionFunction, hideModal, selectedText]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === 'Escape') hideModal();
      if (key === 'Enter') confirmModal();
    },
    [confirmModal, hideModal],
  );

  return (
    <Container style={style}>
      <ContentBox
        onMouseLeave={hideModal}
        onKeyUp={event => handleKeyPress(event.key)}
      >
        <p>{text}</p>

        {type === 'input' ? (
          <Input
            type={inputType}
            defaultValue={initialValue}
            onChange={({ target: { value } }) => setSelectedText(value)}
          />
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
