import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadInvoiceAPI } from '../services/api';

// העלאת חשבונית לשרת
export const uploadInvoice = createAsyncThunk(
  'invoice/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('invoice', file);
      const data = await uploadInvoiceAPI(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'שגיאה בהעלאת החשבונית');
    }
  }
);

const initialState = {
  // החשבונית הנוכחית שהועלתה
  currentInvoice: null,
  // סטטוס הטעינה
  status: 'idle', // idle | loading | succeeded | failed
  // הודעת שגיאה
  error: null,
};

// Slice

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,

  reducers: {
    // איפוס state — לחזור לדף העלאה
    resetInvoice: (state) => {
      state.currentInvoice = null;
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // טעינה התחילה
      .addCase(uploadInvoice.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.currentInvoice = null;
      })
      // טעינה הצליחה
      .addCase(uploadInvoice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentInvoice = action.payload.data;
      })
      // טעינה נכשלה
      .addCase(uploadInvoice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'שגיאה לא ידועה';
      });
  },
});

export const { resetInvoice } = invoiceSlice.actions;

//סלקטור
export const selectInvoice = (state) => state.invoice.currentInvoice;
export const selectStatus  = (state) => state.invoice.status;
export const selectError   = (state) => state.invoice.error;

export default invoiceSlice.reducer;