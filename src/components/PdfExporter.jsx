import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { linearRegression } from '../utils/regression';

const PdfExporter = ({ dataPoints }) => {
  if (!dataPoints || dataPoints.length < 2) return null;

  const x = dataPoints.map(p => p.month);
  const y = dataPoints.map(p => p.volume * 34.0 * 56.1 * 0.001);
  const model = linearRegression(x, y);

  const lastMonth = Math.max(...x);
  const forecastMonths = [lastMonth + 1, lastMonth + 2, lastMonth + 3];
  const forecastEmissions = forecastMonths.map(m => model.predict(m));

  const generatePdf = () => {
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.innerHTML = `
      <h2 style="text-align: center;">Отчёт по моделированию выбросов ПГ</h2>
      <h3>Исторические данные:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Месяц</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Объём (м³/т)</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Выбросы CO₂ (т)</th>
          </tr>
        </thead>
        <tbody>
          ${dataPoints
            .map(
              (p) =>
                `<tr>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.month}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.volume}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${(p.volume * 34.0 * 56.1 * 0.001).toFixed(2)}</td>
                </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <h3>Прогноз:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #e3f2fd;">Месяц</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #e3f2fd;">Прогноз CO₂ (т)</th>
          </tr>
        </thead>
        <tbody>
          ${forecastMonths
            .map(
              (m, i) =>
                `<tr>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${m}</td>
                  <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${forecastEmissions[i].toFixed(2)}</td>
                </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <p><strong>Модель:</strong> y = ${model.slope.toFixed(2)} * x + ${model.intercept.toFixed(2)}</p>
      <p style="font-style: italic;">Расчёт выполнен в браузере. Соответствует духу Приказа №371.</p>
    `;

    document.body.appendChild(element);

    html2canvas(element)
      .then((canvas) => {
        document.body.removeChild(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Прогноз_выбросов_ПГ.pdf');
      })
      .catch((error) => {
        console.error('Ошибка PDF:', error);
        alert('Ошибка генерации PDF');
      });
  };

  return (
    <button
      onClick={generatePdf}
      style={{
        padding: '12px 24px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
      }}
    >
      Скачать PDF с прогнозом
    </button>
  );
};

export default PdfExporter;

