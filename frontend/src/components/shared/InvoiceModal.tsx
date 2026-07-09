import React, { useRef } from 'react';
import { X, Download, FileText } from 'lucide-react';

export default function InvoiceModal({ repair, onClose, isDarkMode }) {
  const invoiceRef = useRef(null);

  const handleExportPDF = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${repair.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; padding: 40px; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
            .logo-section h1 { font-size: 28px; color: #2563eb; font-weight: 700; }
            .logo-section p { color: #6b7280; font-size: 14px; margin-top: 4px; }
            .invoice-meta { text-align: right; }
            .invoice-meta h2 { font-size: 24px; color: #374151; margin-bottom: 8px; }
            .invoice-meta p { font-size: 13px; color: #6b7280; line-height: 1.6; }
            .parties { display: flex; justify-content: space-between; margin-bottom: 32px; }
            .party { flex: 1; }
            .party h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 8px; font-weight: 600; }
            .party p { font-size: 14px; color: #374151; line-height: 1.6; }
            .party p.name { font-weight: 600; font-size: 15px; color: #111827; }
            .details-section { margin-bottom: 32px; }
            .details-section h3 { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .detail-item label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; display: block; margin-bottom: 2px; }
            .detail-item span { font-size: 14px; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            thead th { background: #f3f4f6; padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600; }
            tbody td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
            .totals { display: flex; justify-content: flex-end; margin-bottom: 32px; }
            .totals-box { width: 280px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #374151; }
            .totals-row.total { border-top: 2px solid #2563eb; padding-top: 12px; margin-top: 4px; font-size: 18px; font-weight: 700; color: #111827; }
            .footer { text-align: center; margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
            .footer p { font-size: 13px; color: #9ca3af; line-height: 1.6; }
            .report-section { margin-bottom: 32px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #2563eb; }
            .report-section h3 { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
            .report-section p { font-size: 14px; color: #4b5563; white-space: pre-wrap; line-height: 1.6; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #dcfce7; color: #166534; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const parts = [];
  if (repair.iterations) {
    repair.iterations.forEach((iter) => {
      if (iter.cost?.parts) {
        iter.cost.parts.forEach((part) => {
          parts.push({ name: part.name, qty: part.quantity || 1, price: part.price || 0 });
        });
      }
    });
  }

  const laborCost = repair.iterations?.reduce((sum, iter) => sum + (iter.cost?.labor || 0), 0) || 0;
  const partsCost = parts.reduce((sum, p) => sum + (p.price * p.qty), 0);
  const totalCost = repair.totalCost || (partsCost + laborCost);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'bg-[#1E2A38] border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <FileText className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Invoice</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content (printable) */}
        <div ref={invoiceRef} className="p-6">
          <div className="invoice-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '16px', borderBottom: '3px solid #2563eb' }}>
              <div>
                <h1 style={{ fontSize: '24px', color: '#2563eb', fontWeight: 700 }}>CarFix</h1>
                <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Auto Repair Services</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '20px', color: '#374151', marginBottom: '6px' }}>INVOICE</h2>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>#{repair._id?.slice(-8).toUpperCase()}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  Date: {repair.actualCompletionDate ? new Date(repair.actualCompletionDate).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Parties */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginBottom: '6px', fontWeight: 600 }}>Workshop</h3>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{repair.workshopId?.name || 'CarFix Workshop'}</p>
                {repair.workshopId?.address && <p style={{ fontSize: '13px', color: '#374151' }}>{repair.workshopId.address}</p>}
                {repair.workshopId?.phone && <p style={{ fontSize: '13px', color: '#374151' }}>{repair.workshopId.phone}</p>}
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginBottom: '6px', fontWeight: 600 }}>Mechanic</h3>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{repair.assignedTo?.name || 'N/A'}</p>
              </div>
            </div>

            {/* Vehicle & Service Info */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #e5e7eb' }}>Service Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>Vehicle</label>
                  <span style={{ fontSize: '14px', color: '#374151' }}>{repair.carId?.year} {repair.carId?.make} {repair.carId?.model}</span>
                </div>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>Plate</label>
                  <span style={{ fontSize: '14px', color: '#374151' }}>{repair.carId?.plate || 'N/A'}</span>
                </div>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>Service</label>
                  <span style={{ fontSize: '14px', color: '#374151' }}>{repair.serviceType || repair.title}</span>
                </div>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', display: 'block', marginBottom: '2px' }}>Status</label>
                  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: '#dcfce7', color: '#166534' }}>
                    {repair.status?.charAt(0).toUpperCase() + repair.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mechanic Report */}
            {repair.reportDetails && (
              <div style={{ marginBottom: '28px', padding: '14px', background: '#f9fafb', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Mechanic Report</h3>
                <p style={{ fontSize: '13px', color: '#4b5563', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{repair.reportDetails}</p>
              </div>
            )}

            {/* Cost Breakdown Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th style={{ background: '#f3f4f6', padding: '10px 14px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600 }}>Item</th>
                  <th style={{ background: '#f3f4f6', padding: '10px 14px', textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600 }}>Qty</th>
                  <th style={{ background: '#f3f4f6', padding: '10px 14px', textAlign: 'right', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600 }}>Price</th>
                  <th style={{ background: '#f3f4f6', padding: '10px 14px', textAlign: 'right', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {parts.length > 0 ? (
                  parts.map((part, i) => (
                    <tr key={i}>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151' }}>{part.name}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'center' }}>{part.qty}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'right' }}>${part.price.toFixed(2)}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'right' }}>${(part.price * part.qty).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151' }}>Repair Service - {repair.title}</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'center' }}>1</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'right' }}>${totalCost.toFixed(2)}</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'right' }}>${totalCost.toFixed(2)}</td>
                  </tr>
                )}
                {laborCost > 0 && (
                  <tr>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151' }}>Labor</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'center' }}>-</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'right' }}>${laborCost.toFixed(2)}</td>
                    <td style={{ padding: '10px 14px', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151', textAlign: 'right' }}>${laborCost.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
              <div style={{ width: '260px' }}>
                {parts.length > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#374151' }}>
                      <span>Parts Subtotal</span>
                      <span>${partsCost.toFixed(2)}</span>
                    </div>
                    {laborCost > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: '#374151' }}>
                        <span>Labor</span>
                        <span>${laborCost.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: '4px', borderTop: '2px solid #2563eb', fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  <span>Total</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>Thank you for choosing CarFix!</p>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>This invoice was generated automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
