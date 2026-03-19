import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// We extract brand logo from local source or base64. 
// For this application, we will use a generic header if an image path is not reachable.

function fallbackFormatDate(dateStr: string | Date | undefined) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return String(dateStr);
  }
}

export interface InvoiceData {
  id?: string;
  invoiceNumber: string;
  issueDate: string | Date;
  status: "PAID" | "PENDING" | "OVERDUE" | "PARTIAL" | string;
  paymentMethod?: string;
  transactionRef?: string;
  remarks?: string;
  
  // Organization Info
  institute: {
    name: string;
    address: string;
    logo?: string | null;
  };
  
  // Student Info (Can be generic for Templates)
  student: {
    name: string;
    enrollmentId: string;
    course: string;
    session: string;
    contact: string;
  };
  
  metadata?: any;
  
  // Pricing/Fee details
  payment: {
    baseFee: number;
    gstPercent: number;
    gstAmount: number;
    discountAmount: number;
    grandTotal: number;
  };
  
  // Custom Line items (if applicable)
  items?: { description: string; amount: number }[];
}

async function loadImage(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function generateInvoicePdf(data: InvoiceData) {
  const doc = new jsPDF();
  
  // Color Palette
  const PRIMARY_COLOR: [number, number, number] = [15, 23, 42]; // Slate-900
  const ACCENT_COLOR: [number, number, number] = [79, 70, 229]; // Indigo-600
  const TEXT_COLOR: [number, number, number] = [31, 41, 55]; // Gray-800
  const TEXT_LIGHT: [number, number, number] = [107, 114, 128]; // Gray-500
  
  // --- HEADER SECTION ---
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 50, "F");

  // Load and Add Logo
  const logoUrl = data.institute.logo || "/assets/images/brandlogo.png";
  const logoBase64 = await loadImage(logoUrl);
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 10, 30, 30, undefined, 'FAST');
    } catch (e) {
      console.error("Failed to add logo to PDF:", e);
    }
  }

  // Institute Name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(data.institute.name || "Adhyayan", logoBase64 ? 50 : 14, 25);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(data.institute.address || "Education Hub, MG Road, Mumbai", logoBase64 ? 50 : 14, 32);

  // Invoice Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 196, 25, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.status}`, 196, 35, { align: "right" });

  // --- INFO SECTION ---
  let cursorY = 65;
  doc.setTextColor(...TEXT_COLOR);

  // Left: Bill To
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...TEXT_LIGHT);
  doc.text("BILLED TO", 14, cursorY);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...TEXT_COLOR);
  doc.text(data.student.name || "Student Name", 14, cursorY + 7);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_LIGHT);
  doc.text(`ID: ${data.student.enrollmentId || "N/A"}`, 14, cursorY + 13);
  doc.text(`Course: ${data.student.course || "N/A"}`, 14, cursorY + 18);
  doc.text(`Session: ${data.student.session || "N/A"}`, 14, cursorY + 23);

  // Right: Invoice Details
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...TEXT_LIGHT);
  doc.text("INVOICE DETAILS", 130, cursorY);

  doc.setFontSize(10);
  doc.setTextColor(...TEXT_COLOR);
  doc.text("Invoice #:", 130, cursorY + 7);
  doc.text("Date:", 130, cursorY + 13);
  doc.text("Mode:", 130, cursorY + 19);
  doc.text("Txn Ref:", 130, cursorY + 25);

  doc.setFont("helvetica", "bold");
  doc.text(data.invoiceNumber || "INV-XXXX", 165, cursorY + 7);
  doc.text(fallbackFormatDate(data.issueDate), 165, cursorY + 13);
  doc.text((data.paymentMethod || "Cash").toUpperCase(), 165, cursorY + 19);
  doc.text(data.transactionRef || "N/A", 165, cursorY + 25);

  // --- LINE ITEMS ---
  cursorY += 40;
  
  const tableCols = ["Description", "Amount (INR)"];
  const tableRows: any[][] = [];

  if (data.items && data.items.length > 0) {
    data.items.forEach(item => {
      tableRows.push([item.description, `Rs. ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`]);
    });
  } else {
    tableRows.push(["Course Base Fee", `Rs. ${data.payment.baseFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}`]);
    if (data.payment.gstAmount > 0) {
      tableRows.push([`GST (${data.payment.gstPercent}%)`, `Rs. ${data.payment.gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`]);
    }
  }

  autoTable(doc, {
    startY: cursorY,
    head: [tableCols],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: PRIMARY_COLOR, textColor: 255, fontStyle: "bold" },
    styles: { font: "helvetica", fontSize: 9, cellPadding: 5 },
    columnStyles: {
      1: { halign: 'right', fontStyle: 'bold' }
    }
  });

  // --- TOTALS ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setTextColor(...TEXT_COLOR);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  
  const rightColX = 140;
  
  if (data.payment.discountAmount > 0) {
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_LIGHT);
    doc.text("Discount:", rightColX, finalY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Emerald-600
    doc.text(`- Rs. ${data.payment.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 196, finalY, { align: "right" });
    doc.setFont("helvetica", "bold");
  }

  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY_COLOR);
  doc.text("Grand Total:", rightColX, finalY + 12);
  doc.setTextColor(...ACCENT_COLOR);
  doc.text(`Rs. ${data.payment.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 196, finalY + 12, { align: "right" });

  // --- FOOTER ---
  doc.setTextColor(...TEXT_LIGHT);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  
  if (data.remarks) {
    doc.text("REMARKS", 14, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const splitRemarks = doc.splitTextToSize(data.remarks, 100);
    doc.text(splitRemarks, 14, finalY + 15);
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 200, 200);
  doc.text("Thank you for your business.", 105, 275, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("This is a computer generated invoice and requires no physical signature.", 105, 280, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...ACCENT_COLOR);
  doc.text("www.adhyayan.edu", 105, 285, { align: "center" });

  // Save the PDF
  const filename = `Invoice_${data.invoiceNumber || 'Template'}.pdf`;
  doc.save(filename);
}
