'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export function CheckoutForm({ clientSecret, bookingId }: { clientSecret: string, bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // ※ 本来は /booking/complete/{id} 等の完了画面へリダイレクトします
        return_url: `${window.location.origin}/booking/${bookingId}?success=true`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'Payment failed');
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full bg-[#0a0a0a] hover:opacity-85 text-white font-bold py-4 rounded-sm transition-opacity duration-200 mt-4 disabled:opacity-50"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner">処理中...</div> : "決済を確定する"}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-500 text-sm mt-4 text-center">{message}</div>}
    </form>
  );
}
