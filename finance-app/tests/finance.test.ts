import { calculateCashFlow, calculateDebtStrategy, Debt, IncomeSource, PaymentScheduleItem } from '../src/lib/finance';

describe('Finance Utils', () => {
  it('calculateCashFlow should project balance correctly', () => {
    const incomes: IncomeSource[] = [{
      id: '1',
      amount: 1000,
      recurrence: 'mensual',
      next_deposit_date: new Date()
    }];
    const payments: PaymentScheduleItem[] = [{
      id: '1',
      amount_due: 500,
      due_date: new Date()
    }];
    const result = calculateCashFlow(0, incomes, payments, 1);
    expect(result[0].projectedBalance).toBe(500);
  });

  it('calculateDebtStrategy should prioritize debts by interest rate', () => {
    const debts: Debt[] = [
      { id: '1', creditor: 'A', total_balance: 1000, current_balance: 1000, annual_interest_rate: 10, minimum_payment: 100 },
      { id: '2', creditor: 'B', total_balance: 1000, current_balance: 1000, annual_interest_rate: 20, minimum_payment: 100 }
    ];
    const result = calculateDebtStrategy(debts, 100, 'avalanche');
    expect(result[0].creditor).toBe('B');
  });
});
