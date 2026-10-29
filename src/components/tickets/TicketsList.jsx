import React, { useState } from 'react';
import SupportModal from './SupportModal';

export default function TicketList({ tickets = [] }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
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
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-950/60 px-3 py-1 text-xs font-light text-amber-700 dark:text-amber-400">
            {statusLabel || 'در حال بررسی'}
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

  return (
    <div className="w-full space-y-6" dir="rtl">
      {/* هدر بخش تیکت‌ها و دکمه تیکت جدید */}
      <div className="flex items-center justify-between">
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
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">تیکت ها</h1>
        </div>

        <button 
          type="button" 
          onClick={() => setIsNewTicketOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition duration-200 hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
        >
          
          تیکت جدید
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* کارت اصلی نگهدارنده جدول/کارت‌ها */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white  dark:bg-[#121212] shadow-sm transition-colors">
        {/* ۱. نمای دسکتاپ (جدول) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full  text-right text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-medium text-slate-400 dark:text-slate-500">
                <th className="px-6 py-4 font-normal">شناسه</th>
                <th className="px-6 py-4 font-normal">عنوان</th>
                <th className="px-6 py-4 text-center font-normal">وضعیت</th>
                <th className="px-6 py-4 text-left font-normal">تاریخ ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="group cursor-pointer transition hover:bg-blue-50/30 dark:hover:bg-slate-800/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <div className="flex items-center gap-2">
                        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.833 23.9167H8.16634C4.66634 23.9167 2.33301 22.1667 2.33301 18.0834V9.91671C2.33301 5.83337 4.66634 4.08337 8.16634 4.08337H19.833C23.333 4.08337 25.6663 5.83337 25.6663 9.91671V18.0834C25.6663 22.1667 23.333 23.9167 19.833 23.9167Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke="#1B51E5"/>
                          <path opacity="0.4" d="M19.8337 10.5L16.182 13.4167C14.9803 14.3733 13.0087 14.3733 11.807 13.4167L8.16699 10.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" stroke="#1B51E5"/>
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
                    <td className="whitespace-nowrap px-6 py-4 text-left font-mono text-xs text-slate-400 dark:text-slate-500">
                      {ticket.jalaliDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-slate-400">
                    تیکتی برای نمایش یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ۲. نمای موبایل (کارت‌ها) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 space-y-3 cursor-pointer active:bg-slate-50 dark:active:bg-slate-800/80 transition"
              >
                <div className="flex items-center justify-between pb-6">
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                    #{ticket.trackingCode || ticket.id}
                  </span>
                  {getStatusBadge(ticket.status, ticket.statusLabel)}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-2">
                  {ticket.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-1">
                  <span>تاریخ ثبت:</span>
                  <span className="font-mono">{ticket.jalaliDate} {ticket.time ? `- ${ticket.time}` : ''}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              تیکتی برای نمایش یافت نشد.
            </div>
          )}
        </div>
      </div>

      {/* ۳. مودال جزئیات و پاسخ تیکت (دارک‌مود) */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div 
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#18181b] border border-slate-100 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* هدر مودال */}
            <div className="flex items-start gap-8 justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-medium text-slate-400 dark:text-slate-500">
                </span>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {selectedTicket.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* متن پیام تیکت کاربر */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-300">متن تیکت شما:</span>
                <span className="font-mono">{selectedTicket.jalaliDate} - {selectedTicket.time}</span>
              </div>
              <p className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                {selectedTicket.description || 'بدون توضیح'}
              </p>
            </div>

            {/* پاسخ پشتیبانی / امور مشتریان */}
            {selectedTicket.answer ? (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>پاسخ پشتیبانی:</span>
                  <span className="font-mono text-slate-400 font-normal">
                    {selectedTicket.answer.jalaliDate} - {selectedTextTime(selectedTicket.answer.time)}
                  </span>
                </div>
                <div className="rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 border border-emerald-100 dark:border-emerald-900/50">
                  {selectedTicket.answer.text}
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50/60 dark:bg-amber-950/30 p-3.5 text-xs text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 text-center">
                هنوز پاسخی برای این تیکت ثبت نشده است.
              </div>
            )}

            {/* فوتر مودال */}
            <div className="pt-2 text-left">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
      {isNewTicketOpen && (<SupportModal open={isNewTicketOpen} onClose={()=>{setIsNewTicketOpen(false)}} />)}
    </div>
  );
}

// تابع کمکی زمان
function selectedTextTime(time) {
  return time || '';
}