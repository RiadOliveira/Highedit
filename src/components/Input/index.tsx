import React, { InputHTMLAttributes, useEffect, useRef } from 'react';
import { Container } from './styles';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = props => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return <Container ref={inputRef} {...props} />;
};

export default Input;
