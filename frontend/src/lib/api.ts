// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  category: 'government_exam' | 'school_enrichment' | 'leadership' | 'public_speaking';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  originalPrice?: number;
  image?: string;
  thumbnail?: string;
  isActive: boolean;
  isFeatured: boolean;
  maxStudents?: number;
  currentStudents: number;
  rating: number;
  totalRatings: number;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API utility functions
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API functions
export const api = {
  // Get all courses
  getCourses: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    search?: string;
    featured?: boolean;
  }): Promise<ApiResponse<CoursesResponse>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.level) searchParams.append('level', params.level);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured) searchParams.append('featured', 'true');

    const queryString = searchParams.toString();
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<CoursesResponse>(endpoint);
  },

  // Get featured courses
  getFeaturedCourses: async (): Promise<ApiResponse<{ courses: Course[] }>> => {
    return apiRequest<{ courses: Course[] }>('/courses/featured');
  },

  // Get courses by category
  getCoursesByCategory: async (category: string): Promise<ApiResponse<{ courses: Course[] }>> => {
    return apiRequest<{ courses: Course[] }>(`/courses/category/${category}`);
  },

  // Get single course
  getCourse: async (id: string | number): Promise<ApiResponse<{ course: Course }>> => {
    return apiRequest<{ course: Course }>(`/courses/${id}`);
  },

  // Get testimonials
  getTestimonials: async (): Promise<ApiResponse<{ testimonials: Testimonial[] }>> => {
    return apiRequest<{ testimonials: Testimonial[] }>('/testimonials');
  },

  // Submit contact form
  submitContactForm: async (data: ContactFormData): Promise<ApiResponse<{
    submissionId: number;
    timestamp: string;
  }>> => {
    return apiRequest<{
      submissionId: number;
      timestamp: string;
    }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
    message: string;
  }>> => {
    return apiRequest<{
      status: string;
      timestamp: string;
      uptime: number;
      environment: string;
      message: string;
    }>('/health');
  },
};

export default api;
