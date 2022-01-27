import Main from 'pages/Main';
import React from 'react';
import ContextsProvider from 'hooks';

const App: React.FC = () => (
  <ContextsProvider>
    <Main />
  </ContextsProvider>
);

export default App;
