import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

const SideBarButton: React.FC<ButtonProps> = ({ name, ...props }) => {
  return <Container {...props}>{name.toUpperCase()}</Container>;
};

export default SideBarButton;
