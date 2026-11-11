import React from 'react';

export default function WelcomeBanner({ userName = "کاربر", userInitials = "م ک" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B51E5] to-[#0F2D7F] p-6 md:p-8 text-white shadow-lg" dir="rtl">
      <div className="relative z-10 flex items-center justify-between">
        
        {/* بخش سمت راست: آواتار دوحرفی و متن خوش‌آمدگویی */}
        <div className="flex items-center gap-4">
          {/* دایره آواتار دو حرفی */}
          <div className="flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-full bg-amber-500/90 text-white font-bold text-base md:text-lg shadow-md border border-white/20">
            {userInitials}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              سلام {userName} عزیز
            </h1>
            <p className="text-xs md:text-sm text-blue-100 opacity-90">
              به داشبورد مدیریت پروژه ات خوش اومدی
            </p>
          </div>
        </div>

        {/* لوگو در سمت چپ بنر */}
        <div className="flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 shadow-inner">
          <img 
            src="src/assets/favicon-kario.png" 
            alt="Logo" 
            className="h-full w-full object-contain filter drop-shadow" 
          />
        </div>
      </div>

      {/* المان‌های تزئینی پس‌زمینه بنر */}
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/30 blur-2xl pointer-events-none" />
      <div className="absolute right-1/3 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
    </div>
  );
}