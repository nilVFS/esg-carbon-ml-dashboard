import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExporter = ({ data }) => {
  const generatePdf = () => {

    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontSize = '16px';
    element.style.lineHeight = '1.5';
    element.innerHTML = `
      <h2 style="text-align: center; margin-bottom: 30px;">Отчёт о расчёте выбросов ПГ</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p><strong>Тип топлива:</strong> ${data.fuelType}</p>
        <p><strong>Объём топлива:</strong> ${data.fuelVolume} м³/т</p>
        <p><strong>Методика расчёта:</strong> ${
          data.method === 'кпу'
            ? 'По данным КПУ'
            : data.method === 'нормативы'
            ? 'По нормативам удельных выбросов'
            : 'По балансу топлива'
        }</p>
        <p><strong>Выбросы CO₂:</strong> ${data.CO2} тонн</p>
        <p><strong>Выбросы CH₄:</strong> ${data.CH4} тонн</p>
        <p><strong>Выбросы N₂O:</strong> ${data.N2O} тонн</p>
      </div>
      <p style="font-style: italic; font-size: 14px;">
        Расчёт выполнен в соответствии с Приказом Минприроды России №371 от 27.05.2022, Приложение №1.
      </p>
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

        pdf.save('Отчёт_по_выбросам_ПГ.pdf');
      })
      .catch((error) => {
        console.error('Ошибка при генерации PDF:', error);
        alert('Произошла ошибка при создании PDF. Откройте консоль (F12) для подробностей.');
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      });
  };

  return (
    <button
      className="btn btn-success"
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
      onMouseEnter={(e) => (e.target.style.background = '#218838')}
      onMouseLeave={(e) => (e.target.style.background = '#28a745')}
    >
      Скачать PDF-отчёт
    </button>
  );
};

export default PdfExporter;

