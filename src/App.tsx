import Main from 'pages/Main';
import React from 'react';
import Modal from 'components/Modal';
import { ElementContext } from 'hooks/element';

const App: React.FC = () => (
  <ElementContext>
    <Main />
    <Modal />
  </ElementContext>
);

export default App;
