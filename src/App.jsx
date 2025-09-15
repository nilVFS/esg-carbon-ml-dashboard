import React, { useState } from 'react';
import DataInputTable from './components/DataInputTable';
import ChartComponent from './components/ChartComponent';
import PdfExporter from './components/PdfExporter';
import './styles/main.css';
import { linearRegression } from './utils/regression';
import { calculateCO2Emission } from './utils/calculation';
import { fuelCoefficients } from './data/coefficients';

function App() {
  const [fuelEntries, setFuelEntries] = useState([
    {
      id: 1,
      fuelType: "природный газ",
      dataPoints: [
        { month: 1, volume: 10000 },
        { month: 2, volume: 10500 },
        { month: 3, volume: 11000 },
        { month: 4, volume: 11500 },
        { month: 5, volume: 12000 },
        { month: 6, volume: 12500 },
      ],
    },
  ]);

  // Добавить новый источник топлива
  const addFuelEntry = () => {
    const newId = Math.max(...fuelEntries.map(f => f.id), 0) + 1;
    setFuelEntries([
      ...fuelEntries,
      {
        id: newId,
        fuelType: "природный газ",
        dataPoints: [
          { month: 1, volume: 10000 },
          { month: 2, volume: 10500 },
          { month: 3, volume: 11000 },
          { month: 4, volume: 11500 },
          { month: 5, volume: 12000 },
          { month: 6, volume: 12500 },
        ],
      },
    ]);
  };

  // Удалить источник топлива
  const removeFuelEntry = (id) => {
    if (fuelEntries.length <= 1) {
      alert('Нужно как минимум один источник топлива!');
      return;
    }
    setFuelEntries(fuelEntries.filter(f => f.id !== id));
  };

  // Обновить данные для конкретного топлива
  const updateFuelData = (id, updatedDataPoints) => {
    setFuelEntries(
      fuelEntries.map(f =>
        f.id === id ? { ...f, dataPoints: updatedDataPoints } : f
      )
    );
  };

  const allDataPoints = fuelEntries.flatMap(f => 
    f.dataPoints.map(point => ({
      ...point,
      fuelType: f.fuelType,
      unit: fuelCoefficients[f.fuelType]?.unit || 'тыс. м³',
      emissionCO2: calculateCO2Emission(point.volume, f.fuelType),
    }))
  );

  // Собираем прогнозы по каждому топливу
  const forecastByFuel = fuelEntries.map(f => {
    if (f.dataPoints.length < 2) return null;
    const x = f.dataPoints.map(p => p.month);
    const y = f.dataPoints.map(p => calculateCO2Emission(p.volume, f.fuelType));
    const model = linearRegression(x, y);
    const lastMonth = Math.max(...x);
    const forecastMonths = [lastMonth + 1, lastMonth + 2, lastMonth + 3];
    const forecastEmissions = forecastMonths.map(m => model.predict(m));
    return {
      fuelType: f.fuelType,
      months: forecastMonths,
      emissions: forecastEmissions,
      model: { slope: model.slope, intercept: model.intercept }
    };
  }).filter(Boolean);
  
  // Общий прогноз
  const totalForecast = {
    months: [7, 8, 9],
    emissions: [0, 0, 0]
  };
  forecastByFuel.forEach(f => {
    f.emissions.forEach((emission, i) => {
      totalForecast.emissions[i] += emission;
    });
  });

  return (
    <div className="container">
      <h1>ML-дашборд прогнозирования выбросов ПГ</h1>
      
      {/* Кнопка добавления нового источника */}
      <button
        onClick={addFuelEntry}
        style={{
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '30px',
          display: 'block',
        }}
      >
        Добавить другой вид топлива
      </button>

      {/* Цикл по всем источникам топлива */}
      {fuelEntries.map(entry => (
        <div key={entry.id} style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Источник #{entry.id}: {entry.fuelType}</h3>
            <button
              onClick={() => removeFuelEntry(entry.id)}
              style={{
                padding: '6px 12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Удалить
            </button>
          </div>
          
          <DataInputTable
            onDataSubmit={(dataPoints) => updateFuelData(entry.id, dataPoints)}
            initialFuelType={entry.fuelType}
          />
          
          {entry.dataPoints.length >= 2 && (
            <div style={{ marginTop: '20px' }}>
              <ChartComponent
                dataPoints={entry.dataPoints}
                fuelType={entry.fuelType}
                showTitle={false}
              />
            </div>
          )}
        </div>
      ))}

      {/* ОБЩИЙ ГРАФИК ПО ВСЕМ ТОПЛИВАМ */}
      {allDataPoints.length >= 2 && (
        <>
          <div style={{ margin: '40px 0', padding: '20px', background: '#e3f2fd', borderRadius: '8px' }}>
            <h2>Суммарный прогноз по всем источникам топлива</h2>
            <p><em>Общие выбросы CO₂ по всем видам топлива, рассчитанные по Приказу №371</em></p>
            <ChartComponent
              dataPoints={allDataPoints}
              isTotal={true}
              forecast={totalForecast}
            />
          </div>

          <PdfExporter
            fuelEntries={fuelEntries}
            totalForecast={totalForecast}
            allDataPoints={allDataPoints}
          />
        </>
      )}

      {!allDataPoints.length && (
        <div style={{ padding: '30px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          Добавьте хотя бы один источник топлива, чтобы начать расчет.
        </div>
      )}
    </div>
  );
}

export default App;

