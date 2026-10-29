const API_URL = 'http://localhost:5540/api/v1/tickets'; // آدرس پایگاه سرور شما

export async function GetUserTickets() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/mine`, {
    method: 'GET',
    headers : {
      'Content-Type':'application/json',
      authorization : `Bearer ${token}`
    },
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'خطایی  رخ داد.');
  }

  return data;
}
export async function SubmitTicket(form) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers : {
      'Content-Type':'application/json',
      authorization : `Bearer ${token}`
    },
    body:JSON.stringify({
        title:form.subject,
        description:form.description
    })
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'خطایی  رخ داد.');
  }

  return data;
}