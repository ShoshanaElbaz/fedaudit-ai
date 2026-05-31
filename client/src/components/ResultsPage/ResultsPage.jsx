import { useDispatch, useSelector } from 'react-redux';
import { resetInvoice, selectInvoice } from '../../store/invoiceSlice';
import InvoiceSummary from './InvoiceSummary';
import ShipmentCard from './ShipmentCard';

const ResultsPage = () => {
  const dispatch = useDispatch();
  const invoice = useSelector(selectInvoice);
   console.log('invoice:', invoice);
  console.log('shipments:', invoice?.shipments);

  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* כפתור חזרה */}
        <button
          onClick={() => dispatch(resetInvoice())}
          className="flex items-center gap-2 text-slate-400 hover:text-white
                     transition-colors text-sm group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">→</span>
          <span>העלה חשבונית חדשה</span>
        </button>

        {/* סיכום חשבונית */}
        <InvoiceSummary invoice={invoice} />

        {/* כותרת משלוחים */}
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white">פירוט משלוחים</h3>
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-slate-500 text-sm">
            {invoice.shipments.length} משלוחים
          </span>
        </div>

        {/* כרטיסיות משלוחים */}
        <div className="space-y-4">
          {invoice.shipments.map((shipment, index) => (
            <ShipmentCard
              key={shipment.trackingNumber || index}
              shipment={shipment}
              index={index}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-slate-700 text-xs py-4">
          FedAudit AI • בדיקת חשבוניות FedEx אוטומטית
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;