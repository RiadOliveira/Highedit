import SideBarButton from 'components/SideBarButton';
import React from 'react';
import { ButtonPair, Container } from './styles';

const properties = [
  ['H1', 'H2'],
  ['H3', 'H4'],
  ['B', 'I'],
];

const SideBar: React.FC = () => {
  return (
    <Container>
      {properties.map(([first, second]) => (
        <ButtonPair>
          <SideBarButton name={first} />
          <SideBarButton name={second} />
        </ButtonPair>
      ))}
    </Container>
  );
};

export default SideBar;
