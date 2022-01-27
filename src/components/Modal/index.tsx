import React from 'react';
import Input from 'components/Input';
import Select from 'components/Select';
import { Container, ContentBox, Button } from './styles';

const Modal: React.FC = () => {
  return (
    <Container>
      <ContentBox>
        <p>Selecione o tamanho desejado</p>
        <Input />
        <Select />

        <Button type="button">Confirmar</Button>
      </ContentBox>
    </Container>
  );
};

export default Modal;
