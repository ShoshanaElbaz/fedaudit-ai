import { useSelector, useDispatch } from 'react-redux';
import { selectStatus, selectInvoice, selectError, resetInvoice } from './store/invoiceSlice';
import UploadPage from './components/UploadPage/UploadPage';
import ResultsPage from './components/ResultsPage/ResultsPage';
import LoadingState from './components/shared/LoadingState';

const App = () => {
  const dispatch = useDispatch();
  const status  = useSelector(selectStatus);
  const invoice = useSelector(selectInvoice);
  const error   = useSelector(selectError);

  // טעינה
  if (status === 'loading') {
    return <LoadingState />;
  }

  // שגיאה
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6" dir="rtl">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">❌</div>
          <h2 className="text-2xl font-bold text-white">שגיאה בעיבוד החשבונית</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => dispatch(resetInvoice())}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  // תוצאות
  if (status === 'succeeded' && invoice) {
    return <ResultsPage />;
  }

  // דף העלאה
  return <UploadPage />;
};

export default App;
