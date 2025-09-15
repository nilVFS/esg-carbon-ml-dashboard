import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { fuelCoefficients } from '../data/coefficients';

const PdfExporter = ({ fuelEntries, totalForecast, allDataPoints }) => {
  if (!allDataPoints || allDataPoints.length < 2) return null;

  const generatePdf = () => {
    let htmlContent = `
      <h2 style="text-align: center;">Отчёт по моделированию выбросов ПГ</h2>
    `;

    // Таблицы по каждому топливу
    fuelEntries.forEach(entry => {
      if (entry.dataPoints.length < 2) return;
      const coef = fuelCoefficients[entry.fuelType];
      const unit = coef?.unit || 'тыс. м³';

      htmlContent += `
        <h3 style="margin-top: 30px;">Источник: ${entry.fuelType} (${unit})</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Период №</th>
              <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Объём топлива (${unit})</th>
              <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Выбросы CO₂ (тонны)</th>
            </tr>
          </thead>
          <tbody>
            ${entry.dataPoints.map(p => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.month}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.volume}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.emissionCO2}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    });

    // Общий прогноз
    htmlContent += `
      <h3 style="margin-top: 40px;">Суммарный прогноз на 3 периода</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #e3f2fd;">Период</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #e3f2fd;">Прогноз CO₂ (тонны)</th>
          </tr>
        </thead>
        <tbody>
          ${totalForecast.months.map((m, i) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Период ${m}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${totalForecast.emissions[i].toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Итого выбросов по всем источникам:</h3>
      <p><strong>Суммарные выбросы за 6 месяцев:</strong> ${(allDataPoints.reduce((sum, p) => sum + parseFloat(p.emissionCO2), 0)).toFixed(2)} тонн CO₂</p>
      <p><strong>Прогноз на 3 месяца вперёд:</strong> ${totalForecast.emissions.reduce((sum, e) => sum + e, 0).toFixed(2)} тонн CO₂</p>

      <p style="font-size: 12px; margin-top: 30px; color: #666;">
        Расчёт выполнен в браузере. Все коэффициенты взяты из Приказа Минприроды РФ №371 (Таблица 1.1).
      </p>
    `;

    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.padding = '30px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontSize = '14px';

    document.body.appendChild(element);

    html2canvas(element)
      .then(canvas => {
        document.body.removeChild(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Прогноз_выбросов_ПГ_многотопливный.pdf');
      })
      .catch(error => {
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
        marginTop: '30px',
        display: 'block',
        width: '100%',
        maxWidth: '500px',
        margin: '20px auto',
      }}
    >
      Скачать PDF с прогнозом (все источники)
    </button>
  );
};

export default PdfExporter;
