import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';
import Toast from 'react-native-toast-message';
import Router from './src/routes/Router';
import { NavigationContainer } from '@react-navigation/native';
import { SpeechRecognitionRootView } from 'react-native-voicebox-speech-rec';
import { PaperProvider } from 'react-native-paper';

export default function App() {

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const splashTimeout = setTimeout(() => {
      SplashScreen.hide();
    }, 3000);

    return () => {
      clearTimeout(splashTimeout);
    };

  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <PaperProvider>
            <SpeechRecognitionRootView>
              <Router />
            </SpeechRecognitionRootView>
          </PaperProvider>
        </NavigationContainer>
        <Toast />
      </PersistGate>
    </Provider>
  );
}
