import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { PlayerProvider } from './contexts/PlayerContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider resetCSS>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
