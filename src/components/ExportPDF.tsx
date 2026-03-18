import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const ExportPDF: React.FC = () => {
  const handleExport = async () => {
    const element = document.body; // Capture the whole page
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'pt', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('portfolio.pdf');
  };

  return (
    <button
      onClick={handleExport}
      className="absolute top-4 left-4 z-20 bg-primary/20 hover:bg-primary/30 text-white px-4 py-2 rounded-lg border border-primary/40 backdrop-blur-sm glow-pulse"
    >
      Export PDF
    </button>
  );
};
