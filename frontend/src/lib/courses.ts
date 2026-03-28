export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  features: string[];
}

export const COURSES: Course[] = [
  {
    id: 'bank-po-so',
    slug: 'bank-po-so',
    title: 'Bank PO / SO',
    description: 'Comprehensive coaching for IBPS, SBI, and RBI Probationary and Specialist Officer exams.',
    category: 'Banking',
    features: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness', 'Current Affairs', 'Computer Awareness'],
  },
  {
    id: 'lic-gic',
    slug: 'lic-gic',
    title: 'LIC / GIC Preparation',
    description: 'Comprehensive coaching for Life Insurance Corporation and General Insurance Corporation of India recruitment exams.',
    category: 'Insurance',
    features: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness', 'Insurance & Financial Market'],
  },
  {
    id: 'interview-prep',
    slug: 'interview-prep',
    title: 'Interview Preparation',
    description: 'Specialized interview guidance for Bank PO, SO, and other competitive career paths.',
    category: 'Soft Skills',
    features: ['Mock Interviews', 'Personality Development', 'Body Language', 'Current Affairs'],
  },
  {
    id: 'ugc-net-jrf',
    slug: 'ugc-net-jrf',
    title: 'UGC NET / JRF',
    description: 'Expert guidance for University Grants Commission National Eligibility Test and Junior Research Fellowship.',
    category: 'Teaching',
    features: ['Paper 1 Specialist', 'Subject Specific Depth', 'Previous Year Analysis', 'Mock Tests'],
  },
  {
    id: 'ctet-tet',
    slug: 'ctet-tet',
    title: 'CTET / TET',
    description: 'Targeted preparation for Central Teacher Eligibility Test and State Teacher Eligibility Tests.',
    category: 'Teaching',
    features: ['Child Development', 'Pedagogy', 'Language Proficiency', 'Subject Expertise'],
  },
  {
    id: 'prt-tgt-pgt',
    slug: 'prt-tgt-pgt',
    title: 'PRT / TGT / PGT',
    description: 'Complete coaching for Primary, Trained Graduate, and Post Graduate Teacher recruitment exams.',
    category: 'Teaching',
    features: ['KVS/NVS Pattern', 'Subject Specialization', 'Teaching Aptitude', 'General Paper'],
  },
  {
    id: 'dsssb',
    slug: 'dsssb',
    title: 'DSSSB',
    description: 'Focused preparation for Delhi Subordinate Services Selection Board examinations.',
    category: 'Delhi Govt',
    features: ['General Awareness', 'Reasoning', 'Quicker Maths', 'Post Specific Content'],
  },
  {
    id: 'hotel-management',
    slug: 'hotel-management',
    title: 'Hotel Management',
    description: 'Expert coaching for NCHMCT JEE - the gateway to premier Institutes of Hotel Management.',
    category: 'Hospitality',
    features: ['NCHMCT JEE Focus', 'Service Sector Aptitude', 'English Mastery', 'Mock Tests'],
  }
];
