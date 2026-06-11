import React from 'react';
import './App.css';
import Sidebar from './components/ui/Sidebar';
import MainScene from './components/scene/MainScene';
import Loader from './components/ui/Loader';
import { usePlanetContext } from './context/PlanetContext';

function App() {
  const { loading } = usePlanetContext();

  return (
    <div className="app-container">
      {loading && <Loader />}
      <Sidebar />
      <main className="view-container">
        <MainScene />
      </main>
    </div>
  );
}

export default App;
