import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TextSummarizer from './TextSummarizer';
import DiagramPage from './DiagramPage';
import Navbar from './Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/yt_sm" element={<TextSummarizer />} />
        <Route path="/yt_sm/diagram" element={<DiagramPage />} />
      </Routes>
    </Router>
  );
}

export default App;