"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, Calendar, CreditCard, PiggyBank, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { calculateCashFlow, calculateDebtStrategy, CashFlowProjection, Debt, DebtStrategyRecommendation, IncomeSource, PaymentScheduleItem } from "@/lib/finance";

interface FinanceData {
  balance: number;
  income: number;
  debt: number;
  savings: number;
  cashFlow: CashFlowProjection[];
  debtStrategy: DebtStrategyRecommendation[];
}

export default function Home() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Authenticate (skip in mock/demo unless user is logged in, but we handle missing auth gracefully)
        const { data: { session } } = await supabase.auth.getSession();

        const initialBalance = 12500;
        let incomes: IncomeSource[] = [];
        let debts: Debt[] = [];
        let payments: PaymentScheduleItem[] = [];

        if (session?.user) {
          const userId = session.user.id;

          const [incomesRes, debtsRes, paymentsRes] = await Promise.all([
            supabase.from('income_sources').select('*').eq('user_id', userId),
            supabase.from('debts').select('*').eq('user_id', userId),
            supabase.from('payment_schedule').select('*').eq('user_id', userId)
          ]);

          if (incomesRes.data) incomes = incomesRes.data as unknown as IncomeSource[];
          if (debtsRes.data) debts = debtsRes.data as unknown as Debt[];
          if (paymentsRes.data) payments = paymentsRes.data as unknown as PaymentScheduleItem[];
        } else {
           // Provide mock data if not authenticated for demo purposes
           incomes = [{ id: '1', amount: 24000, recurrence: 'mensual', next_deposit_date: new Date(Date.now() + 5 * 86400000) }];
           debts = [
             { id: '1', creditor: 'Tarjeta Banamex', total_balance: 15000, current_balance: 15000, annual_interest_rate: 45, minimum_payment: 1000 },
             { id: '2', creditor: 'Préstamo Personal', total_balance: 30000, current_balance: 30000, annual_interest_rate: 22, minimum_payment: 1500 }
           ];
           payments = [
             { id: '1', amount_due: 1000, due_date: new Date(Date.now() + 3 * 86400000) }
           ];
        }

        const projectedCashFlow = calculateCashFlow(initialBalance, incomes, payments, 30);
        const recommendedStrategy = calculateDebtStrategy(debts, 500, 'avalanche');

        setData({
          balance: initialBalance,
          income: incomes.reduce((acc, curr) => acc + curr.amount, 0),
          debt: debts.reduce((acc, curr) => acc + curr.current_balance, 0),
          savings: 45,
          cashFlow: projectedCashFlow,
          debtStrategy: recommendedStrategy
        });
      } catch (err: unknown) {
        console.error(err);
        setError("Error cargando los datos.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Resumen Financiero</h1>
            <p className="text-gray-500">Bienvenido de vuelta. Aquí está tu estado actual.</p>
          </div>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </header>

        {error && <div className="text-red-500">{error}</div>}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
              <PiggyBank className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${loading ? "..." : data?.balance.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Ingresos Mes</CardTitle>
              <ArrowDownToLine className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${loading ? "..." : data?.income.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Deuda Total</CardTitle>
              <ArrowUpFromLine className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -${loading ? "..." : data?.debt.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Metas Ahorro</CardTitle>
              <Target className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? "..." : `${data?.savings}%`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cash Flow Projection */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Flujo de Efectivo</CardTitle>
              <CardDescription>Proyección a 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 items-center justify-center border-2 border-dashed rounded-md text-gray-400 p-4 text-center">
                {loading ? 'Cargando proyección...' :
                 (data?.cashFlow && data.cashFlow.some(cf => cf.isRed) ?
                  <span className="text-red-500 font-bold flex flex-col items-center"><ArrowDownToLine className="w-6 h-6 mb-2"/> ¡Alerta de liquidez en los próximos 30 días!</span> :
                  <span className="text-green-500 font-bold flex flex-col items-center"><ArrowUpFromLine className="w-6 h-6 mb-2"/> Flujo saludable proyectado.</span>)}
              </div>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Próximo Pago:</span>
                  <span className="font-semibold text-red-600">
                    {loading ? "..." : "Tarjeta Crédito (T-3 días)"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Próximo Ingreso:</span>
                  <span className="font-semibold text-green-600">
                    {loading ? "..." : "Quincena (T-5 días)"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debt Strategy */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Estrategia de Deuda</CardTitle>
              <CardDescription>Método Avalancha Activo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center text-gray-500 py-4">Calculando estrategia...</div>
                ) : (
                  data?.debtStrategy.map((strategy, index) => (
                    <div key={strategy.debtId} className={`flex items-center space-x-4 p-3 rounded-lg ${index === 0 ? 'bg-red-50 text-red-900' : 'bg-gray-50 text-gray-900'}`}>
                      <CreditCard className={`w-8 h-8 ${index === 0 ? '' : 'text-gray-400'}`} />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{strategy.creditor}</p>
                        <p className={`text-xs ${index === 0 ? 'text-red-700' : 'text-gray-500'}`}>
                          {index === 0 ? 'Foco Principal - Aporta extra' : 'Pago Mínimo'}
                        </p>
                      </div>
                      <div className="font-semibold text-right">
                        <div>+${strategy.recommendedExtraPayment}</div>
                      </div>
                    </div>
                  ))
                )}

                <Button className="w-full mt-2" disabled={loading}>Ver Plan de Pagos</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}