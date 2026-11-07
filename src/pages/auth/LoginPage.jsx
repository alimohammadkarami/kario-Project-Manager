import React, { useState } from 'react';
import { LoginUser } from '../../services/AuthService';
import { useloggedCheck } from '../../hooks/useAuth';

export default function LoginPage() {
  useloggedCheck();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await LoginUser(formData);
      console.log(response);
      setMessage({
        text: 'ورود با موفقیت انجام شد! در حال انتقال...',
        type: 'success',
      });
      if (response.data) {
        const { email, avatarName, fullName, role } = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('avatarName', avatarName);
        localStorage.setItem('user_role', role);
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.message || 'خطایی رخ داد ',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans">
      
      {/* کانتینر اصلی فرم - کاملاً وسط‌چین و لایت */}
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        
        {/* برندینگ و لوگو در بالا */}
        <div className="flex justify-center mb-1">
          <div className="flex h-22 w-22 items-center justify-center rounded-2xl">
            <img 
              src="src/assets/favicon-kario.png" 
              alt="کاریو" 
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* عنوان و توضیحات */}
        <div className="space-y-1.5 w-full">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            ورود به کاریو
          </h2>
          <p className="text-xs text-slate-400">
            لطفاً ایمیل و رمز عبور خود را وارد کنید
          </p>
        </div>

        {/* پیام‌های وضعیت */}
        {message.text && (
          <div className={`w-full p-3 rounded-xl text-xs font-medium text-center transition-all duration-300 ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* فرم ورود */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-right">
          
          {/* ایمیل */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              ایمیل
            </label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@kariu.ir"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              dir="ltr"
            />
          </div>

          {/* رمز عبور */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              رمز عبور
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              dir="ltr"
            />
          </div>

          {/* فراموشی رمز عبور */}
          <div className="text-right pt-0.5">
            <a href="#forgot" className="text-xs font-semibold text-blue-600 hover:underline">
              فراموشی رمز عبور؟
            </a>
          </div>

          {/* دکمه ورود */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        {/* لینک ثبت‌نام */}
        <div className="text-center text-xs text-slate-400 pt-2">
          حساب کاربری ندارید؟{' '}
          <a href="/signup" className="font-semibold text-blue-600 hover:underline">
            ثبت نام کنید
          </a>
        </div>

      </div>
    </div>
  );
}