import React from 'react';
import Player from './components/Player';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="text-xl">
        LofiMusic Player
      </div>
      <Player />
    </ThemeProvider>
  );
};

export default App;
