import React from 'react';

export default function ProjectCard({ 
  title, 
  description, 
  progress = 0, 
  membersCount = 0, 
  dueDate, 
  link = '#' 
}) {
  return (
    <a 
      href={link}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm transition-all duration-200 hover:border-blue-500/50 hover:shadow-md cursor-pointer"
    >
      {/* بخش بالای کارت: عنوان و توضیحات */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {title}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* بخش میانی: درصد پیشرفت و نوار بار */}
      <div className="my-5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <span>پیشرفت</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full rounded-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* بخش پایین کارت: تعداد اعضا و سررسید */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-[11px] text-slate-400 dark:text-slate-500">
        {/* تعداد اعضا */}
        <div className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>تعداد اعضا: {membersCount} نفر</span>
        </div>

        {/* سررسید تاریخ */}
        <div className="flex items-center gap-1.5 font-mono">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>مهلت {dueDate}</span>
        </div>
      </div>
    </a>
  );
}