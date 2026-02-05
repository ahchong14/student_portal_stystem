const { v4: uuidv4 } = require('uuid');

const createPaymentSession = async ({ amount, currency }) => {
  return {
    reference: uuidv4(),
    checkoutUrl: `https://mock-gateway.example/checkout/${uuidv4()}`,
    amount,
    currency
  };
};

module.exports = { createPaymentSession };
