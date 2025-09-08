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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data, forecast }) => {
  if (!data) return null;

  const month7 = forecast?.month7 || 0;
  const month8 = forecast?.month8 || 0;
  const month9 = forecast?.month9 || 0;

  const chartData = {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл (прогноз)', 'Авг (прогноз)', 'Сен (прогноз)'],
    datasets: [
      {
        label: 'Выбросы CO₂ (тонны)',
        data: [
          19074, 20027, 20981, 21935, 22889, 23843,
          month7,
          month8,
          month9
        ],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        text: 'Динамика выбросов CO₂ (факт + прогноз)',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Период' },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'Тонны CO₂' },
        beginAtZero: false,
        grid: { color: '#e0e0e0' },
      },
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;


