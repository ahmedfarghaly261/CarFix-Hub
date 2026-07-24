import { useRef } from 'react';
import { Download, FileText, X } from 'lucide-react';

export default function ReportModal({ repair, onClose, isDarkMode }) {
  const reportRef = useRef(null);

  const handleDownload = () => {
    if (!reportRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Repair Report - ${repair.title}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 40px; color: #172033; font-family: "Segoe UI", Arial, sans-serif; }
            .report { max-width: 800px; margin: 0 auto; }
            .report-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2563eb; padding-bottom: 22px; margin-bottom: 30px; }
            .brand { color: #2563eb; font-size: 30px; font-weight: 800; letter-spacing: -1px; }
            .brand-subtitle, .meta { color: #64748b; font-size: 13px; }
            .title { text-align: right; font-size: 23px; font-weight: 700; color: #1e293b; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 18px; background: #f8fafc; border-radius: 10px; margin-bottom: 26px; }
            .label { color: #94a3b8; font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; }
            .value { color: #334155; font-size: 14px; font-weight: 600; margin-top: 3px; }
            h2 { font-size: 15px; color: #1e293b; margin: 0 0 10px; }
            .summary { white-space: pre-wrap; line-height: 1.7; color: #475569; border-left: 4px solid #2563eb; padding: 16px 18px; background: #f8fafc; margin-bottom: 28px; }
            table { width: 100%; border-collapse: collapse; }
            th { padding: 11px 12px; background: #eff6ff; color: #475569; font-size: 11px; text-align: left; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            th:nth-child(n+2), td:nth-child(n+2) { text-align: right; }
            .total { margin-top: 16px; text-align: right; font-size: 17px; font-weight: 700; }
            .footer { border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; margin-top: 42px; padding-top: 16px; text-align: center; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const items = (repair.iterations || []).flatMap((iteration, index) => {
    if (iteration.cost?.parts?.length) {
      return iteration.cost.parts.map((part) => ({
        name: part.name || iteration.description || `Repair item ${index + 1}`,
        quantity: Number(part.quantity || 1),
        cost: Number(part.price || 0)
      }));
    }
    return [{
      name: iteration.description || `Repair item ${index + 1}`,
      quantity: 1,
      cost: Number(iteration.cost?.total || 0)
    }];
  });
  const total = items.reduce((sum, item) => sum + item.quantity * item.cost, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className={`max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl shadow-2xl ${isDarkMode ? 'bg-[#1E2A38]' : 'bg-white'}`} onClick={(event) => event.stopPropagation()}>
        <div className={`sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 ${isDarkMode ? 'border-gray-700 bg-[#1E2A38]' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-500" size={20} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Repair Report</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Download size={16} /> Download / Print
            </button>
            <button onClick={onClose} className={`rounded-lg p-1 ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}><X size={20} /></button>
          </div>
        </div>

        <div className="p-6">
          <div ref={reportRef} className="report">
            <div className="report-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #2563eb', paddingBottom: '20px', marginBottom: '28px' }}>
              <div>
                <div className="brand" style={{ color: '#2563eb', fontSize: '28px', fontWeight: 800 }}>CarFix</div>
                <div className="brand-subtitle" style={{ color: '#64748b', fontSize: '13px' }}>Professional Auto Repair Services</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="title" style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>REPAIR REPORT</div>
                <div className="meta" style={{ color: '#64748b', fontSize: '12px' }}>#{repair._id?.slice(-8).toUpperCase()}</div>
              </div>
            </div>

            <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '18px', background: '#f8fafc', borderRadius: '10px', marginBottom: '26px' }}>
              {[
                ['Repair Request', repair.title],
                ['Vehicle', `${repair.carId?.year || ''} ${repair.carId?.make || ''} ${repair.carId?.model || ''}`.trim() || 'N/A'],
                ['Mechanic', repair.assignedTo?.name || 'N/A'],
                ['Completed', repair.actualCompletionDate ? new Date(repair.actualCompletionDate).toLocaleDateString() : 'N/A']
              ].map(([label, value]) => (
                <div key={label}><div className="label" style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div><div className="value" style={{ color: '#334155', fontSize: '14px', fontWeight: 600 }}>{value}</div></div>
              ))}
            </div>

            <h2 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '10px' }}>Mechanic Summary</h2>
            <div className="summary" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#475569', borderLeft: '4px solid #2563eb', padding: '16px 18px', background: '#f8fafc', marginBottom: '28px' }}>
              {repair.reportDetails || 'No repair summary was provided.'}
            </div>

            <h2 style={{ fontSize: '15px', color: '#1e293b', marginBottom: '10px' }}>Work Performed & Parts Installed</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th>Item</th><th>Qty</th><th>Cost</th><th>Total</th></tr></thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={`${item.name}-${index}`}>
                    <td>{item.name}</td><td>{item.quantity}</td><td>${item.cost.toFixed(2)}</td><td>${(item.quantity * item.cost).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total" style={{ marginTop: '16px', textAlign: 'right', fontSize: '17px', fontWeight: 700 }}>Repair total: ${total.toFixed(2)}</div>
            <div className="footer" style={{ borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px', marginTop: '42px', paddingTop: '16px', textAlign: 'center' }}>CarFix • Trusted automotive care</div>
          </div>
        </div>
      </div>
    </div>
  );
}
