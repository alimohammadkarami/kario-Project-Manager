import React from 'react';
import { useAuthCheck } from '../hooks/useAuth';

export default function DashboardPage() {
  // تمام منطق پیچیده رفته داخل این یک خط!
  const { user, loading } = useAuthCheck();

  if (loading) {
    return <div className="p-8 text-center text-slate-500">در حال بررسی اعتبار حساب کاربری...</div>;
  }

  return (
    <div className="p-8" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-800">خوش آمدید، {user?.name}</h1>
      <p className="text-slate-600 mt-2">شما به صورت امن وارد پنل مدیریتی کاریو شده‌اید.</p>
    </div>
  );
}