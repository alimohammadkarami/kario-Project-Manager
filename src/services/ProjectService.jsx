const API_URL = "http://localhost:5540/api/v1/projects"; // آدرس پایگاه سرور شما
const TASKS_URL = "http://localhost:5540/api/v1/tasks";
export async function GetAllProjects() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data.data;
}
export async function GetMyTasks() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${TASKS_URL}/mine`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data.data;
}
export async function GetProjectDetailsById(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data.data;
}
export async function GetProjectUsers(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data;
}
export async function GetProjectTasks(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data;
}
export async function DeleteProject(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data.data;
}
export async function DeleteTask(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${TASKS_URL}/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data.data;
}
export async function CreateProject(ProjectData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: ProjectData.title,
      description: ProjectData.description,
      dueDate: ProjectData.dueDate,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(ProjectData.message || "خطایی  رخ داد.");
  }

  return data;
}
export async function UpdateProject(id, ProjectData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: ProjectData.title,
      description: ProjectData.description,
      dueDate: ProjectData.dueDate,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(ProjectData.message || "خطایی  رخ داد.");
  }

  return ProjectData;
}
export async function UpdateTask(id, TaskData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${TASKS_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: TaskData.title,
      description: TaskData.description,
      dueDate: TaskData.dueDate,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(ProjectData.message || "خطایی  رخ داد.");
  }

  return data;
}
export async function CreateTask(id, TaskData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: TaskData.title,
      description: TaskData.description,
      dueDate: TaskData.dueDate,
      assigneeId: TaskData.assigneeId,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(TaskData.message || "خطایی  رخ داد.");
  }

  return TaskData;
}

export async function UpdateTaskStatus(id, status) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${TASKS_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: status,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data;
}

export async function GetProjectMembers(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data;
}
export async function AddProjectMember(id, email) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email:email
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data;
}
export async function DeleteMember(id , userId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}/members/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "خطایی  رخ داد.");
  }

  return data.data;
}