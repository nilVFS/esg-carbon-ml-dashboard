import React, { useState } from 'react';
import DataInputTable from './components/DataInputTable';
import ChartComponent from './components/ChartComponent';
import PdfExporter from './components/PdfExporter';
import './styles/main.css';

function App() {
  const [dataPoints, setDataPoints] = useState(null);

  return (
    <div className="container">
      <h1>ML-дашборд прогнозирования выбросов ПГ</h1>
      <DataInputTable onDataSubmit={setDataPoints} />
      {dataPoints && dataPoints.length >= 2 && (
        <>
          <ChartComponent dataPoints={dataPoints} />
          <PdfExporter dataPoints={dataPoints} />
        </>
      )}
    </div>
  );
}

export default App;

