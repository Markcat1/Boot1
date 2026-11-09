export type Debt = {
  id: string;
  creditor: string;
  total_balance: number;
  current_balance: number;
  annual_interest_rate: number;
  minimum_payment: number;
};

export type IncomeSource = {
  id: string;
  amount: number;
  recurrence: 'quincenal' | 'mensual' | 'semanal';
  next_deposit_date: Date;
};

export type PaymentScheduleItem = {
  id: string;
  amount_due: number;
  due_date: Date;
};

export type CashFlowProjection = {
  date: Date;
  projectedBalance: number;
  isRed: boolean;
};

export type DebtStrategyRecommendation = {
  debtId: string;
  creditor: string;
  recommendedExtraPayment: number;
  strategy: 'snowball' | 'avalanche';
  estimatedMonthsToPayoff: number;
  totalInterestSaved: number;
};

/**
 * Motor de Calendario y Flujo de Efectivo
 * Proyecta quincenal/mensualmente y compara ingresos contra compromisos
 * para advertir sobre riesgo de liquidez (números rojos antes del siguiente ingreso).
 */
export function calculateCashFlow(
  initialBalance: number,
  incomes: IncomeSource[],
  payments: PaymentScheduleItem[],
  daysToProject: number = 30
): CashFlowProjection[] {
  let currentBalance = initialBalance;
  const projections: CashFlowProjection[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysToProject; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    // Check for incomes on this date
    const dailyIncomes = incomes.filter(income => {
      // Simplified check: assume next_deposit_date matches exact dates for projection purposes
      // In a real scenario, we'd calculate future recurrences properly.
      const incomeDate = new Date(income.next_deposit_date);
      incomeDate.setHours(0,0,0,0);
      return incomeDate.getTime() === currentDate.getTime();
    });

    const dailyIncomesTotal = dailyIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    currentBalance += dailyIncomesTotal;

    // Check for payments on this date
    const dailyPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.due_date);
      paymentDate.setHours(0,0,0,0);
      return paymentDate.getTime() === currentDate.getTime();
    });

    const dailyPaymentsTotal = dailyPayments.reduce((sum, pay) => sum + pay.amount_due, 0);
    currentBalance -= dailyPaymentsTotal;

    projections.push({
      date: currentDate,
      projectedBalance: currentBalance,
      isRed: currentBalance < 0
    });
  }

  return projections;
}

/**
 * Estrategia de Deuda (Bola de Nieve vs. Avalancha)
 * Analiza deudas activas y calcula orden de amortización.
 * Avalancha: Prioriza tasa de interés más alta (ahorra más dinero).
 * Bola de Nieve: Prioriza balance más bajo (victorias rápidas).
 */
export function calculateDebtStrategy(
  debts: Debt[],
  extraMonthlyPayment: number,
  strategyType: 'avalanche' | 'snowball' = 'avalanche'
): DebtStrategyRecommendation[] {
  if (debts.length === 0) return [];

  // Sort debts based on strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategyType === 'avalanche') {
      return b.annual_interest_rate - a.annual_interest_rate; // Highest interest first
    } else {
      return a.current_balance - b.current_balance; // Lowest balance first
    }
  });

  const recommendations: DebtStrategyRecommendation[] = [];

  // Simplified calculation for demonstration
  sortedDebts.forEach((debt, index) => {
    // Top priority gets the extra payment
    const recommendedExtra = index === 0 ? extraMonthlyPayment : 0;

    // Rough estimate of payoff time (months)
    const monthlyRate = debt.annual_interest_rate / 12 / 100;
    const totalMonthlyPayment = debt.minimum_payment + recommendedExtra;

    let monthsToPayoff = 0;
    let interestSaved = 0;

    if (totalMonthlyPayment > (debt.current_balance * monthlyRate)) {
       // A very basic amortization estimation
       let bal = debt.current_balance;
       let totalInterestPaidWithExtra = 0;
       while (bal > 0 && monthsToPayoff < 600) { // Limit to 50 years to prevent infinite loop
         const interest = bal * monthlyRate;
         totalInterestPaidWithExtra += interest;
         bal = bal + interest - totalMonthlyPayment;
         monthsToPayoff++;
       }

       // Compare with min payment only
       let balMin = debt.current_balance;
       let totalInterestPaidMin = 0;
       let monthsToPayoffMin = 0;

       if (debt.minimum_payment > (debt.current_balance * monthlyRate)) {
           while (balMin > 0 && monthsToPayoffMin < 600) {
             const interest = balMin * monthlyRate;
             totalInterestPaidMin += interest;
             balMin = balMin + interest - debt.minimum_payment;
             monthsToPayoffMin++;
           }
           interestSaved = totalInterestPaidMin - totalInterestPaidWithExtra;
       }
    } else {
      monthsToPayoff = -1; // Never pays off
    }

    recommendations.push({
      debtId: debt.id,
      creditor: debt.creditor,
      recommendedExtraPayment: recommendedExtra,
      strategy: strategyType,
      estimatedMonthsToPayoff: monthsToPayoff,
      totalInterestSaved: Math.max(0, interestSaved)
    });
  });

  return recommendations;
}
