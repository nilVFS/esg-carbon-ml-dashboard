import React, { useState } from 'react';
import { fuelCoefficients, fuelTypes } from '../data/coefficients';

const DataInputTable = ({ onDataSubmit }) => {
  const [fuelType, setFuelType] = useState("природный газ");
  const [volumes, setVolumes] = useState([10000, 10500, 11000, 11500, 12000, 12500]);

  const updateVolume = (index, value) => {
    const newVolumes = [...volumes];
    newVolumes[index] = parseFloat(value) || 0;
    setVolumes(newVolumes);
  };

  const addRow = () => {
    setVolumes([...volumes, 0]);
  };

  const handleSubmit = () => {
    if (volumes.length < 2) {
      alert('Нужно минимум 2 точки данных!');
      return;
    }

    const coef = fuelCoefficients[fuelType];
    const unit = coef.unit;

    const dataPoints = volumes.map((volume, index) => {
      const energy_TJ = volume * coef.NCV * 0.001;
      const emissionCO2 = energy_TJ * coef.EF_CO2;
      return {
        month: index + 1,
        volume: volume,
        unit: unit,
        emissionCO2: emissionCO2.toFixed(2),
        fuelType: fuelType
      };
    });

    onDataSubmit(dataPoints);
  };

  return (
    <div className="card">
      <h3>Введите объёмы топлива по периодам</h3>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
          Тип топлива:
        </label>
        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          {fuelTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Период №</th>
            <th style={tableHeaderStyle}>
              Объём топлива ({fuelCoefficients[fuelType]?.unit})
            </th>
            <th style={tableHeaderStyle}>Выбросы CO₂ (тонны)</th>
          </tr>
        </thead>
        <tbody>
          {volumes.map((volume, index) => {
            const coef = fuelCoefficients[fuelType];
            const energy_TJ = volume * coef.NCV * 0.001;
            const emissionCO2 = (energy_TJ * coef.EF_CO2).toFixed(2);

            return (
              <tr key={index}>
                <td style={tableCellStyle}>{index + 1}</td>
                <td style={tableCellStyle}>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => updateVolume(index, e.target.value)}
                    style={inputStyle}
                    min="0"
                    step="0.1"
                  />
                </td>
                <td style={{ ...tableCellStyle, background: '#f0f7ff', fontWeight: '500' }}>
                  {emissionCO2}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        onClick={addRow}
        style={{
          padding: '8px 16px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          marginRight: '10px',
        }}
      >
        Добавить период
      </button>

      <button
        onClick={handleSubmit}
        style={{
          padding: '8px 16px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Построить модель
      </button>
    </div>
  );
};

const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'center',
  background: '#f8f9fa',
  fontWeight: 'bold',
  fontSize: '14px',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'center',
  fontSize: '14px',
};

const inputStyle = {
  width: '100%',
  padding: '6px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
};

export default DataInputTable;
