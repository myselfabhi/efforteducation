// Types
export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  category: 'government_exam' | 'school_enrichment' | 'leadership' | 'public_speaking';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
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
  count: number;
}

// Mock Data
const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "SSC CGL Complete Preparation",
    description: "Comprehensive preparation course for SSC CGL examination with expert guidance, study materials, and regular mock tests.",
    shortDescription: "Complete preparation for SSC CGL exam",
    category: "government_exam",
    level: "Intermediate",
    duration: "6 months",
    price: 15000,
    originalPrice: 20000,
    isActive: true,
    isFeatured: true,
    maxStudents: 50,
    currentStudents: 35,
    rating: 4.8,
    totalRatings: 142
  },
  {
    id: 2,
    title: "Banking Exam Masterclass",
    description: "Expert coaching for IBPS, SBI PO, and other banking examinations with personalized attention and doubt clearing sessions.",
    shortDescription: "Banking exam preparation course",
    category: "government_exam",
    level: "Advanced",
    duration: "8 months",
    price: 18000,
    originalPrice: 25000,
    isActive: true,
    isFeatured: true,
    maxStudents: 40,
    currentStudents: 28,
    rating: 4.9,
    totalRatings: 98
  },
  {
    id: 3,
    title: "Public Speaking Excellence",
    description: "Transform your communication skills with our comprehensive public speaking course. Build confidence and master the art of presentation.",
    shortDescription: "Master public speaking skills",
    category: "public_speaking",
    level: "Beginner",
    duration: "3 months",
    price: 8000,
    originalPrice: 12000,
    isActive: true,
    isFeatured: true,
    maxStudents: 30,
    currentStudents: 22,
    rating: 4.7,
    totalRatings: 65
  },
  {
    id: 4,
    title: "Leadership Development Program",
    description: "Develop essential leadership qualities and learn to inspire and lead teams effectively in various situations.",
    shortDescription: "Build leadership skills",
    category: "leadership",
    level: "Intermediate",
    duration: "4 months",
    price: 10000,
    originalPrice: 15000,
    isActive: true,
    isFeatured: false,
    maxStudents: 25,
    currentStudents: 18,
    rating: 4.6,
    totalRatings: 52
  },
  {
    id: 5,
    title: "School Enrichment Program",
    description: "Enhance academic performance and develop critical thinking skills with our comprehensive school enrichment program.",
    shortDescription: "Academic enrichment for students",
    category: "school_enrichment",
    level: "Beginner",
    duration: "6 months",
    price: 12000,
    originalPrice: 16000,
    isActive: true,
    isFeatured: false,
    maxStudents: 60,
    currentStudents: 45,
    rating: 4.5,
    totalRatings: 78
  }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote: "I cleared SBI PO in my first attempt with AIR 45! The mock test series and personalized doubt sessions at Effort Education were game-changers. The faculty's expertise in banking exams is unmatched.",
    name: "Priya Sharma",
    role: "SBI PO, AIR 45",
    initials: "PS"
  },
  {
    id: 2,
    quote: "From being extremely shy to winning the district debate competition - Effort Education's public speaking program transformed me completely. The confidence I gained here helped me get selected for college leadership roles.",
    name: "Rajesh Kumar",
    role: "College Student Leader",
    initials: "RK"
  },
  {
    id: 3,
    quote: "My son cleared SSC CGL with rank 127! The comprehensive study plan and regular assessments at Effort Education made all the difference. The teachers are not just educators but mentors who truly care.",
    name: "Mrs. Anjali Patel",
    role: "Parent of SSC CGL Success",
    initials: "AP"
  },
  {
    id: 4,
    quote: "The leadership development program helped me secure a team lead position at my company. The practical exercises and real-world scenarios made learning impactful and immediately applicable.",
    name: "Amit Verma",
    role: "Corporate Team Lead",
    initials: "AV"
  },
  {
    id: 5,
    quote: "My daughter's grades improved dramatically after enrolling in the school enrichment program. Her confidence and problem-solving abilities have grown tremendously.",
    name: "Dr. Sunita Reddy",
    role: "Parent",
    initials: "SR"
  }
];

// Mock API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions with mock data
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
    await delay(300); // Simulate network delay
    
    let filteredCourses = [...MOCK_COURSES];
    
    // Apply filters
    if (params?.category) {
      filteredCourses = filteredCourses.filter(c => c.category === params.category);
    }
    if (params?.level) {
      filteredCourses = filteredCourses.filter(c => c.level === params.level);
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredCourses = filteredCourses.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      );
    }
    if (params?.featured) {
      filteredCourses = filteredCourses.filter(c => c.isFeatured);
    }
    
    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + limit);
    
    return {
      success: true,
      data: {
        courses: paginatedCourses,
        count: filteredCourses.length
      }
    };
  },

  // Get single course
  getCourse: async (id: string | number): Promise<ApiResponse<{ course: Course }>> => {
    await delay(200);
    
    const courseId = typeof id === 'string' ? parseInt(id) : id;
    const course = MOCK_COURSES.find(c => c.id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return {
      success: true,
      data: { course }
    };
  },

  // Get testimonials
  getTestimonials: async (): Promise<ApiResponse<{ testimonials: Testimonial[] }>> => {
    await delay(250);
    
    return {
      success: true,
      data: { testimonials: MOCK_TESTIMONIALS }
    };
  },

  // Submit contact form
  submitContactForm: async (data: ContactFormData): Promise<ApiResponse<{
    submissionId: number;
    timestamp: string;
  }>> => {
    await delay(500);
    
    // Log to console (in production, you might want to send to an external service)
    console.log('Contact form submission:', data);
    
    return {
      success: true,
      data: {
        submissionId: Math.floor(Math.random() * 10000),
        timestamp: new Date().toISOString()
      },
      message: 'Thank you for your message! We will get back to you soon.'
    };
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
    message: string;
  }>> => {
    await delay(100);
    
    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now(),
        environment: 'frontend',
        message: 'Frontend is running with mock data'
      }
    };
  },
};

export default api;
