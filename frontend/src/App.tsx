
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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

  // Fuzzy search: returns true if two strings are similar enough
  const fuzzyMatch = (a: string, b: string) => {
    // Lowercase and remove diacritics for both strings
    const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    a = normalize(a);
    b = normalize(b);

    // If one string contains the other, it's a match
    if (a.includes(b) || b.includes(a)) return true;

    // Levenshtein distance implementation
    function levenshtein(s: string, t: string): number {
      const m = s.length, n = t.length;
      const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) d[i][0] = i;
      for (let j = 0; j <= n; j++) d[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = s[i - 1] === t[j - 1] ? 0 : 1;
          d[i][j] = Math.min(
            d[i - 1][j] + 1,      // deletion
            d[i][j - 1] + 1,      // insertion
            d[i - 1][j - 1] + cost // substitution
          );
        }
      }
      return d[m][n];
    }

    // Allow a small Levenshtein distance (e.g., 1 or 2 for short words)
    const maxDistance = Math.max(1, Math.floor(Math.min(a.length, b.length) / 4));
    return levenshtein(a, b) <= maxDistance;
  };

const handleChangeFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setStopFrom(value);

  if (value.trim() === '') {
    setResultsFrom([]);
    return;
  }

  try {
    const matches = stops.filter((stop) => fuzzyMatch(stop, value));
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
    const matches = stops.filter((stop) => fuzzyMatch(stop, value));
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
      <Routes>
        <Route
          path="/"
          element={
            <div>
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
