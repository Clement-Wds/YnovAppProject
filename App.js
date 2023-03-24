import React from 'react';
import {ThemeProvider} from 'styled-components/native';
import {theme} from './src/components/styles/theme';
import Routes from './src/config/routes';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
};

export default App;
