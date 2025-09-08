import React, { useState } from 'react';
import coefficients from '../data/coefficients';

const Calculator = ({ onCalculate }) => {
  const [fuelType, setFuelType] = useState("природный газ");
  const [fuelVolume, setFuelVolume] = useState(10000);
  const [method, setMethod] = useState("баланс");

  const calculateEmission = () => {
    const coef = coefficients[fuelType];
    const emissionCO2 = fuelVolume * coef.LHV * coef.CO2 * 0.001;
    const emissionCH4 = fuelVolume * coef.LHV * coef.CH4 * 0.001;
    const emissionN2O = fuelVolume * coef.LHV * coef.N2O * 0.001;

    onCalculate({
      CO2: emissionCO2.toFixed(2),
      CH4: emissionCH4.toFixed(4),
      N2O: emissionN2O.toFixed(4),
      fuelType,
      fuelVolume,
      method
    });
  };

  return (
    <div className="p-4 border rounded">
      <h3>Расчёт выбросов ПГ (Приказ №371)</h3>
      <div className="mb-3">
        <label>Тип топлива:</label>
        <select className="form-control" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
          {Object.keys(coefficients).map(type => <option key={type}>{type}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label>Объём топлива (м³/т):</label>
        <input type="number" className="form-control" value={fuelVolume} onChange={(e) => setFuelVolume(e.target.value)} />
      </div>
      <div className="mb-3">
        <label>Методика расчёта:</label>
        <select className="form-control" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="кпу">По данным КПУ</option>
          <option value="нормативы">По нормативам</option>
          <option value="баланс">По балансу топлива</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={calculateEmission}>Рассчитать</button>
    </div>
  );
};

export default Calculator;

