import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Results.css";

interface Stop {
  stop_name: string;
  platform: number | null;
  arrives: string;
  leaves: string;
  stop_order: number;
}

interface RouteResult {
  route_id: number;
  bus: {
    bus_id?: number;
    line_nr?: string;
    name?: string;
  };
  route_name: string;
  direction: string;
  departure_time: string;
  arrival_time: string;
  stops: Stop[];
}

function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results, stopFrom, stopTo } = (location.state as { results: RouteResult[], stopFrom: string, stopTo: string }) || { results: [], stopFrom: '', stopTo: '' };
  const [expandedRoutes, setExpandedRoutes] = useState<Set<number>>(new Set());

  const toggleStops = (routeId: number) => {
    setExpandedRoutes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(routeId)) {
        newSet.delete(routeId);
      } else {
        newSet.add(routeId);
      }
      return newSet;
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!results || results.length === 0) {
    return (
      <>
        <button className="styledbutton" onClick={handleBack}>
          ← Tagasi
        </button>
        <h1>Otsingu tulemused</h1>
        <div className="maincontainer">
          <div className="results-container">
            <p>Tulemusi ei leitud. {stopFrom && stopTo && `Marsruuti peatusest "${stopFrom}" peatusesse "${stopTo}" ei eksisteeri.`}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <button className="styledbutton" onClick={handleBack}>
        Tagasi
      </button>
      <h1>Otsingu tulemused</h1>
      <h3>{stopFrom} → {stopTo}</h3>
      <div className="maincontainer">
        <div className="results-container">
          {results.map((result) => (
            <div key={result.route_id}>
              <div className="results-item">
                <div id="stop-info">
                  <h2>{result.departure_time} - {result.arrival_time}</h2>
                  <h3>{result.bus.name || 'N/A'} - Liin {result.bus.line_nr || 'N/A'}</h3>
                  <p>
                    {result.direction === 'tagasi'
                      ? result.route_name.split(' - ').reverse().join(' - ')
                      : result.route_name}
                  </p>
                </div>
                <div id="stop-actions">
                  <button 
                    className="styledbutton"
                    onClick={() => toggleStops(result.route_id)}
                  >
                    {expandedRoutes.has(result.route_id) ? 'Peida peatused' : 'Peatused'}
                  </button>
                </div>
              </div>
              {expandedRoutes.has(result.route_id) && (
                <div className="stops">
                  <table>
                    <thead>
                      <tr>
                        <th>Peatus</th>
                        <th>Platvorm</th>
                        <th>Saabub</th>
                        <th>Väljub</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.stops.map((stop, idx) => (
                        <tr key={idx}>
                          <td>{stop.stop_name}</td>
                          <td>{stop.platform || '-'}</td>
                          <td>{stop.arrives}</td>
                          <td>{stop.leaves}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Results;
