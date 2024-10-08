import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { PlayerProvider } from './contexts/PlayerContext';
import { AppProvider } from './contexts/AppContext';
import { ShepherdJourneyProvider } from 'react-shepherd';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider resetCSS>
      <AppProvider>
        <PlayerProvider>
          <ShepherdJourneyProvider>
            <App />
          </ShepherdJourneyProvider>
        </PlayerProvider>
      </AppProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
