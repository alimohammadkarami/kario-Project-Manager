const API_URL = 'http://localhost:5540/api/v1/projects'; // آدرس پایگاه سرور شما
const TASKS_URL = 'http://localhost:5540/api/v1/tasks';
export async function GetAllProjects() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}`, {
    method: 'GET',
    headers : {
      'Content-Type':'application/json',
      authorization : `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'خطایی  رخ داد.');
  }

  return data.data;
}
export async function GetMyTasks() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${TASKS_URL}/mine`, {
    method: 'GET',
    headers : {
      'Content-Type':'application/json',
      authorization : `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'خطایی  رخ داد.');
  }

  return data.data;
}
export async function GetProjectDetailsById(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/`, {
    method: 'GET',
    headers : {
      'Content-Type':'application/json',
      authorization : `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) {
    throw new Error(data.message || 'خطایی  رخ داد.');
  }

  return data.data;
}
