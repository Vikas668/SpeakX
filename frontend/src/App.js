import React from 'react';
import Search from './components/Search';
import './App.css'; 

function App() {
  return (
    <div className="body">
    <div className="App">
      <h1>Questions Search</h1>
      <Search />
      
    </div>
    <div className="image-container">
    <img src="/hey.png" alt="Boy suggesting to try this feature" className="floating-image" />
  </div></div>
  );
}

export default App;
