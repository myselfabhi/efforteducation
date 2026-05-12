import { useAuthStore } from './stores/authStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  // Prefer the in-memory token from the Zustand store so that tabs with
  // different logged-in users don't clobber each other via shared localStorage.
  const token = typeof window !== 'undefined'
    ? (useAuthStore.getState().token ?? localStorage.getItem('quiz_token'))
    : null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 204) return undefined as unknown as T;

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data
        ? (data as { error?: string }).error
        : null) || `HTTP ${res.status}`;
    throw new ApiError(res.status, message, data);
  }
  return data as T;
}

export type SoftResult<T = unknown> =
  | ({ success: true; data?: T; testimonials?: unknown } & Record<string, unknown>)
  | { success: false; error: string; isNetworkError?: boolean };

/**
 * Legacy soft-error variant kept for compatibility with the old `{ success, error }` callers.
 * New code should call apiFetch (which throws) or the namespaced helpers below.
 */
export async function apiFetchSoft<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<SoftResult<T>> {
  try {
    const data = await apiFetch<T>(path, options);
    if (data && typeof data === 'object') {
      return { success: true, ...(data as Record<string, unknown>) } as SoftResult<T>;
    }
    return { success: true, data } as SoftResult<T>;
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, error: err.message };
    }
    return { success: false, error: 'Failed to connect to server', isNetworkError: true };
  }
}

// ============= Types =============

export interface Testimonial { id: number; quote: string; name: string; role: string; initials: string; }

export interface Course {
  id: number; slug: string; title: string; category: string;
  description: string | null; duration_months: number | null; price_inr: number | null;
  hero_image_url: string | null; highlights: unknown; is_published: boolean;
  created_at: string; updated_at: string;
}

export interface Batch {
  id: number; course_id: number; name: string;
  start_date: string; end_date: string | null;
  schedule_description: string | null; capacity: number | null;
  status: 'upcoming' | 'active' | 'completed' | 'archived';
  created_by: number; created_at: string; updated_at: string;
  course_title?: string; course_slug?: string;
  teachers?: BatchTeacher[]; students?: BatchStudent[];
}
export interface BatchTeacher { id: number; username: string; full_name: string | null; avatar_url: string | null; is_primary: boolean; }
export interface BatchStudent { id: number; username: string; full_name: string | null; avatar_url: string | null; enrolled_at: string; status: string; }

export interface Material {
  id: number; batch_id: number; uploaded_by: number;
  title: string; description: string | null;
  type: 'pdf' | 'video_link' | 'image' | 'doc' | 'text_note';
  url: string | null; text_body: string | null;
  size_bytes: number | null; is_pinned: boolean; created_at: string;
  uploader_username?: string; uploader_name?: string | null;
}

export interface LiveClass {
  id: number; batch_id: number; teacher_id: number;
  title: string; description: string | null;
  scheduled_start: string; scheduled_end: string;
  room_id: string; room_password: string | null;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
  started_at: string | null; ended_at: string | null;
  recording_url: string | null; created_at: string;
  batch_name?: string; teacher_name?: string | null; teacher_username?: string;
}

export interface JitsiCredentials {
  domain: string; room: string; password: string | null;
  isModerator: boolean;
  user: { id: number; name: string; email: string };
  /** Cloudflare RealtimeKit credentials. Present once the backend is configured
   *  with CLOUDFLARE_REALTIMEKIT_APP_ID + CLOUDFLARE_API_TOKEN. */
  realtimekit?: { authToken: string; meetingId: string };
}

export interface Notification {
  id: number; user_id: number; type: string; title: string;
  body: string | null; link_url: string | null;
  read_at: string | null; created_at: string;
}

export interface EnrolmentRequest {
  id: number;
  batch_id: number;
  student_id?: number;
  status: 'pending' | 'approved' | 'declined' | 'cancelled';
  message: string | null;
  note: string | null;
  requested_at: string;
  decided_at: string | null;
  decided_by?: number | null;
  // joined fields (LIST endpoint adds student info; /me endpoint adds batch/course info)
  student_username?: string;
  student_full_name?: string | null;
  student_email?: string;
  student_avatar_url?: string | null;
  batch_name?: string;
  course_title?: string;
  course_slug?: string;
}

export interface PublicBatch {
  id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  schedule_description: string | null;
  capacity: number | null;
  status: string;
  enrolled_count: number;
  teachers: Array<{
    id: number; full_name: string | null; username: string;
    avatar_url: string | null; is_primary: boolean;
  }> | null;
}

export interface Announcement {
  id: number; batch_id: number; posted_by: number;
  title: string; body: string; is_pinned: boolean; created_at: string;
  poster_name?: string | null; poster_username?: string;
}

// ============= Auth =============

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: 'super_admin' | 'teacher' | 'student' | 'admin' | 'user';
  full_name?: string | null;
  phone?: string | null;
  class_grade?: string | null;
  avatar_url?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

// ============= Quiz types =============

