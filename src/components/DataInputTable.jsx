import React, { useState } from 'react';

const DataInputTable = ({ onDataSubmit }) => {
  const [rows, setRows] = useState([
    { month: 1, volume: 10000 },
    { month: 2, volume: 10500 },
    { month: 3, volume: 11000 },
    { month: 4, volume: 11500 },
    { month: 5, volume: 12000 },
    { month: 6, volume: 12500 },
  ]);

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value) || 0;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { month: rows.length + 1, volume: 0 }]);
  };

  const handleSubmit = () => {
    onDataSubmit(rows);
  };

  return (
    <div className="card">
      <h3>Введите исторические данные</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Месяц</th>
            <th style={tableHeaderStyle}>Объём топлива (м³/т)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={row.month}
                  onChange={(e) => updateRow(index, 'month', e.target.value)}
                  style={inputStyle}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={row.volume}
                  onChange={(e) => updateRow(index, 'volume', e.target.value)}
                  style={inputStyle}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} style={buttonStyle}>
        + Добавить строку
      </button>
      <button onClick={handleSubmit} style={{ ...buttonStyle, background: '#007bff', marginLeft: '10px' }}>
        Построить модель
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
};

export default DataInputTable;
