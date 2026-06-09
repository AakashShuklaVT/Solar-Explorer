import React from 'react';
import './App.css';
import Sidebar from './components/ui/Sidebar';
import MainScene from './components/scene/MainScene';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, position: 'relative' }}>
        <MainScene />
      </main>
    </div>
  );
}

export default App;
