import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    // Fetch pickleball courts data from the backend
    axios.get('http://localhost:5000/api/courts')
      .then(response => setCourts(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pickleball Courts</h1>
      </header>
      <main>
        <ul>
          {courts.map(court => (
            <li key={court.id}>
              <h2>{court.name}</h2>
              <p>{court.description}</p>
              <p>Location: {court.location}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
