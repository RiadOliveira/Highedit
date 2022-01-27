import React from 'react';
import { ElementContext } from './element';
import { ModalContext } from './modal';

const ContextsProvider: React.FC = ({ children }) => (
  <ElementContext>
    <ModalContext>{children}</ModalContext>
  </ElementContext>
);

export default ContextsProvider;
