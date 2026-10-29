import React, { useState } from 'react';

export default function AnswerModal({ ticket, onClose, onSubmit }) {
  const [answerText, setAnswerText] = useState('');

  if (!ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onSubmit(ticket.id, answerText);
    setAnswerText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity" dir="rtl">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#18181b] border border-slate-100 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر مودال */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs font-medium text-slate-400 dark:text-slate-500">
              کد پیگیری: {ticket.trackingCode || ticket.id}
            </span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              {ticket.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* توضیحات تیکت کاربر */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">متن تیکت کاربر:</span>
          <p className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
            {ticket.description || 'بدون توضیح'}
          </p>
        </div>

        {/* فرم پاسخ پشتیبانی */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              متن پاسخ پشتیبانی:
            </label>
            <textarea
              rows="4"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="پاسخ خود را اینجا بنویسید..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
            >
              ارسال پاسخ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}