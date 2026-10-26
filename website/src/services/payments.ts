import { mockFinanceSummary, mockTransactions } from '../data/finance';
import { FinanceSummary, Transaction } from '../types';
import { delay } from './apiHelper';

let workingSummary: FinanceSummary = { ...mockFinanceSummary };
let workingTransactions: Transaction[] = [...mockTransactions];

export const paymentService = {
  async getFinanceSummary(): Promise<FinanceSummary> {
    await delay(400);
    return {
      ...workingSummary,
      recentTransactions: [...workingTransactions],
    };
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(350);
    return [...workingTransactions];
  },

  async recordPayment(txn: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
    await delay(450);
    const newTxn: Transaction = {
      ...txn,
      id: `TXN-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
    };

    workingTransactions = [newTxn, ...workingTransactions];
    if (txn.type === 'customer_advance' || txn.type === 'customer_balance') {
      workingSummary.customerReceipts += txn.amount;
      workingSummary.totalRevenue += txn.amount;
    } else if (txn.type === 'vendor_payout') {
      workingSummary.vendorPayouts += txn.amount;
      workingSummary.totalExpenses += txn.amount;
    }

    return newTxn;
  },
};
