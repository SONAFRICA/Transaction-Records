// transaction_canister.ts

import { Principal, Context, HttpAgent, Actor, Service } from 'azle';

type Transaction = {
  timestamp: string;
  amount: number;
  description: string;
};

class TransactionCanister extends Actor {
  private transactions: Transaction[] = [];

  @query
  getTransactionHistory(): Transaction[] {
    return this.transactions;
  }

  @update
  recordTransaction(amount: number, description: string): void {
    this.validateAmount(amount);
    this.validateDescription(description);

    const timestamp = new Date().toISOString();
    const transaction: Transaction = { timestamp, amount, description };
    this.transactions.push(transaction);
  }

  private validateAmount(amount: number): void {
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount. Amount must be a positive number.');
    }
  }

  private validateDescription(description: string): void {
    if (!description.trim()) {
      throw new Error('Description cannot be empty.');
    }
  }
}

// Example of deploying and using the canister
const agent = new HttpAgent();
const context = Context.create({ agent });
const transactionCanister = Service.createActor(TransactionCanister, context);

// Record a transaction
transactionCanister.recordTransaction(100, 'Grocery shopping');

// Retrieve the transaction history
const history = transactionCanister.getTransactionHistory();
console.log(history);
