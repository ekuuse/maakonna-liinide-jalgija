
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Results from './Results';
import './App.css';


function App() {
  const [stops, setStops] = useState<string[]>([]);
  const [stopFrom, setStopFrom] = useState('');
  const [stopTo, setStopTo] = useState('');
  const [resultsFrom, setResultsFrom] = useState<string[]>([]);
  const [resultsTo, setResultsTo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all stops from backend
    const fetchStops = async () => {
      try {
        const response = await fetch('/bus/stops');
        if (response.ok) {
          const data = await response.json();
          setStops(data.stops || []);
        }
      } catch (err) {
        console.error('Error fetching stops:', err);
      }
    };
    fetchStops();
  }, []);

  const removeDiacritics = (str: string) => {
  return str
    .normalize('NFD') // decompose letters + accents
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/Š/g, 'S')
    .replace(/Ž/g, 'Z')
    .replace(/õ/g, 'o')
    .replace(/Õ/g, 'O')
    .replace(/ä/g, 'a')
    .replace(/Ä/g, 'A')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U');
};

const handleChangeFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setStopFrom(value);

  if (value.trim() === '') {
    setResultsFrom([]);
    return;
  }

  try {
    const normalizedQuery = removeDiacritics(value.toLowerCase());
    const matches = stops.filter((stop) =>
      removeDiacritics(stop.toLowerCase()).includes(normalizedQuery)
    );
    setResultsFrom(matches);
  } catch (err) {
    setResultsFrom([]);
  }
};

const handleChangeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setStopTo(value);

  if (value.trim() === '') {
    setResultsTo([]);
    return;
  }

  try {
    const normalizedQuery = removeDiacritics(value.toLowerCase());
    const matches = stops.filter((stop) =>
      removeDiacritics(stop.toLowerCase()).includes(normalizedQuery)
    );
    setResultsTo(matches);
  } catch (err) {
    setResultsTo([]);
  }
};


const handleSelectFrom = (stop: string) => {
  setStopFrom(stop);
  setResultsFrom([]);
};

const handleSelectTo = (stop: string) => {
  setStopTo(stop);
  setResultsTo([]);
  setError(null);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  
  if (!stopFrom.trim() || !stopTo.trim()) {
    setError('Palun vali nii algus- kui ka lõpp-peatus');
    return;
  }
  
  try {
    const response = await fetch(`/bus/search?stop_from=${encodeURIComponent(stopFrom)}&stop_to=${encodeURIComponent(stopTo)}`);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.message || 'Viga otsingu tegemisel');
      return;
    }
    const data = await response.json();
    
    // Navigate to results page with the data
    navigate('/results', { state: { results: data.results, stopFrom, stopTo } });
  } catch (err) {
    setError('Serveri viga');
  }
};


  return (
    <>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/">Otsing</Link> | <Link to="/results">Tulemused</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>bussileidja</h1>
              <div className="search-container">
                <p>Otsige bussipeatusi all olevast kastist.</p>
                <form id="otsing" autoComplete="off" onSubmit={handleSubmit}>
                  <div className="input-wrapper">
                    <label htmlFor="stop-from">Alguspeatus:</label>
                    <input
                      id="stop-from"
                      placeholder="Otsi alguspeatust..."
                      value={stopFrom}
                      onChange={handleChangeFrom}
                      required
                    />
                    {resultsFrom.length > 0 && (
                      <ul className="autocomplete-results">
                        {resultsFrom.map((stop, idx) => (
                          <li key={idx} onClick={() => handleSelectFrom(stop)}>
                            {stop}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <label htmlFor="stop-to">Lõpppeatus:</label>
                    <input
                      id="stop-to"
                      placeholder="Otsi lõpppeatust..."
                      value={stopTo}
                      onChange={handleChangeTo}
                      required
                    />
                    {resultsTo.length > 0 && (
                      <ul className="autocomplete-results">
                        {resultsTo.map((stop, idx) => (
                          <li key={idx} onClick={() => handleSelectTo(stop)}>
                            {stop}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button type="submit">
                    Otsi
                  </button>
                </form>
                {error && <div className="error">{error}</div>}
              </div>
            </div>
          }
        />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  );
}

export default App;
