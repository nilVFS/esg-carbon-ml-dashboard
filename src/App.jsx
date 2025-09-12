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
          <div style={{ margin: '30px 0' }}>
            <h3>Прогноз на основе модели</h3>
            <p><em>Модель построена на линейной регрессии по введённым данным.</em></p>
          </div>

          <ChartComponent dataPoints={dataPoints} />
          <PdfExporter dataPoints={dataPoints} />
        </>
      )}

      {!dataPoints && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          Введите данные и нажмите "Построить модель", чтобы увидеть прогноз.
        </div>
      )}
    </div>
  );
}

export default App;

