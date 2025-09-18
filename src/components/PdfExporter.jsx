import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExporter = ({ fuelEntries, totalForecast, allDataPoints }) => {
  if (!allDataPoints || allDataPoints.length < 2) return null;

  const generatePdf = async () => {
    let htmlContent = `
      <h2 style="text-align: center; color: #1a3a6d;">Отчёт по моделированию выбросов ПГ</h2>
      <hr style="margin: 20px 0; border: 1px solid #ddd;">
    `;

    // Таблицы по каждому топливу
    htmlContent += `
      <h3 style="margin-top: 30px;">1. Источники выбросов и исходные данные</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Источник</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Тип топлива</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Периоды</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Объём (ед.)</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Выбросы CO₂ (т)</th>
          </tr>
        </thead>
        <tbody>
    `;

    fuelEntries.forEach((entry, idx) => {
      const totalEmission = entry.dataPoints.reduce((sum, p) => sum + parseFloat(p.emissionCO2), 0).toFixed(2);
      
      htmlContent += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${idx + 1}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${entry.fuelType}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${entry.dataPoints.length}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${entry.dataPoints.map(p => p.volume).join(', ')}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${totalEmission}</td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
    `;

    // Суммарный прогноз (в виде текста)
    htmlContent += `
      <h3 style="margin-top: 40px;">2. Прогноз выбросов CO₂ (суммарный по всем источникам)</h3>
      <table style="width: 50%; margin: 15px auto; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background: #e3f2fd;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Период</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Прогноз CO₂ (тонны)</th>
          </tr>
        </thead>
        <tbody>
    `;

    totalForecast.months.forEach((month, i) => {
      htmlContent += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Период ${month}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${totalForecast.emissions[i].toFixed(2)}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
    `;

    // Итоговая сводка
    const totalCurrentEmissions = allDataPoints.reduce((sum, p) => sum + parseFloat(p.emissionCO2), 0).toFixed(2);
    const totalForecastSum = totalForecast.emissions.reduce((sum, e) => sum + e, 0).toFixed(2);

    htmlContent += `
      <h3 style="margin-top: 40px;">3. Сводка и выводы</h3>
      <table style="width: 80%; margin: 20px auto; border-collapse: collapse; font-size: 15px;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px; width: 40%;"><strong>Суммарные выбросы за исторические периоды</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${totalCurrentEmissions} тонн CO₂</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>Прогноз на следующие 3 периода</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${totalForecastSum} тонн CO₂</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 10px;"><strong>Суммарный рост выбросов (прогноз/факт)</strong></td>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${((totalForecastSum / totalCurrentEmissions) * 100 - 100).toFixed(1)}%</td>
        </tr>
      </table>

      <h3 style="margin-top: 40px;">4. Методология</h3>
      <ul style="font-size: 14px; line-height: 1.5; margin-left: 20px; margin-bottom: 30px;">
        <li>Использованы коэффициенты NCV и EF_CO2 из Таблицы 1.1 Приказа №371.</li>
        <li>Расчёт выбросов: E = V × NCV × 0.001 × EF_CO2 (перевод в ТДж → тонны CO₂).</li>
        <li>Прогноз построен методом линейной регрессии на основе введённых данных.</li>
        <li>Представлены данные по всем выбранным видам топлива.</li>
      </ul>

      <p style="font-size: 12px; color: #666; text-align: center; margin-top: 50px;">
        Этот отчёт сгенерирован автоматически в браузере. Не является официальным документом.
      </p>
    `;

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = htmlContent;
    contentDiv.style.padding = '40px';
    contentDiv.style.fontFamily = 'Arial, sans-serif';
    contentDiv.style.fontSize = '14px';
    contentDiv.style.color = '#333';
    contentDiv.style.backgroundColor = 'white';

    document.body.appendChild(contentDiv);

    // Захват графика как изображения
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
      const canvas = await html2canvas(chartContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: chartContainer.offsetWidth,
        height: chartContainer.offsetHeight,
      });
      const chartImgData = canvas.toDataURL('image/png');

      // весь контент (текст + таблицы)
      const fullCanvas = await html2canvas(contentDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      const fullImgData = fullCanvas.toDataURL('image/png');

      document.body.removeChild(contentDiv);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(fullImgData, 'PNG', 0, 0, pageWidth, pageHeight);

      pdf.addPage();
      const imgWidth = pageWidth * 0.9;
      const imgHeight = (imgWidth / chartContainer.offsetWidth) * chartContainer.offsetHeight * 2; // учитываем масштаб 2
      pdf.addImage(chartImgData, 'PNG', (pageWidth - imgWidth) / 2, 20, imgWidth, imgHeight);

      pdf.save('Отчёт_выбросов_ПГ_многотопливный.pdf');
    } else {
      alert('График не найден. Пожалуйста, перезагрузите страницу и попробуйте снова.');
    }
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
