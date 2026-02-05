const { Payment } = require('../models');
const { createPaymentSession } = require('../services/paymentGateway');

const getStatement = async (req, res) => {
  const payments = await Payment.findAll({ where: { userId: req.user.id } });
  const totalPaid = payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + Number(payment.amount), 0);
  return res.json({ balanceDue: 5000 - totalPaid, payments });
};

const initiatePayment = async (req, res) => {
  const { amount } = req.body;
  const session = await createPaymentSession({ amount, currency: 'USD' });
  const payment = await Payment.create({ userId: req.user.id, amount, status: 'pending', reference: session.reference });
  return res.json({ session, payment });
};

const paymentWebhook = async (req, res) => {
  const { reference, status } = req.body;
  const payment = await Payment.findOne({ where: { reference } });
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  payment.status = status;
  await payment.save();
  return res.json({ message: 'Payment updated' });
};

module.exports = { getStatement, initiatePayment, paymentWebhook };