export interface QuizSummary {
  id: number;
  title: string;
  description: string | null;
  status: 'DRAFT' | 'UPCOMING' | 'LIVE' | 'COMPLETED';
  scheduled_at: string | null;
  launched_at: string | null;
  completed_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  batch_id: number | null;
  is_practice: boolean;
  /** Per-quiz answer-change grace window in ms (migration 007). Defaults to 3000. */
  answer_grace_period_ms?: number;
  creator_name?: string;
  question_count?: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  time_limit: number;
  order_index: number;
  options: Array<{ id: number; option_text: string; is_correct?: boolean; option_index: number }>;
}

export interface QuizDetail extends QuizSummary {
  questions: QuizQuestion[];
}

export interface QuizLeaderboardRow {
  id: number;
  quiz_id: number;
  user_id: number;
  total_score: number;
  total_time_ms: number;
  rank: number | null;
  username: string;
  full_name: string | null;
}

export interface QuizScore {
  id: number;
  quiz_id: number;
  user_id: number;
  total_score: number;
  total_time_ms: number;
  rank: number;
}

export interface QuizResponseRow {
  id: number;
  quiz_id: number;
  question_id: number;
  user_id: number;
  selected_option_id: number | null;
  is_correct: boolean;
  response_time_ms: number;
  score: number;
  created_at: string;
  question_text: string;
  selected_option: string | null;
  correct_option: string | null;
  explanation: string | null;
}

export interface QuizResults {
  score: QuizScore | null;
  responses: QuizResponseRow[];
  total_questions: number;
}

// ============= Helpers =============

const j = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });
const patch = (body: unknown): RequestInit => ({ method: 'PATCH', body: JSON.stringify(body) });
const del = (): RequestInit => ({ method: 'DELETE' });

// ============= API namespaces =============

