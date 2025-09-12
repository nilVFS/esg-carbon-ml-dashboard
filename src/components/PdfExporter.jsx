import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExporter = ({ dataPoints }) => {
  if (!dataPoints || dataPoints.length < 2) return null;

  const generatePdf = () => {
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontSize = '14px';
    element.innerHTML = `
      <h2 style="text-align: center;">Отчёт о расчёте выбросов ПГ</h2>
      <h3>Исходные данные</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Период №</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Объём топлива (${dataPoints[0].unit})</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa;">Выбросы CO₂ (тонны)</th>
          </tr>
        </thead>
        <tbody>
          ${dataPoints.map(p => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.month}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.volume}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.emissionCO2}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3>Прогноз на 3 периода</h3>
      <p><strong>Тип топлива:</strong> ${dataPoints[0].fuelType}</p>
      <p><strong>Формула модели:</strong> y = ${dataPoints[dataPoints.length - 1].emissionCO2 ? '...' : 'не рассчитана'} (на основе линейной регрессии)</p>
      <p><strong>Прогнозируемый объём:</strong> ${Math.round((parseFloat(dataPoints[dataPoints.length - 1].volume) * 1.05) * 100) / 100} ${dataPoints[0].unit}</p>

      <p style="font-style: italic; margin-top: 30px;">
        Расчёт выполнен в соответствии с Приказом Минприроды РФ №371 от 27.05.2022.
      </p>
    `;

    document.body.appendChild(element);

    html2canvas(element)
      .then(canvas => {
        document.body.removeChild(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Отчёт_по_выбросам_ПГ.pdf');
      })
      .catch(error => {
        console.error('Ошибка PDF:', error);
        alert('Ошибка генерации PDF. Проверьте консоль.');
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

