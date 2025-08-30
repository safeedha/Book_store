import instance from './instance';

export const getWalletinformation = async (setWallet) => {
  try {
    const response = await instance.get(`user/wallet`);
    console.log(response.data);
    setWallet(response.data.wallet[0].wallet_item);
    console.log(response.data.wallet[0].wallet_item);
  } catch (error) {
    console.log(error);
  }
};

const moneyAdd = async (amount) => {
  try {
    const response = await instance.post(`user/wallet/add`, { amount: amount });
  } catch (error) {
    console.log(error);
  }
};

export const addMoneyWallet = async (Razorpay, amount, setAdd) => {
  try {
    const RAZORPAY_KEY_ID = 'rzp_test_RmHsQLbeIzESnC';
    const response = await fetch('http://localhost:8000/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount * 100 }),
    });
    const order = await response.json();
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Book Loom',
      description: 'Payment for your order',
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyResponse = await fetch(
            'http://localhost:8000/verify-payment',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verifyResult = await verifyResponse.json();
          console.log('Verify Response Status:', verifyResponse.status);
          console.log('Verify Response Body:', verifyResult);

          if (verifyResult.message === 'Payment verified successfully') {
            await moneyAdd(amount);
            setAdd(false);
          } else {
            alert('Payment verification failed.');
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          alert('Payment verification failed: ' + err.message);
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };
    const rzpay = new Razorpay(options);
    rzpay.on('payment.failed', async (response) => {
      try {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    });

    rzpay.open();
  } catch (err) {
    console.error('Error creating order:', err);
    alert('Error creating order: ' + err.message);
  }
};
