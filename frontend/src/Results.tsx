import "./Results.css";

function Results() {
  return (
    <>
      <h1>otsingu tulemused</h1>
      <div className="maincontainer">
        <div className="results-container">
          <div className="results-item">
            <div id="stop-info">
              <h2>13:50 - 14:06</h2>
              <h3>Antsu Buss AS</h3>
            </div>
            <div id="stop-actions">
              <button className="styledbutton">Peatused</button>
            </div>
          </div>
        </div>
        <div className="stops">
          <table>
            <tr>
              <th>Peatus</th>
              <th>Saabub</th>
              <th>Väljub</th>
            </tr>
            <tr>
              <td>Komando</td>
              <td>13:51</td>
              <td>13:52</td>
            </tr>
            <tr>
              <td>Kuku</td>
              <td>13:56</td>
              <td>13:57</td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
}

export default Results;
