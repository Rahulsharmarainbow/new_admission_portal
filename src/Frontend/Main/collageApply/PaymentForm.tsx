import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
export default function PaymentForm() {
  const [loading, setLoading] = useState(false);

  // src/services/payment.ts
async function startPayment(payload: { amount: string, customerEmailID: string, customerMobileNo?: string }) {
  const resp = await fetch(`${apiUrl}api/payment/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return resp.json();
}

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        amount: '300.00',
        customerEmailID: 'dummy@gmail.com',
        customerMobileNo: '9090909090',
        // addlParam1: 'Test1' // optional
      };

      const res = await startPayment(payload);

      if (res.success && res.paymentUrl) {
        // Option A: Redirect in same window
        window.location.href = res.paymentUrl;

        // Option B: Open in new tab
        // window.open(res.paymentUrl, '_blank');
      } else {
        alert('Payment initiation failed: ' + (res.message || JSON.stringify(res.rawResponse)));
      }
    } catch (err) {
      console.error(err);
      alert('Payment initiation error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePay}>
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
