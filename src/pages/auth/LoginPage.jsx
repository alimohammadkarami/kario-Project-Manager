import React, { useState } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import { LoginUser } from '../../services/AuthService';


export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
  const handleChange = (e)=>{
    setFormData({
      ...formData , 
      [e.target.name]:e.target.value
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await LoginUser(formData);
      console.log(response);
      setMessage({ 
        text: 'ورود با موفقیت انجام شد! در حال انتقال...', 
        type: 'success' 
      });
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch(err){
        setMessage({
          message: err.message || 'خطایی رخ داد ',
          type:'error'
        });
    } finally {
      setLoading(false);
    }
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
      {message.text && (
        <div className={`p-3 rounded-lg text-xs font-medium text-right transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {message.text}
        </div>
      )}
      {/* فرم */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 text-right">
          <label className="block text-xs font-semibold text-slate-700">ایمیل</label>
          <input
            type="email"
            required
            name='email'
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
            required
            name='password'
            value={formData.password}
            onChange={handleChange}
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