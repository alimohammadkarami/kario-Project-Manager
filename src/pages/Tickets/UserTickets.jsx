import React, { useState, useEffect, useRef } from 'react';
import TicketList from '../../components/tickets/TicketsList';
import { GetUserTickets } from '../../services/TicketsService';
import { useAuthCheck } from '../../hooks/useAuth';

export default function TicketsPage() {
  const { user , loading } = useAuthCheck();
    if(!user){
      return;
    }uthCheck()
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  
  // استفاده از ref برای اطمینان از اینکه درخواست فقط یک بار در چرخه حیات کامپوننت ارسال می‌شود
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // اگر در حال حاضر درخواست در حال ارسال است یا قبلاً ارسال شده، خارج شو
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    async function fetchTickets() {
      try {
        const response = await GetUserTickets();
        setTickets(response.data.tickets || response);
      } catch (err) {
        console.error("خطا در دریافت تیکت‌ها:", err);
        setError(err.message);
      } finally {
      }
    }

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-slate-500 dark:text-slate-400">در حال دریافت تیکت‌ها...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          خطا در ارتباط با سرور: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TicketList tickets={tickets} />
    </div>
  );
}