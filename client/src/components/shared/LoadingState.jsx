const LoadingState = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-6">

        {/* אנימציית טעינה */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-indigo-400 animate-spin" 
               style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>

        {/* טקסט */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            מעבד חשבונית...
          </h2>
          <p className="text-slate-400 text-sm">
            מנתח את החשבונית ומריץ בדיקות
          </p>
        </div>

        {/* שלבים */}
        <div className="space-y-2 text-right max-w-xs mx-auto">
          {[
            'מחלץ נתונים מה-PDF...',
            'מאמת תעריפים...',
            'שומר תוצאות...',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 justify-end">
              <span className="text-slate-500 text-xs">{step}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"
                   style={{ animationDelay: `${i * 0.3}s` }} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LoadingState;