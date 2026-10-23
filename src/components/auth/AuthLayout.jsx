import React, { useState } from 'react';

export default function AuthLayout({children,src}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // هندل کردن فرآیند ورود
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-screen w-full  font-sans" dir="rtl">
      

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>

      <div className="relative hidden w-1/2 lg:flex items-center justify-center overflow-hidde">
        {/* تصویر پس‌زمینه دفتر کار همراه با اورلی تیره */}
        <img
          src={src}
          alt="فضای کاری کاریو"
          className="absolute inset-0 h-full w-full object-cover"
        />
        
      </div>
    </div>
  );
}
