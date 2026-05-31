import { useState } from 'react';
import StatusChip from '../shared/StatusChip';
import ValidationTable from './ValidationTable';

const ShipmentCard = ({ shipment, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { trackingNumber, service, destination, zone,
          actualWeight, chargeableWeight, packaging,
          validations, overallStatus } = shipment;


  // ספירת בעיות
  const issuesCount = Object.values(validations)
    .filter(v => v && v.status !== 'passed').length;

  return (
    <div className={`
      rounded-2xl border overflow-hidden transition-all duration-300
      ${overallStatus === 'passed'
        ? 'bg-slate-900 border-slate-800'
        : 'bg-slate-900 border-amber-500/30'
      }
    `}>

      {/* כותרת הכרטיסייה */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">

          {/* מידע משלוח */}
          <div className="space-y-3 flex-1">

            {/* שורה ראשונה — מספר + סטטוס */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-slate-500 text-xs font-mono">
                #{index + 1}
              </span>
              <span className="text-white font-mono text-sm font-semibold">
                {trackingNumber}
              </span>
              <StatusChip status={overallStatus} size="sm" />
              {issuesCount > 0 && (
                <span className="text-amber-400 text-xs">
                  {issuesCount} בעיות נמצאו
                </span>
              )}
            </div>

            {/* שורה שנייה — פרטים */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {[
                { label: 'יעד', value: destination },
                { label: 'שירות', value: service },
                { label: 'Zone', value: zone },
                { label: 'אריזה', value: packaging },
                { label: 'משקל פיזי', value: `${actualWeight} ק"ג` },
                { label: 'משקל לחיוב', value: `${chargeableWeight} ק"ג` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs">{label}:</span>
                  <span className="text-slate-300 text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* כפתור פירוט */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            mt-4 w-full py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200 border
            ${isExpanded
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }
          `}
        >
          {isExpanded ? '▲ הסתר פירוט' : '▼ הצג פירוט בדיקות'}
        </button>
      </div>

      {/* טבלת בדיקות — מתרחב */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-800 pt-4">
          <ValidationTable validations={validations} />
        </div>
      )}

    </div>
  );
};

export default ShipmentCard;