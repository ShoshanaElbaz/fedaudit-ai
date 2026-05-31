import StatusChip from '../shared/StatusChip';

const MetricCard = ({ label, value, sub, color }) => (
  <div className={`
    bg-slate-900 border rounded-2xl p-5 space-y-2
    ${color === 'red'    ? 'border-red-500/30'     : ''}
    ${color === 'green'  ? 'border-emerald-500/30' : ''}
    ${color === 'amber'  ? 'border-amber-500/30'   : ''}
    ${color === 'blue'   ? 'border-blue-500/30'    : ''}
    ${!color             ? 'border-slate-800'      : ''}
  `}>
    <p className="text-slate-500 text-xs font-medium">{label}</p>
    <p className={`
      text-2xl font-bold
      ${color === 'red'   ? 'text-red-400'     : ''}
      ${color === 'green' ? 'text-emerald-400' : ''}
      ${color === 'amber' ? 'text-amber-400'   : ''}
      ${color === 'blue'  ? 'text-blue-400'    : ''}
      ${!color            ? 'text-white'       : ''}
    `}>
      {value}
    </p>
    {sub && <p className="text-slate-600 text-xs">{sub}</p>}
  </div>
);

const InvoiceSummary = ({ invoice }) => {
  const { invoiceNumber, invoiceDate, direction, summary, shipments } = invoice;

  const {
    totalChargedUSD, totalExpectedUSD, diffUSD,
    totalChargedILS, totalExpectedILS, diffILS,
    status
  } = summary;

  // צבע הפרש
  const getDiffColor = (diff) => {
    if (diff === 0) return 'green';
    if (diff > 0) return 'red';   // חוייב יותר
    return 'amber';               // חוייב פחות
  };

  return (
    <div className="space-y-6">

      {/* כותרת חשבונית */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              חשבונית {invoiceNumber}
            </h2>
            <StatusChip status={status} size="md" />
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <span>📅 {invoiceDate}</span>
            <span>📦 {shipments.length} משלוחים</span>
            <span>{direction === 'export' ? '✈️ ייצוא' : '📥 ייבוא'}</span>
          </div>
        </div>
      </div>

      {/* שורת USD */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="סה״כ חויב USD"
          value={`$${totalChargedUSD.toFixed(2)}`}
          color="blue"
        />
        <MetricCard
          label="סה״כ צפוי USD"
          value={`$${totalExpectedUSD.toFixed(2)}`}
        />
        <MetricCard
          label="הפרש USD"
          value={`${diffUSD > 0 ? '+' : ''}$${diffUSD.toFixed(2)}`}
          sub={diffUSD > 0 ? 'חיוב יתר' : diffUSD < 0 ? 'חיוב חסר' : 'תקין'}
          color={getDiffColor(diffUSD)}
        />
      </div>

      {/* שורת ILS */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="סה״כ חויב ILS"
          value={`₪${totalChargedILS.toFixed(2)}`}
          color="blue"
        />
        <MetricCard
          label="סה״כ צפוי ILS"
          value={`₪${totalExpectedILS.toFixed(2)}`}
        />
        <MetricCard
          label="הפרש ILS"
          value={`${diffILS > 0 ? '+' : ''}₪${diffILS.toFixed(2)}`}
          sub={diffILS > 0 ? 'חיוב יתר' : diffILS < 0 ? 'חיוב חסר' : 'תקין'}
          color={getDiffColor(diffILS)}
        />
      </div>

    </div>
  );
};

export default InvoiceSummary;
