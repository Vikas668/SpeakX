import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 10;
  const [error, setError] = useState(null);


  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/search', { query });

      if (response.data && response.data.questions) {
        setResults(response.data.questions);
        setCurrentIndex(0);
        setError(null);
      } else {
        setResults([]);
        setError('No results found.');
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    }
  };


  const nextSlide = () => {
    if (currentIndex + itemsPerPage < results.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}


      {results.length > 0 && (
        <div className="carousel-container">
          <div className="carousel">
            <ol>
              {results.slice(currentIndex, currentIndex + itemsPerPage).map((question, index) => {

                const globalIndex = currentIndex + index + 1;
                return (
                  <li className="carousel-item" key={globalIndex}>
                    Question {globalIndex}: {question.title} (Type: {question.type})
                  </li>
                );
              })}
            </ol>
          </div>


          <div className="carousel-controls">
            <button onClick={prevSlide} disabled={currentIndex === 0}>
              Previous
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex + itemsPerPage >= results.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
