import React, { useState } from 'react';
import { calculateCO2Emission } from '../utils/calculation';

const DataInputTable = ({ onDataSubmit }) => {
  const [volumes, setVolumes] = useState([10000, 10500, 11000, 11500, 12000, 12500]);

  const updateVolume = (index, value) => {
    const newVolumes = [...volumes];
    newVolumes[index] = parseFloat(value);
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
    const dataPoints = volumes.map((volume, index) => ({
      month: index + 1,
      volume: volume,
      emission: calculateCO2Emission(volume)
    }));
    onDataSubmit(dataPoints);
  };

  return (
    <div className="card">
      <h3>Введите объёмы топлива по периодам</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Период №</th>
            <th style={tableHeaderStyle}>Объём топлива (м³/т)</th>
            <th style={tableHeaderStyle}>Выбросы CO₂ (тонны)</th>
          </tr>
        </thead>
        <tbody>
          {volumes.map((volume, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>
                {index + 1}
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => updateVolume(index, e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={{ ...tableCellStyle, background: '#f8f9fa' }}>
                {calculateCO2Emission(volume).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} style={buttonStyle}>
        + Добавить период
      </button>
      <button onClick={handleSubmit} style={{ ...buttonStyle, background: '#007bff', marginLeft: '10px' }}>
        📈 Построить модель
      </button>
    </div>
  );
};

const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'center',
  background: '#f8f9fa',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'center',
};

const inputStyle = {
  width: '100%',
  padding: '6px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  padding: '8px 16px',
  background: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default DataInputTable;
