import React, { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons/lib';
import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name?: string;
  Icon?: IconType;
}

const SideBarButton: React.FC<ButtonProps> = ({ name, Icon, ...props }) => {
  return (
    <Container {...props}>
      {Icon ? <Icon size={14} /> : (name || '').toUpperCase()}
    </Container>
  );
};

export default SideBarButton;
