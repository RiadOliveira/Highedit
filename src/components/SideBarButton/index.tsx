import React, { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons/lib';
import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: string | IconType;
  active: boolean;
}

const SideBarButton: React.FC<ButtonProps> = ({
  Icon,
  active,
  name,
  ...props
}) => {
  return (
    <Container active={active} type="button" propName={name || ''} {...props}>
      {typeof Icon === 'string' ? (
        <span>{Icon.charAt(0).toUpperCase() + Icon.slice(1)}</span>
      ) : (
        <Icon size={16} />
      )}
    </Container>
  );
};

export default SideBarButton;
