import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExporter = ({ data }) => {
  const generatePdf = () => {
    const input = document.createElement('div');
    input.innerHTML = `
      <h2>Отчёт о расчёте выбросов ПГ</h2>
      <p><strong>Тип топлива:</strong> ${data.fuelType}</p>
      <p><strong>Объём топлива:</strong> ${data.fuelVolume} м³/т</p>
      <p><strong>Методика расчёта:</strong> ${data.method === 'кпу' ? 'По данным КПУ' : data.method === 'нормативы' ? 'По нормативам удельных выбросов' : 'По балансу топлива'}</p>
      <p><strong>Выбросы CO₂:</strong> ${data.CO2} тонн</p>
      <p><strong>Выбросы CH₄:</strong> ${data.CH4} тонн</p>
      <p><strong>Выбросы N₂O:</strong> ${data.N2O} тонн</p>
      <p><em>Расчёт выполнен в соответствии с Приказом Минприроды России №371 от 27.05.2022, Приложение №1.</em></p>
    `;

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("Отчёт_по_выбросам_ПГ.pdf");
    });
  };

  return (
    <button className="btn btn-success" onClick={generatePdf}>
      Скачать PDF-отчёт
    </button>
  );
};

export default PdfExporter;

