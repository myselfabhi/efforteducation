// Client-side signup validation — themed, per-field messages (no browser-native
// popups). Mirrors the backend rules so the server rarely has to reject.

export interface SignupValues {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  class_grade?: string;
}

export type SignupErrors = Partial<Record<keyof SignupValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_.-]+$/;

export function validateSignup(v: SignupValues): SignupErrors {
  const e: SignupErrors = {};

  if (v.full_name.trim().length < 2) e.full_name = 'Please enter your name.';

  const u = v.username.trim();
  if (!u) e.username = 'Choose a username.';
  else if (u.length < 3 || u.length > 50) e.username = 'Use 3–50 characters.';
  else if (!USERNAME_RE.test(u)) e.username = 'Only letters, numbers, . _ and -';

  if (!v.email.trim()) e.email = 'Email is required.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.';

  if (!v.phone.trim()) e.phone = 'Phone number is required.';
  else if (v.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number.';

  if (!v.password) e.password = 'Create a password.';
  else if (v.password.length < 8) e.password = 'At least 8 characters.';

  return e;
}

/** The first field with an error, for focus/scroll. */
export function firstError(e: SignupErrors): keyof SignupValues | null {
  const order: (keyof SignupValues)[] = ['full_name', 'username', 'class_grade', 'email', 'phone', 'password'];
  return order.find((k) => e[k]) ?? null;
}
