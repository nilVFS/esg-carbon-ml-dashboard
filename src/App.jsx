import React, { useState } from 'react';
import Calculator from './components/Calculator';
import ChartComponent from './components/ChartComponent';
import PdfExporter from './components/PdfExporter';
import forecastData from './data/forecast.json' with { type: 'json' };

function App() {
  const [calculation, setCalculation] = useState(null);

  return (
    <div className="container">
      <h1>Дашборд расчёта выбросов ПГ</h1>
      <Calculator onCalculate={setCalculation} />
      {calculation && (
        <>
          <div className="card">
            <h3>Результаты расчёта</h3>
            <p><strong>CO₂:</strong> {calculation.CO2} тонн</p>
            <p><strong>CH₄:</strong> {calculation.CH4} тонн</p>
            <p><strong>N₂O:</strong> {calculation.N2O} тонн</p>
          </div>
          <div className="graph-container">
            <ChartComponent data={calculation} forecast={forecastData} />
          </div>
          <PdfExporter data={calculation} />
        </>
      )}
    </div>
  );
}

export default App;

