import React, { useState, useEffect, useRef } from 'react';
import AnswerModal from '../../components/tickets/AnswerTicketModal';
import { AnswerTicket, GetAllSupportTickets } from '../../services/TicketsService';
import { useAuthCheck } from '../../hooks/useAuth';

export default function SupportTicketArchive() {
  const { user, loading: authLoading } = useAuthCheck(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketForAnswer, setSelectedTicketForAnswer] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلوگیری از ارسال درخواست‌های تکراری با useRef
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // تا زمانی که احراز هویت چک می‌شود یا درخواست رفته، ادامه نده
    if (authLoading) return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    async function fetchTickets() {
      try {
        setLoading(true);
        const response = await GetAllSupportTickets();
        
        // استخراج آرایه تیکت‌ها بر اساس ساختار پاسخ API
        const ticketsArray = response.data?.tickets || response.tickets || [];
        setTickets(ticketsArray);
      } catch (err) {
        console.error("خطا در دریافت آرشیو تیکت‌ها:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [authLoading]);

  // ۱. حالت بارگذاری
  if (authLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <div className="text-sm text-slate-500 dark:text-slate-400">در حال بارگذاری آرشیو تیکت‌ها...</div>
      </div>
    );
  }

  // ۲. نمایش خطا در صورت بروز مشکل
  if (error) {
    return (
      <div className="p-6" dir="rtl">
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          خطا در ارتباط با سرور: {error}
        </div>
      </div>
    );
  }

  // فیلتر کردن تیکت‌ها بر اساس جستجو (شناسه یا عنوان)
  const filteredTickets = tickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = ticket.title?.toLowerCase().includes(query);
    const trackingMatch = (ticket.trackingCode || ticket.id)?.toString().toLowerCase().includes(query);
    return titleMatch || trackingMatch;
  });

  const getStatusBadge = (status, statusLabel) => {
    switch (status) {
      case 'answered':
      case 'completed':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-light text-emerald-700 dark:text-emerald-400">
            { 'تکمیل شده'}
          </span>
        );
      case 'pending':
      case 'waiting':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/60 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            {statusLabel || 'در انتظار'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {statusLabel || 'نامشخص'}
          </span>
        );
    }
  };

  const handleSendAnswer = async (ticketId, text) => {
    try{
        await AnswerTicket(ticketId , text);
        setSelectedTicketForAnswer(null);
    }catch(err){
        console.log(err.message);
    }finally{
        window.location.reload();
    }
    
  };

  return (
    <div className="w-full space-y-6 p-6" dir="rtl">
      {/* هدر بخش و فیلد جستجو */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4  md:pr-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="34" height="34" rx="5" fill="" fill-opacity="0.2"/>
              <path d="M11.7083 17.5C7.875 17.5 7.875 19.2154 7.875 21.3333V22.2917C7.875 24.9367 7.875 27.0833 12.6667 27.0833H20.3333C24.1667 27.0833 25.125 24.9367 25.125 22.2917V21.3333C25.125 19.2154 25.125 17.5 21.2917 17.5C20.3333 17.5 20.065 17.7013 19.5667 18.075L18.5892 19.11C17.4583 20.3175 15.5417 20.3175 14.4013 19.11L13.4333 18.075C12.935 17.7013 12.6667 17.5 11.7083 17.5Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke="#1B51E5"/>
              <path d="M23.2087 17.5V11.75C23.2087 9.63204 23.2087 7.91663 19.3753 7.91663H13.6253C9.79199 7.91663 9.79199 9.63204 9.79199 11.75V17.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke="#1B51E5"/>
              <path d="M15.1104 14.8455H18.3016" stroke-linecap="round" stroke-linejoin="round" stroke="#1B51E5"/>
              <path d="M14.3154 11.9705H19.1071" stroke-linecap="round" stroke-linejoin="round" stroke="#1B51E5"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">آرشیو تیکت ها</h1>
        </div>

        {/* فیلد سرچ */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جست و جوی تیکت با شناسه..."
            className="w-full rounded-md border border-slate-400 dark:border-slate-800  py-2.5 pr-10 pl-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400  focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
      </div>

      {/* جدول / کارت‌های تیکت */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] shadow-sm transition-colors">
        {/* نمای دسکتاپ (جدول) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-medium text-slate-400 dark:text-slate-500">
                <th className="px-6 py-4 font-normal">شناسه</th>
                <th className="px-6 py-4 font-normal">عنوان</th>
                <th className="px-6 py-4 text-center font-normal">وضعیت</th>
                <th className="px-6 py-4 text-center font-normal">تاریخ ثبت</th>
                <th className="px-6 py-4 text-left font-normal">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="group transition hover:bg-blue-50/30 dark:hover:bg-slate-800/50">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-regular text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {ticket.trackingCode || ticket.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                      {ticket.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      {getStatusBadge(ticket.status, ticket.statusLabel)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center font-mono text-xs text-slate-400 dark:text-slate-500">
                      {ticket.jalaliDate}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-left">
                      <button
                        disabled= {ticket.status == "answered" && true }
                        type="button"
                        onClick={() => setSelectedTicketForAnswer(ticket)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        پاسخ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-400">
                    تیکتی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* نمای موبایل (کارت‌ها) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    #{ticket.trackingCode || ticket.id}
                  </span>
                  {getStatusBadge(ticket.status, ticket.statusLabel)}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-2">
                  {ticket.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="font-mono">{ticket.jalaliDate}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForAnswer(ticket)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                  >
                    پاسخ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              تیکتی یافت نشد.
            </div>
          )}
        </div>
      </div>

      {/* مودال پاسخ‌دهی */}
      <AnswerModal
        ticket={selectedTicketForAnswer}
        onClose={() => setSelectedTicketForAnswer(null)}
        onSubmit={handleSendAnswer}
      />
    </div>
  );
}