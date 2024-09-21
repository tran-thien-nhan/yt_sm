import React from 'react';
import TextSummarizer from './TextSummarizer';
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <TextSummarizer />
    </ThemeProvider>
  );
}

export default App;