export const api = {
  auth: {
    register: (body: { username: string; email: string; password: string; full_name?: string; phone?: string; class_grade?: string }) =>
      apiFetch<AuthResponse>('/api/auth/register', j(body)),
    login: (body: { email: string; password: string }) =>
      apiFetch<AuthResponse>('/api/auth/login', j(body)),
  },

  users: {
    me: () => apiFetch('/api/users/me'),
    updateMe: (body: Partial<{ full_name: string; phone: string; avatar_url: string; bio: string; class_grade: string }>) =>
      apiFetch('/api/users/me', patch(body)),
    list: (role?: 'super_admin' | 'teacher' | 'student') =>
      apiFetch(`/api/users${role ? `?role=${role}` : ''}`),
    invite: (body: { username: string; email: string; password: string; role: 'teacher' | 'student'; full_name: string; phone?: string; bio?: string; class_grade?: string }) =>
      apiFetch('/api/users', j(body)),
    setRole: (id: number, role: 'super_admin' | 'teacher' | 'student') =>
      apiFetch(`/api/users/${id}/role`, patch({ role })),
    remove: (id: number) => apiFetch(`/api/users/${id}`, del()),
    myEnrolmentRequests: () =>
      apiFetch<EnrolmentRequest[]>('/api/users/me/enrolment-requests'),
  },

  courses: {
    list: () => apiFetch<Course[]>('/api/courses'),
    listAdmin: () => apiFetch<Course[]>('/api/courses/admin'),
    get: (slug: string) => apiFetch<Course>(`/api/courses/${slug}`),
    batches: (slug: string) => apiFetch<PublicBatch[]>(`/api/courses/${slug}/batches`),
    create: (body: Partial<Course> & { slug: string; title: string; category: string }) =>
      apiFetch<Course>('/api/courses', j(body)),
    update: (id: number, body: Partial<Course>) =>
      apiFetch<Course>(`/api/courses/${id}`, patch(body)),
    remove: (id: number) => apiFetch(`/api/courses/${id}`, del()),
  },

  batches: {
    list: () => apiFetch<Batch[]>('/api/batches'),
    get: (id: number) => apiFetch<Batch>(`/api/batches/${id}`),
    create: (body: { course_id: number; name: string; start_date: string; end_date?: string; schedule_description?: string; capacity?: number; status?: string; teacher_ids?: number[]; student_ids?: number[] }) =>
      apiFetch<Batch>('/api/batches', j(body)),
    update: (id: number, body: Partial<Batch>) =>
      apiFetch<Batch>(`/api/batches/${id}`, patch(body)),
    addTeacher: (id: number, teacher_id: number, is_primary = false) =>
      apiFetch(`/api/batches/${id}/teachers`, j({ teacher_id, is_primary })),
    removeTeacher: (id: number, teacher_id: number) =>
      apiFetch(`/api/batches/${id}/teachers/${teacher_id}`, del()),
    setPrimaryTeacher: (id: number, teacher_id: number) =>
      apiFetch(`/api/batches/${id}/teachers/${teacher_id}/primary`, { method: 'PATCH' }),
    myAttendance: (id: number) =>
      apiFetch<{ total_past: number; attended: number; total_seconds: number }>(
        `/api/batches/${id}/my-attendance`
      ),
    // ── Request-to-join enrolment (migration 006) ───────────────────────
    requestEnrolment: (id: number, message?: string) =>
      apiFetch<EnrolmentRequest>(
        `/api/batches/${id}/enrolment-requests`,
        j({ message })
      ),
    listEnrolmentRequests: (id: number, status: 'pending' | 'approved' | 'declined' | 'cancelled' | 'all' = 'pending') =>
      apiFetch<EnrolmentRequest[]>(
        `/api/batches/${id}/enrolment-requests?status=${status}`
      ),
    decideEnrolmentRequest: (id: number, reqId: number, action: 'approve' | 'decline', note?: string) =>
      apiFetch(
        `/api/batches/${id}/enrolment-requests/${reqId}`,
        patch({ action, note })
      ),
    cancelEnrolmentRequest: (id: number, reqId: number) =>
      apiFetch(`/api/batches/${id}/enrolment-requests/${reqId}`, del()),
    addStudents: (id: number, student_ids: number[]) =>
      apiFetch(`/api/batches/${id}/students`, j({ student_ids })),
    removeStudent: (id: number, student_id: number) =>
      apiFetch(`/api/batches/${id}/students/${student_id}`, del()),
  },

  materials: {
    listForBatch: (batchId: number) => apiFetch<Material[]>(`/api/batches/${batchId}/materials`),
    create: (batchId: number, body: Partial<Material> & { title: string; type: Material['type'] }) =>
      apiFetch<Material>(`/api/batches/${batchId}/materials`, j(body)),
    update: (id: number, body: Partial<Material>) =>
      apiFetch<Material>(`/api/materials/${id}`, patch(body)),
    remove: (id: number) => apiFetch(`/api/materials/${id}`, del()),
    signedUpload: (body: { filename: string; content_type: string; size_bytes: number }) =>
      apiFetch<{ uploadUrl: string; publicUrl: string; objectKey: string; expiresInSec: number }>(
        '/api/materials/upload-url',
        j(body)
      ),
  },

  classes: {
    listForBatch: (batchId: number) => apiFetch<LiveClass[]>(`/api/batches/${batchId}/classes`),
    schedule: (batchId: number, body: { title: string; description?: string; scheduled_start: string; scheduled_end: string; teacher_id?: number }) =>
      apiFetch<LiveClass>(`/api/batches/${batchId}/classes`, j(body)),
    update: (id: number, body: Partial<LiveClass>) => apiFetch<LiveClass>(`/api/classes/${id}`, patch(body)),
    cancel: (id: number) => apiFetch(`/api/classes/${id}`, del()),
    join: (id: number) => apiFetch<{ class: { id: number; title: string; status: LiveClass['status'] }; credentials: JitsiCredentials }>(
      `/api/classes/${id}/join`,
      { method: 'POST' }
    ),
    leave: (id: number) => apiFetch(`/api/classes/${id}/leave`, { method: 'POST' }),
    upcoming: () => apiFetch<LiveClass[]>('/api/classes/upcoming'),
  },

  announcements: {
    listForBatch: (batchId: number) => apiFetch<Announcement[]>(`/api/batches/${batchId}/announcements`),
    create: (batchId: number, body: { title: string; body: string; is_pinned?: boolean }) =>
      apiFetch<Announcement>(`/api/batches/${batchId}/announcements`, j(body)),
  },

  notifications: {
    list: (limit = 50) => apiFetch<{ items: Notification[]; unread: number }>(`/api/notifications?limit=${limit}`),
    markRead: (id: number) => apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => apiFetch('/api/notifications/read-all', { method: 'POST' }),
  },

  dashboard: {
    superAdmin: () => apiFetch('/api/dashboard/super-admin'),
    teacher: () => apiFetch('/api/dashboard/teacher'),
    student: () => apiFetch('/api/dashboard/student'),
  },

  quizzes: {
    list: (batch_id?: number) =>
      apiFetch<QuizSummary[]>(`/api/quizzes${batch_id ? `?batch_id=${batch_id}` : ''}`),
    get: (id: number) => apiFetch<QuizDetail>(`/api/quizzes/${id}`),
    create: (body: { title: string; description?: string; scheduled_at?: string; batch_id?: number; is_practice?: boolean; answer_grace_period_ms?: number }) =>
      apiFetch<QuizSummary>('/api/quizzes', j(body)),
    addQuestion: (
      quizId: number,
      body: { question_text: string; time_limit?: number; explanation?: string; options: Array<{ option_text: string; is_correct: boolean }> }
    ) => apiFetch<QuizQuestion>(`/api/quizzes/${quizId}/questions`, j(body)),
    launch: (quizId: number) => apiFetch<{ message: string; quiz: QuizSummary }>(`/api/quizzes/${quizId}/launch`, { method: 'POST' }),
    leaderboard: (quizId: number) => apiFetch<QuizLeaderboardRow[]>(`/api/quizzes/${quizId}/leaderboard`),
    results: (quizId: number) => apiFetch<QuizResults>(`/api/quizzes/${quizId}/results`),
  },

  // Marketing / legacy
  submitContactForm: (body: Record<string, string | undefined>) =>
    apiFetchSoft('/api/contact', j(body)),
  getTestimonials: () => apiFetchSoft('/api/testimonials'),
};
