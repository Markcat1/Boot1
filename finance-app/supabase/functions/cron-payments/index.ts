import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function sendTelegramMessage(chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    console.error(`Failed to send message to ${chatId}:`, await response.text());
  }
}

serve(async (req) => {
  try {
    // Determine T-3 target date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const targetDateString = targetDate.toISOString().split('T')[0];

    console.log(`Checking for payments due on: ${targetDateString}`);

    // Query pending payments due in exactly 3 days
    const { data: payments, error } = await supabase
      .from('payment_schedule')
      .select(`
        id,
        title,
        amount_due,
        due_date,
        user_id,
        profiles (
          telegram_chat_id
        )
      `)
      .eq('status', 'pendiente')
      .eq('due_date', targetDateString);

    if (error) {
      throw error;
    }

    if (!payments || payments.length === 0) {
      return new Response(JSON.stringify({ message: "No payments due in 3 days." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    let sentCount = 0;

    for (const payment of payments) {
      const profile = payment.profiles;
      // Depending on the Supabase client version and type definitions, related tables might come back as arrays or objects.
      // Assuming a 1:1 relationship fetch yields an object or array of 1.
      const chat_id = Array.isArray(profile) ? profile[0]?.telegram_chat_id : profile?.telegram_chat_id;

      if (chat_id && TELEGRAM_BOT_TOKEN) {
        const messageText = `⚠️ <b>Recordatorio de Pago</b>\nTienes un pago pendiente que vence en 3 días.\n\n<b>Concepto:</b> ${payment.title}\n<b>Monto:</b> $${payment.amount_due}\n<b>Fecha:</b> ${payment.due_date}\n\n¡Asegura tu liquidez!`;
        await sendTelegramMessage(chat_id, messageText);
        sentCount++;
      }
    }

    return new Response(JSON.stringify({
      message: "Notifications processed",
      total_payments_found: payments.length,
      notifications_sent: sentCount
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error processing cron job:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});