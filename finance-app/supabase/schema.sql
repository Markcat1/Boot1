-- 1. profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  currency varchar(3) DEFAULT 'MXN'::character varying NOT NULL,
  telegram_chat_id varchar(50),
  timezone varchar(50) DEFAULT 'America/Mexico_City'::character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. income_sources
CREATE TABLE IF NOT EXISTS public.income_sources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name varchar(255) NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  recurrence varchar(20) NOT NULL CHECK (recurrence IN ('quincenal', 'mensual', 'semanal')),
  next_deposit_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_income_sources_user_id ON public.income_sources(user_id);

ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own income sources." ON public.income_sources
  FOR ALL USING (auth.uid() = user_id);

-- 3. debts
CREATE TABLE IF NOT EXISTS public.debts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  creditor varchar(255) NOT NULL,
  total_balance numeric(12,2) NOT NULL CHECK (total_balance >= 0),
  current_balance numeric(12,2) NOT NULL CHECK (current_balance >= 0),
  annual_interest_rate numeric(5,2) NOT NULL CHECK (annual_interest_rate >= 0),
  minimum_payment numeric(12,2) NOT NULL CHECK (minimum_payment >= 0),
  cut_off_day integer NOT NULL CHECK (cut_off_day BETWEEN 1 AND 31),
  due_day integer NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  status varchar(20) DEFAULT 'activa'::character varying NOT NULL CHECK (status IN ('activa', 'liquidada')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_debts_user_id ON public.debts(user_id);
CREATE INDEX idx_debts_status ON public.debts(status);

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own debts." ON public.debts
  FOR ALL USING (auth.uid() = user_id);

-- 4. payment_schedule
CREATE TABLE IF NOT EXISTS public.payment_schedule (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  debt_id uuid REFERENCES public.debts(id) ON DELETE SET NULL, -- Nullable for fixed expenses that are not credit
  title varchar(255) NOT NULL,
  amount_due numeric(12,2) NOT NULL CHECK (amount_due >= 0),
  due_date date NOT NULL,
  status varchar(20) DEFAULT 'pendiente'::character varying NOT NULL CHECK (status IN ('pendiente', 'pagado', 'vencido')),
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_payment_schedule_user_id ON public.payment_schedule(user_id);
CREATE INDEX idx_payment_schedule_debt_id ON public.payment_schedule(debt_id);
CREATE INDEX idx_payment_schedule_due_date ON public.payment_schedule(due_date);

ALTER TABLE public.payment_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment schedule." ON public.payment_schedule
  FOR ALL USING (auth.uid() = user_id);

-- 5. savings_goals
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name varchar(255) NOT NULL,
  target_amount numeric(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount numeric(12,2) DEFAULT 0 NOT NULL CHECK (current_amount >= 0),
  deadline_date date,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_savings_goals_user_id ON public.savings_goals(user_id);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own savings goals." ON public.savings_goals
  FOR ALL USING (auth.uid() = user_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_sources_updated_at BEFORE UPDATE ON public.income_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_debts_updated_at BEFORE UPDATE ON public.debts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_schedule_updated_at BEFORE UPDATE ON public.payment_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON public.savings_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
