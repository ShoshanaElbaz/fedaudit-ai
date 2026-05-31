import StatusChip from '../shared/StatusChip';

const VALIDATION_LABELS = {
  zone:             { label: 'בדיקה 1 — Zone',           icon: '🗺️' },
  chargeableWeight: { label: 'בדיקה 2 — משקל לחיוב',     icon: '⚖️' },
  baseRate:         { label: 'בדיקה 3 — תעריף בסיס',     icon: '💲' },
  ahsWeight:        { label: 'בדיקה 4 — AHS Weight',     icon: '📦' },
  dangerousGoods:   { label: 'בדיקה 5 — חומרים מסוכנים', icon: '☣️' },
};

const ValidationTable = ({ validations }) => {
  return (
    <div className="space-y-2">
      {Object.entries(VALIDATION_LABELS).map(([key, { label, icon }]) => {
        const validation = validations[key];
        if (!validation) return null;

        const isPassed = validation.status === 'passed';

        return (
          <div
            key={key}
            className={`
              rounded-xl p-4 border transition-all
              ${isPassed
                ? 'bg-slate-900/50 border-slate-800'
                : 'bg-slate-900 border-slate-700'
              }
            `}
          >
            <div className="flex items-center justify-between gap-4">

              {/* שם הבדיקה */}
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-slate-300 text-sm font-medium">
                  {label}
                </span>
              </div>

              {/* סטטוס */}
              <StatusChip status={validation.status} size="sm" />
            </div>

            {/* הודעה — רק אם יש הפרש/שגיאה */}
            {!isPassed && validation.message && (
              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <p className="text-amber-300/80 text-xs leading-relaxed">
                  {validation.message}
                </p>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default ValidationTable;
