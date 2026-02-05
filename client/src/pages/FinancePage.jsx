import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const FinancePage = () => {
  const { t } = useTranslation();
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(500);

  const loadFinance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/finance');
      setFinance(response.data);
    } catch (error) {
      console.error('Error loading finance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const handlePayment = async () => {
    try {
      await api.post('/finance/pay', { amount: paymentAmount });
      setShowPaymentModal(false);
      loadFinance();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">🔄 Loading financial information...</p>
      </div>
    );
  }

  if (!finance) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Financial Account 💰</h1>
        <p className="text-amber-100">Manage your student account and make payments</p>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <p className="text-gray-600 text-sm font-semibold mb-2">Current Balance</p>
          <p className={`text-4xl font-bold mb-4 ${finance.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            ${finance.balance.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {finance.balance > 0 ? '⚠️ Amount Due' : '✓ Account Paid'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <p className="text-gray-600 text-sm font-semibold mb-4">Recent Activity</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Charges</p>
              <p className="text-2xl font-bold text-gray-800">
                ${finance.transactions.filter((t) => t.type === 'charge').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Credits</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${finance.transactions.filter((t) => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
          <p className="text-blue-100 text-sm font-semibold mb-4">Make a Payment</p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105"
          >
            Pay Now 💳
          </button>
          <p className="text-xs text-blue-100 mt-4">Secure payment processing</p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Make a Payment</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-800">$</span>
                  <input
                    type="number"
                    min="1"
                    max={finance.balance}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Max: ${finance.balance.toFixed(2)}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Remaining Balance:</span> ${(finance.balance - paymentAmount).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
        <div className="space-y-3">
          {finance.transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    transaction.type === 'charge'
                      ? 'bg-red-100'
                      : transaction.type === 'credit'
                      ? 'bg-emerald-100'
                      : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'charge' ? '💸' : transaction.type === 'credit' ? '✓' : '🔄'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.type === 'charge'
                      ? 'text-red-600'
                      : 'text-emerald-600'
                  }`}>
                    {transaction.type === 'charge' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                    transaction.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : transaction.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Info */}
      {finance.balance > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6">
          <h3 className="font-bold text-red-900 mb-2">⚠️ Payment Due</h3>
          <p className="text-red-800 text-sm">
            You have an outstanding balance of <strong>${finance.balance.toFixed(2)}</strong>. 
            Please make a payment as soon as possible to avoid late fees.
          </p>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
