const BASE_URL = 'http://localhost:5000/api';
// העלאת חשבונית PDF
export const uploadInvoiceAPI = async (formData) => {
  const response = await fetch(`${BASE_URL}/invoices/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'שגיאה בהעלאת החשבונית');
  }

  return response.json();
};


