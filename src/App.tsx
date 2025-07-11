import React from 'react';
import Player from './components/Player';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Player />
    </ThemeProvider>
  );
};

export default App;
