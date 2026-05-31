import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uploadInvoice } from '../../store/invoiceSlice';

const UploadPage = () => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  }, []);

  // בדיקת קובץ
  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('יש להעלות קובץ PDF בלבד');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('הקובץ גדול מדי — מקסימום 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    dispatch(uploadInvoice(selectedFile));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-2xl space-y-8">

        {/* כותרת */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium">
            <span>✦</span>
            <span>FedAudit AI</span>
          </div>
          <h1 className="text-4xl font-bold text-white">
            בדיקת חשבוניות FedEx
          </h1>
          <p className="text-slate-400 text-lg">
            העלה חשבונית PDF לבדיקה מקיפה
          </p>
        </div>

        {/* אזור גרירה */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300
            ${isDragging
              ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
              : selectedFile
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800'
            }
          `}
        >
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => validateAndSetFile(e.target.files[0])}
          />

          {selectedFile ? (
            // קובץ נבחר
            <div className="space-y-3">
              <div className="text-5xl">📄</div>
              <p className="text-emerald-400 font-semibold text-lg">
                {selectedFile.name}
              </p>
              <p className="text-slate-500 text-sm">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="text-slate-500 hover:text-red-400 text-sm transition-colors"
              >
                הסר קובץ ✕
              </button>
            </div>
          ) : (
            // ממתין לקובץ
            <div className="space-y-4">
              <div className="text-6xl">
                {isDragging ? '📂' : '📁'}
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold text-xl">
                  {isDragging ? 'שחרר כאן!' : 'גרור חשבונית PDF לכאן'}
                </p>
                <p className="text-slate-500">
                  או לחץ לבחירת קובץ
                </p>
              </div>
              <p className="text-slate-600 text-sm">
                PDF בלבד • עד 10MB
              </p>
            </div>
          )}
        </div>

        {/* שגיאה */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* כפתור העלאה */}
        <div className="flex justify-center">
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`
            px-12 py-3.5 rounded-2xl font-bold text-lg transition-all duration-300
            ${selectedFile
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }
          `}
        >
          {selectedFile ? '🔍 התחל בדיקה' : 'בחר קובץ להתחלה'}
        </button>
        </div>

        {/* מידע תחתית */}
        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { icon: '🤖', label: 'עיבוד חכם', desc: 'חילוץ נתונים אוטומטי מ-PDF' },
            { icon: '⚡', label: 'מהיר', desc: 'תוצאות בשניות' },
            { icon: '🔒', label: '5 בדיקות', desc: 'Zone, משקל, תעריף ועוד' },
          ].map((item, i) => (
            <div key={i} className="text-center space-y-1.5">
              <div className="text-3xl">{item.icon}</div>
              <div className="text-white font-semibold text-sm">{item.label}</div>
              <div className="text-slate-500 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UploadPage;
