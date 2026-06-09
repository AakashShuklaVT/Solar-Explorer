import React from 'react';
import './App.css';
import Sidebar from './components/ui/Sidebar';
import MainScene from './components/scene/MainScene';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="view-container">
        <MainScene />
      </main>
    </div>
  );
}

export default App;
