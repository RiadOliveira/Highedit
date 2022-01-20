import Main from 'pages/Main';
import React from 'react';
import { ElementContext } from 'hooks/element';

const App: React.FC = () => (
  <ElementContext>
    <Main />
  </ElementContext>
);

export default App;
