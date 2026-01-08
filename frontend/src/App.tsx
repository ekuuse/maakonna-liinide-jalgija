import { useState } from 'react';
import './App.css';

const stops = [
  "Tartu bussijaam",
  "Soola",
  "Soola I",
  "Soola II",
  "Kesklinn I",
  "Kesklinn II",
  "Kesklinn III",
  "Turu",
  "Vabaduse pst",
  "Raeplats",
  "Vabadussild/Palmihoone",
  "Hurda",
  "Kreutzwaldi",
  "Maaülikool",
  "Tartu Näitused",
  "Metsamaja",
  "Vorbuse tee",
  "Muide",
  "Tiksoja",
  "Vorbuse",
  "Külasüda",
  "Kummeli",
  "Puidu",
  "Eesti Rahva Muuseum",
  "Lõunakeskus",
  "Roheline park",
  "Kesklinn IV",
  "Kesklinn V",
  "Kesklinn VI",
  "Tõrvandi",
  "Kärevere sild",
  "Kärevere",
  "Põlva",
  "Otepää",
  "Valga",
  "Puhja",
  "Annelinna Keskus",
  "Variku",
  "Tähtvere",
  "Tähe tn",
  "Herne",
  "Kaubabaas",
  "Killustiku",
  "Kroonuaia",
  "Laululava",
  "Lille",
  "Linda",
  "Ihaste",
  "Melissi",
  "Mileedi",
  "Mõisapargi",
  "Piiri",
  "Forseliuse",
  "Saekoja",
];


function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [busStopData, setBusStopData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setQuery(value);

  if (value.trim() === '') {
    setResults([]);
    return;
  }

  try {
    const normalizedQuery = removeDiacritics(value.toLowerCase());
    const matches = stops.filter((stop) =>
      removeDiacritics(stop.toLowerCase()).includes(normalizedQuery)
    );
    setResults(matches);
  } catch (err) {
    setResults([]);
  }
};


const handleSelect = (stop: string) => {
  setQuery(stop);
  setResults([]);
  setBusStopData(null);
  setError(null);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setBusStopData(null);
  setError(null);
  if (!query.trim()) return;
  try {
    const response = await fetch(`/bus/search/${encodeURIComponent(query)}`);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.message || 'Bus stop not found');
      return;
    }
    const data = await response.json();
    setBusStopData(data.bustime);
  } catch (err) {
    setError('Server error');
  }
};


  return (
    <>
      <h1>bussileidja</h1>
      <div className="search-container">
        <p>Otsige bussipeatusi all olevast kastist.</p>
        <form id="otsing" autoComplete="off" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              placeholder="Otsi peatusi..."
              value={query}
              onChange={handleChange}
            />
            {results.length > 0 && (
              <ul className="autocomplete-results">
                {results.map((stop, idx) => (
                  <li key={idx} onClick={() => handleSelect(stop)}>
                    {stop}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
        <button type="submit" form="otsing">
          Otsi
        </button>
        {busStopData && (
          <div className="busstop-result">
            <h2>Peatus: {busStopData.for}</h2>
            <pre>{JSON.stringify(busStopData, null, 2)}</pre>
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </div>
    </>
  );
}

export default App;
