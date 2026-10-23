import React, { useState } from 'react';
import { registerUser } from '../../services/AuthService';
import AuthLayout from '../../components/auth/AuthLayout';

export default function RegisterPage() {
  // اضافه شدن repass به استیت فرم
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    repass: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    // (اختیاری) بررسی اولیه تطابق پسوردها قبل از ارسال به بک‌اند
    if (formData.password !== formData.repass) {
      setMessage({ text: 'رمز عبور و تکرار آن با هم مطابقت ندارند.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      // ارسال کل داده‌ها شامل password و repass به API
      const response = await registerUser(formData);
      console.log(response);
      setMessage({ 
        text: 'حساب کاربری با موفقیت ایجاد شد! در حال انتقال...', 
        type: 'success' 
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (err) {
      setMessage({ 
        text: err.message || 'مشکلی در ارتباط با سرور رخ داد.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      src={"src/assets/kario-brand-two.jpg"}
    >
      <div className="space-y-2 text-right">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          ایجاد حساب کاربری
        </h2>
        <p className="text-sm text-slate-500">
          برای شروع مدیریت پروژه‌ها ثبت‌نام کنید
        </p>
      </div>

      {message.text && (
        <div className={`p-3 rounded-lg text-xs font-medium text-right transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-right">
          <label className="block text-xs font-semibold text-slate-700">نام و نام خانوادگی</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="محمد رضایی"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-right text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="block text-xs font-semibold text-slate-700">ایمیل</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="example@kariu.ir"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            dir="ltr"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="block text-xs font-semibold text-slate-700">رمز عبور</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            dir="ltr"
          />
        </div>

        {/* فیلد جدید: تکرار رمز عبور */}
        <div className="space-y-2 text-right">
          <label className="block text-xs font-semibold text-slate-700">تکرار رمز عبور</label>
          <input
            type="password"
            name="repass"
            required
            value={formData.repass}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 placeholder-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50 mt-2 flex items-center justify-center cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              در حال ارسال اطلاعات...
            </span>
          ) : 'ثبت نام'}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        قبلاً ثبت‌نام کرده‌اید؟{' '}
        <a href="/login" className="font-bold text-blue-600 hover:underline">
          وارد شوید
        </a>
      </div>
    </AuthLayout>
  );
}