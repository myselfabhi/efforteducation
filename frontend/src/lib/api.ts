const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('quiz_token') : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (body: { username: string; email: string; password: string; role?: string }) =>
      apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  quizzes: {
    list: () => apiFetch('/api/quizzes'),
    get: (id: number) => apiFetch(`/api/quizzes/${id}`),
    create: (body: { title: string; description?: string; scheduled_at?: string }) =>
      apiFetch('/api/quizzes', { method: 'POST', body: JSON.stringify(body) }),
    addQuestion: (quizId: number, body: {
      question_text: string;
      time_limit: number;
      options: Array<{ option_text: string; is_correct: boolean }>;
    }) => apiFetch(`/api/quizzes/${quizId}/questions`, { method: 'POST', body: JSON.stringify(body) }),
    launch: (quizId: number) =>
      apiFetch(`/api/quizzes/${quizId}/launch`, { method: 'POST' }),
    leaderboard: (quizId: number) => apiFetch(`/api/quizzes/${quizId}/leaderboard`),
    results: (quizId: number) => apiFetch(`/api/quizzes/${quizId}/results`),
  },
  submitContactForm: (body: Record<string, string>) =>
    apiFetch('/api/contact', { method: 'POST', body: JSON.stringify(body) }),
};
