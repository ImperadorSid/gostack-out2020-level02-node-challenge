import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += transaction.value;
          accumulator.total += transaction.value;
        } else {
          accumulator.outcome += transaction.value;
          accumulator.total -= transaction.value;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    if (type === 'outcome' && this.getBalance().total - value < 0) {
      throw Error('There is no enough balance');
    }

    const newTransaction = new Transaction({ title, value, type });

    this.transactions.push(newTransaction);

    return newTransaction;
  }
}

export default TransactionsRepository;
