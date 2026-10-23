import React, { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <AuthLayout src={"src/assets/kario-brand.jpg"}>
      {/* عنوان و توضیحات */}
      <div className="space-y-2 text-right">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          ورود به کاریو
        </h2>
        <p className="text-sm text-slate-500">
          لطفاً ایمیل و رمز عبور خود را وارد کنید
        </p>
      </div>

      {/* فرم */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 text-right">
          <label className="block text-xs font-semibold text-slate-700">ایمیل</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@kariu.ir"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            dir="ltr"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="block text-xs font-semibold text-slate-700">رمز عبور</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            dir="ltr"
          />
        </div>

        <div className="text-right">
          <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:underline">
            فراموشی رمز عبور؟
          </a>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
        >
          ورود
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        حساب کاربری ندارید؟{' '}
        <a href="/signup" className="font-bold text-blue-600 hover:underline">
          ثبت نام کنید
        </a>
      </div>
    </AuthLayout>
  );
}