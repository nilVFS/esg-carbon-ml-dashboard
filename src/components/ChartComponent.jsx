import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { linearRegression } from '../utils/regression';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ dataPoints, isTotal = false, forecast }) => {
  if (!dataPoints || dataPoints.length < 2) return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Нет данных для построения графика</div>;

  const x = dataPoints.map(p => p.month);
  const y = dataPoints.map(p => parseFloat(p.emissionCO2));

  const model = linearRegression(x, y);

  const lastMonth = Math.max(...x);
  const forecastMonths = [lastMonth + 1, lastMonth + 2, lastMonth + 3];
  const forecastEmissions = forecast
    ? forecast.emissions
    : forecastMonths.map(m => model.predict(m));

  const labels = [
    ...x.map(m => `Период ${m}`),
    ...forecastMonths.map(m => `Период ${m} (прогноз)`),
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: isTotal 
          ? 'Суммарные выбросы CO₂ (все источники)' 
          : `Выбросы CO₂ (${dataPoints[0].fuelType})`,
        data: [...y, ...forecastEmissions],
        borderColor: isTotal ? 'rgb(153, 102, 255)' : 'rgb(75, 192, 192)',
        backgroundColor: isTotal ? 'rgba(153, 102, 255, 0.5)' : 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        pointRadius: isTotal ? 6 : 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: isTotal 
          ? 'Суммарная динамика выбросов CO₂ по всем источникам топлива' 
          : `Динамика выбросов CO₂ — ${dataPoints[0].fuelType}`,
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Период' },
      },
      y: {
        title: { display: true, text: 'Тонны CO₂' },
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '20px', overflow: 'hidden' }}>
      <div id="chart-container" style={{ height: '100%', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
      <div style={{ marginTop: '20px', padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}>
        <strong>Модель:</strong> y = {model.slope.toFixed(2)} * x + {model.intercept.toFixed(2)}
      </div>
    </div>
  );
};

export default ChartComponent;

