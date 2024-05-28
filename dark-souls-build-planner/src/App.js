import React, { useState, useEffect } from 'react';
import CharacterPlanner from './components/CharacterPlanner';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [weapons, setWeapons] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch('/weapons.json')
      .then(response => response.json())
      .then(data => setWeapons(data));

    fetch('/classes.json')
      .then(response => response.json())
      .then(data => setClasses(data));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <div id="character-planner">
        <CharacterPlanner classes={classes} weapons={weapons} />
      </div>
    </div>
  );
}

export default App;
