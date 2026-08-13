import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, MaterialSpool } from '../types';

export interface ReportData {
  generatedAt: string;
  totalRevenue: number;
  totalOrders: number;
  activeJobs: number;
  orders: Order[];
  spools: MaterialSpool[];
}

export function generateExecutiveReportPDF(data: ReportData) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner Background
  doc.setFillColor(26, 28, 28); // #1a1c1c Dark neutral
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Accent Line
  doc.setFillColor(175, 16, 26); // #af101a Chili Red
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CABAI ENTERPRISE™', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(220, 220, 220);
  doc.text('EXECUTIVE MANAGEMENT & OPERATIONAL REPORT', 14, 25);

  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  const formattedDate = new Date(data.generatedAt).toLocaleString('en-MY', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });
  doc.text(`Generated: ${formattedDate}`, 14, 32);

  // Executive KPI Summary Section
  doc.setTextColor(26, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Key Performance Indicators (KPIs)', 14, 50);

  // KPI Boxes
  const startY = 55;
  const cardWidth = 42;
  const cardHeight = 20;

  const kpis = [
    { label: 'TOTAL REVENUE', value: `RM ${data.totalRevenue.toFixed(2)}`, color: [239, 246, 255], border: [191, 219, 254] },
    { label: 'TOTAL ORDERS', value: `${data.totalOrders}`, color: [240, 253, 244], border: [187, 247, 208] },
    { label: 'ACTIVE JOBS', value: `${data.activeJobs} Printing`, color: [254, 243, 199], border: [253, 230, 138] },
    { label: 'FILAMENT SPOOLS', value: `${data.spools.length} Spools`, color: [243, 244, 246], border: [229, 231, 235] }
  ];

  kpis.forEach((kpi, idx) => {
    const x = 14 + idx * (cardWidth + 4);
    // Box fill
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, 'FD');

    // Box text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(kpi.label, x + 4, startY + 6);

    doc.setFontSize(11);
    doc.setTextColor(26, 28, 28);
    doc.text(kpi.value, x + 4, startY + 14);
  });

  // Orders Table Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 28, 28);
  doc.text('2. Customer Orders Queue', 14, 85);

  const orderRows = data.orders.map(o => [
    o.id,
    new Date(o.date).toLocaleDateString('en-MY'),
    o.customer.fullName,
    o.customer.phone || o.customer.email,
    `${o.items.length} item(s)`,
    `RM ${o.total.toFixed(2)}`,
    o.status
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['Order ID', 'Date', 'Customer', 'Contact', 'Items', 'Total Amount', 'Status']],
    body: orderRows,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 28, 28],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 24 },
      5: { fontStyle: 'bold', halign: 'right' },
      6: { fontStyle: 'bold' }
    }
  });

  // Filament Inventory Section
  const finalOrdersY = (doc as any).lastAutoTable?.finalY || 150;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 28, 28);
  doc.text('3. Filament Spool Inventory Status', 14, finalOrdersY + 12);

  const spoolRows = data.spools.map(s => [
    s.name,
    s.material,
    s.colorName,
    `${s.stockKg.toFixed(1)} kg / ${s.maxCapacityKg.toFixed(1)} kg`,
    s.isLow ? 'LOW STOCK ALERT' : 'HEALTHY'
  ]);

  autoTable(doc, {
    startY: finalOrdersY + 16,
    head: [['Spool Name', 'Material', 'Color', 'Remaining Stock', 'Inventory Status']],
    body: spoolRows,
    theme: 'grid',
    headStyles: {
      fillColor: [175, 16, 26], // Chili Red
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    alternateRowStyles: {
      fillColor: [254, 242, 242]
    },
    columnStyles: {
      4: { fontStyle: 'bold' }
    }
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);

    doc.line(14, 282, pageWidth - 14, 282);
    doc.text('CABAI ENTERPRISE™ — 3D Printing & Custom Fabrication Studio, Kuala Lumpur, Malaysia', 14, 287);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, 287, { align: 'right' });
  }

  // Save PDF
  doc.save(`Cabai_Enterprise_Executive_Report_${Date.now()}.pdf`);
}

export function generateOrderInvoicePDF(order: Order) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(26, 28, 28);
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setFillColor(175, 16, 26);
  doc.rect(0, 34, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CABAI ENTERPRISE™', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text('Official Order Invoice & Production Receipt', 14, 23);

  // Order ID Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(order.id, pageWidth - 14, 18, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text(`Date: ${new Date(order.date).toLocaleDateString('en-MY', { dateStyle: 'medium' })}`, pageWidth - 14, 25, { align: 'right' });

  // Customer Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 44, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setTextColor(26, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CUSTOMER & DELIVERY DETAILS:', 18, 51);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Name: ${order.customer.fullName}`, 18, 57);
  doc.text(`Contact: ${order.customer.phone} | ${order.customer.email}`, 18, 63);
  doc.text(`Address: ${order.customer.address}, ${order.customer.postcode} ${order.customer.city}, ${order.customer.state}`, 18, 69);

  // Items Table
  const itemRows = order.items.map(item => [
    item.name,
    item.color || '-',
    item.material || 'PLA+',
    item.customDetails ? `Custom: ${item.customDetails}` : 'Standard',
    `${item.quantity}`,
    `RM ${item.price.toFixed(2)}`,
    `RM ${(item.quantity * item.price).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Item Name', 'Color', 'Material', 'Specification', 'Qty', 'Unit Price', 'Subtotal']],
    body: itemRows,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 28, 28],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    columnStyles: {
      4: { halign: 'center' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' }
    }
  });

  const finalItemsY = (doc as any).lastAutoTable?.finalY || 130;

  // Calculation Summary Box
  const summaryX = pageWidth - 80;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);

  doc.text('Subtotal:', summaryX, finalItemsY + 10);
  doc.text(`RM ${order.subtotal.toFixed(2)}`, pageWidth - 14, finalItemsY + 10, { align: 'right' });

  doc.text('Shipping Fee:', summaryX, finalItemsY + 15);
  doc.text(`RM ${order.shipping.toFixed(2)}`, pageWidth - 14, finalItemsY + 15, { align: 'right' });

  if (order.discount > 0) {
    doc.text('Discount:', summaryX, finalItemsY + 20);
    doc.text(`- RM ${order.discount.toFixed(2)}`, pageWidth - 14, finalItemsY + 20, { align: 'right' });
  }

  doc.line(summaryX, finalItemsY + 24, pageWidth - 14, finalItemsY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(175, 16, 26);
  doc.text('TOTAL AMOUNT:', summaryX, finalItemsY + 31);
  doc.text(`RM ${order.total.toFixed(2)}`, pageWidth - 14, finalItemsY + 31, { align: 'right' });

  // Status & Tracking Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.roundedRect(14, finalItemsY + 10, summaryX - 22, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(153, 27, 27);
  doc.text(`ORDER STATUS: ${order.status.toUpperCase()}`, 18, finalItemsY + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(127, 29, 29);
  doc.text(`Tracking Number: ${order.trackingNumber || 'MY-CBI-PENDING'}`, 18, finalItemsY + 23);
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 18, finalItemsY + 29);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.line(14, 282, pageWidth - 14, 282);
  doc.text('Thank you for supporting local 3D print makers! CABAI ENTERPRISE™ Malaysia', 14, 287);

  doc.save(`Invoice_${order.id}.pdf`);
}
