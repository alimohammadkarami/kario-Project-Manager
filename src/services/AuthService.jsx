// src/services/authService.js
const API_URL = 'http://localhost:5540/api/v1/auth'; // آدرس پایگاه سرور شما

export async function registerUser(userData) {
  console.log(userData)
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        fullName:userData.name,
        email:userData.email,
        password:userData.password,
        confirmPassword:userData.repass
    }),
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'خطایی در ثبت‌نام رخ داد.');
  }

  return data;
}
export async function LoginUser(userData){
   const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email:userData.email,
        password:userData.password,
    }),
  });
  const data = await response.json();

  if(!response.ok){
    throw new Error (data.message || "خطایی رخ داد ");
  }
  return data;
}