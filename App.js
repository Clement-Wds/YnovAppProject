import React from 'react';
import {ThemeProvider} from 'styled-components/native';
import { Provider } from 'react-redux';

import Routes from './src/config/routes';

import { store } from "./src/config/store";
import {theme} from './src/components/styles/theme';

const App = () => {
  return (
    // <Provider store={store}>
    //   <ThemeProvider theme={theme}>
    //     <Routes />
    //   </ThemeProvider>
    // </Provider>
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
};

export default App;
