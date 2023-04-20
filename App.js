import React, {useEffect} from 'react';
import {ThemeProvider} from 'styled-components/native';
import {Provider} from 'react-redux';
import './src/translations';
import Routes from './src/config/routes';
import {useTranslation} from 'react-i18next';

import {store} from './src/config/store';
import {theme} from './src/components/styles/theme';
import {musiclibrary} from './data';
import TrackPlayerScreen from './src/components/TrackPlayerScreen';
import TrackPlayer from 'react-native-track-player';

const App = () => {
  const {t} = useTranslation();
  const setup = async () => {
    await TrackPlayer.setupPlayer({});
    await TrackPlayer.add(musiclibrary);
  };
  useEffect(() => {
    setup();
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
     
    </Provider>
    // <ThemeProvider theme={theme}>
    //   <Routes />
    // </ThemeProvider>
  );
};

export default App;
