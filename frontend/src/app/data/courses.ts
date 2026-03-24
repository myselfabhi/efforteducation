export interface SyllabusSection {
  title: string;
  topics: string[];
}

export interface ExamPattern {
  stage: string;
  sections: {
    name: string;
    questions: number;
    marks: number;
    duration: string;
  }[];
  totalQuestions: number;
  totalMarks: number;
  negativeMarking?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  heroImage: string;
  overview: string;
  eligibility: string;
  duration: string;
  mode: string;
  batch: string;
  language: string;
  highlights: string[];
  examPattern: ExamPattern[];
  syllabus: SyllabusSection[];
  testimonials: Testimonial[];
}

export const courses: Record<string, Course> = {
  'bank-po-so': {
    slug: 'bank-po-so',
    title: 'Bank PO / SO Complete Program',
    tagline: 'Your gateway to prestigious banking careers in SBI, IBPS & leading public sector banks',
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1080&q=80',
    overview: 'Comprehensive coaching program designed to help you crack Bank PO and Specialist Officer examinations. Our structured approach covers all sections with focus on precision, logic, and core subject mastery. Join thousands of successful candidates who started their journey with us.',
    eligibility: 'Graduate with minimum 60% marks (45% for reserved categories)',
    duration: '6 Months',
    mode: 'Online Live Classes',
    batch: 'Limited Seats',
    language: 'English / Hindi',
    highlights: [
      'Complete coverage of Prelims & Mains syllabus',
      'Expert faculty with 10+ years of banking exam experience',
      'Daily practice sessions & chapter-wise tests',
      '500+ Mock tests with detailed analysis',
      'Interview preparation & personality development',
      'Current affairs module with monthly compilations'
    ],
    examPattern: [
      {
        stage: 'Preliminary Exam',
        sections: [
          { name: 'English Language', questions: 30, marks: 30, duration: '20 min' },
          { name: 'Quantitative Aptitude', questions: 35, marks: 35, duration: '20 min' },
          { name: 'Reasoning Ability', questions: 35, marks: 35, duration: '20 min' }
        ],
        totalQuestions: 100,
        totalMarks: 100,
        negativeMarking: '0.25 marks per wrong answer'
      },
      {
        stage: 'Mains Exam',
        sections: [
          { name: 'Reasoning & Computer Aptitude', questions: 45, marks: 60, duration: '60 min' },
          { name: 'English Language', questions: 35, marks: 40, duration: '40 min' },
          { name: 'Quantitative Aptitude', questions: 35, marks: 50, duration: '45 min' },
          { name: 'General / Banking Awareness', questions: 40, marks: 40, duration: '35 min' }
        ],
        totalQuestions: 155,
        totalMarks: 200,
        negativeMarking: '0.25 marks per wrong answer'
      }
    ],
    syllabus: [
      {
        title: 'Quantitative Aptitude',
        topics: [
          'Number Series & Simplification',
          'Quadratic Equations',
          'Data Interpretation (Bar, Pie, Line, Tabular)',
          'Profit & Loss, Discount',
          'Ratio & Proportion, Partnership',
          'Time & Work, Pipes & Cisterns',
          'Time, Speed & Distance',
          'Probability & Mensuration',
          'Average, Percentage, Mixtures'
        ]
      },
      {
        title: 'Reasoning Ability',
        topics: [
          'Puzzles (Seating, Box, Floor)',
          'Syllogism & Reverse Syllogism',
          'Inequalities',
          'Coding-Decoding',
          'Blood Relations',
          'Direction Sense',
          'Input-Output',
          'Data Sufficiency',
          'Logical Reasoning & Critical Thinking'
        ]
      },
      {
        title: 'English Language',
        topics: [
          'Reading Comprehension',
          'Cloze Test',
          'Error Spotting',
          'Sentence Improvement',
          'Para Jumbles',
          'Fill in the Blanks',
          'Spelling Correction',
          'Idioms & Phrases',
          'Vocabulary (Synonyms/Antonyms)'
        ]
      },
      {
        title: 'General Awareness',
        topics: [
          'Current Affairs (Last 6 Months)',
          'Banking & Financial Awareness',
          'Static GK (History, Geography, Polity)',
          'Economic News & Budget',
          'RBI Policies & Circulars',
          'National Parks & Wildlife Sanctuaries',
          'Important Days & Themes',
          'Awards & Honors',
          'Sports News'
        ]
      }
    ],
    testimonials: [
      {
        quote: 'The structured approach and expert guidance helped me clear IBPS PO in my first attempt. The mock tests were incredibly close to the actual exam pattern. Forever grateful to the faculty for their constant support.',
        name: 'Priya Sharma',
        role: 'Selected, IBPS PO 2025',
        initials: 'PS'
      },
      {
        quote: 'I was struggling with Quantitative Aptitude before joining this program. The shortcut techniques and daily practice sessions helped me improve significantly. Scored 48/50 in QA in the final exam!',
        name: 'Rajesh Kumar',
        role: 'Selected, SBI PO 2024',
        initials: 'RK'
      },
      {
        quote: 'The interview preparation module was exceptional. Mock interviews with detailed feedback helped me gain confidence. The faculty\'s dedication and comprehensive study material made all the difference.',
        name: 'Anjali Patel',
        role: 'Selected, IBPS SO (IT Officer) 2024',
        initials: 'AP'
      }
    ]
  },

  'dsssb': {
    slug: 'dsssb',
    title: 'DSSSB Delhi Teacher Recruitment',
    tagline: 'Master the DSSSB examination for PRT, TGT & PGT positions in Delhi Government Schools',
    heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1080&q=80',
    overview: 'Focused coaching program for Delhi Subordinate Services Selection Board teacher recruitment examinations. Our program covers all three levels - PRT, TGT, and PGT with specialized pedagogy training and subject-specific preparation aligned with the latest exam patterns.',
    eligibility: 'For PRT: 12th + 2-year D.El.Ed / 4-year B.El.Ed | For TGT: Graduate + B.Ed | For PGT: Post-Graduate + B.Ed',
    duration: '5 Months',
    mode: 'Online Live Classes',
    batch: 'Limited Seats',
    language: 'English / Hindi',
    highlights: [
      'Complete coverage of PRT, TGT & PGT syllabi',
      'Pedagogy & teaching methodology focus',
      'B.Ed. level preparation included',
      'Previous year question analysis',
      'Delhi-specific GK preparation',
      'Mock tests based on latest pattern'
    ],
    examPattern: [
      {
        stage: 'One-Tier Examination (PRT)',
        sections: [
          { name: 'General Awareness', questions: 20, marks: 20, duration: '2 Hours' },
          { name: 'General Intelligence & Reasoning', questions: 20, marks: 20, duration: '' },
          { name: 'Arithmetical & Numerical Ability', questions: 20, marks: 20, duration: '' },
          { name: 'English Language & Comprehension', questions: 20, marks: 20, duration: '' },
          { name: 'Hindi Language & Comprehension', questions: 20, marks: 20, duration: '' },
          { name: 'Subject Concerned (Teaching Methodology)', questions: 100, marks: 100, duration: '' }
        ],
        totalQuestions: 200,
        totalMarks: 200,
        negativeMarking: '0.25 marks per wrong answer'
      },
      {
        stage: 'One-Tier Examination (TGT)',
        sections: [
          { name: 'General Awareness', questions: 20, marks: 20, duration: '2 Hours' },
          { name: 'General Intelligence & Reasoning', questions: 20, marks: 20, duration: '' },
          { name: 'Arithmetical & Numerical Ability', questions: 20, marks: 20, duration: '' },
          { name: 'English Language', questions: 20, marks: 20, duration: '' },
          { name: 'Hindi Language', questions: 20, marks: 20, duration: '' },
          { name: 'Subject Concerned (B.Ed Level)', questions: 100, marks: 100, duration: '' }
        ],
        totalQuestions: 200,
        totalMarks: 200,
        negativeMarking: '0.25 marks per wrong answer'
      },
      {
        stage: 'One-Tier Examination (PGT)',
        sections: [
          { name: 'General Awareness', questions: 20, marks: 20, duration: '2 Hours' },
          { name: 'General Intelligence & Reasoning', questions: 20, marks: 20, duration: '' },
          { name: 'Arithmetical & Numerical Ability', questions: 20, marks: 20, duration: '' },
          { name: 'English Language', questions: 20, marks: 20, duration: '' },
          { name: 'Hindi Language', questions: 20, marks: 20, duration: '' },
          { name: 'Subject Concerned (Post-Graduation Level)', questions: 200, marks: 200, duration: '' }
        ],
        totalQuestions: 300,
        totalMarks: 300,
        negativeMarking: '0.25 marks per wrong answer'
      }
    ],
    syllabus: [
      {
        title: 'General Awareness',
        topics: [
          'Current Affairs (National & International)',
          'History of India & Delhi',
          'Geography of India & Delhi',
          'Indian Polity & Constitution',
          'Economics & Budget',
          'Sports & Games',
          'Art & Culture',
          'Important Days & Events',
          'Environmental Studies'
        ]
      },
      {
        title: 'Teaching Methodology',
        topics: [
          'Child Development & Psychology',
          'Pedagogical Approaches',
          'Learning Theories (Behaviorism, Cognitivism)',
          'Teaching Skills & Techniques',
          'Classroom Management',
          'Assessment & Evaluation',
          'Inclusive Education',
          'Education Technology',
          'NCERT Curriculum Understanding'
        ]
      },
      {
        title: 'Reasoning & Numerical Ability',
        topics: [
          'Analogies & Similarities',
          'Series (Number & Alphabet)',
          'Coding-Decoding',
          'Blood Relations',
          'Direction Sense',
          'Number Systems',
          'Percentages & Averages',
          'Ratio & Proportion',
          'Profit & Loss'
        ]
      }
    ],
    testimonials: [
      {
        quote: 'Cracked DSSSB TGT in my second attempt thanks to this program. The pedagogy section was covered so thoroughly that even complex topics became easy to understand. Highly recommend for all teaching aspirants!',
        name: 'Meera Singh',
        role: 'Selected, DSSSB TGT 2025',
        initials: 'MS'
      },
      {
        quote: 'The Delhi-specific GK module was incredibly helpful. The faculty understood the exam pattern inside out and provided focused preparation. The mock tests closely resembled the actual examination.',
        name: 'Vikram Yadav',
        role: 'Selected, DSSSB PGT 2024',
        initials: 'VY'
      },
      {
        quote: 'As a working professional, the flexible online classes helped me prepare effectively. The recorded sessions were a lifesaver. Now I am a proud government teacher in Delhi!',
        name: 'Sunita Rao',
        role: 'Selected, DSSSB PRT 2024',
        initials: 'SR'
      }
    ]
  },

  'prt-tgt-pgt': {
    slug: 'prt-tgt-pgt',
    title: 'PRT / TGT / PGT Teaching Exams',
    tagline: 'Complete preparation for KVS, NVS & State Teaching Recruitment Examinations',
    heroImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1080&q=80',
    overview: 'Comprehensive coaching for Primary Teacher (PRT), Trained Graduate Teacher (TGT), and Post Graduate Teacher (PGT) examinations across Kendriya Vidyalaya Sangathan, Navodaya Vidyalaya Samiti, and various state teacher recruitment boards.',
    eligibility: 'For PRT: 12th + D.El.Ed / B.El.Ed | For TGT: Graduate + B.Ed | For PGT: Post-Graduate + B.Ed',
    duration: '6 Months',
    mode: 'Online Live Classes',
    batch: 'Limited Seats',
    language: 'English / Hindi',
    highlights: [
      'KVS, NVS & State TET focused curriculum',
      'Two-tier exam preparation (Tier 1 & Tier 2)',
      'Subject-specific pedagogy training',
      'Perspectives on Education & Leadership',
      'Computer literacy module included',
      'Extensive mock test series'
    ],
    examPattern: [
      {
        stage: 'Tier 1 (Screening Test)',
        sections: [
          { name: 'General Reasoning', questions: 20, marks: 60, duration: '2 Hours' },
          { name: 'Numerical Ability', questions: 20, marks: 60, duration: '' },
          { name: 'Basic Computer Literacy', questions: 20, marks: 60, duration: '' },
          { name: 'General Knowledge', questions: 20, marks: 60, duration: '' },
          { name: 'Language Competency (English)', questions: 10, marks: 30, duration: '' },
          { name: 'Language Competency (Hindi)', questions: 10, marks: 30, duration: '' }
        ],
        totalQuestions: 100,
        totalMarks: 300,
        negativeMarking: '1 mark per wrong answer'
      },
      {
        stage: 'Tier 2 (Subject & Interview)',
        sections: [
          { name: 'Subject Concerned', questions: 100, marks: 100, duration: '2.5 Hours' },
          { name: 'Perspectives on Education & Leadership', questions: 40, marks: 40, duration: '' },
          { name: 'Interview/Personality Test', questions: 60, marks: 60, duration: '' }
        ],
        totalQuestions: 200,
        totalMarks: 200,
        negativeMarking: 'No negative marking'
      }
    ],
    syllabus: [
      {
        title: 'General Reasoning & Numerical Ability',
        topics: [
          'Verbal & Non-Verbal Reasoning',
          'Analogies & Classifications',
          'Series Completion',
          'Coding-Decoding',
          'Blood Relations',
          'Number Systems & Operations',
          'Percentages & Profit/Loss',
          'Time & Work, Pipes & Cisterns',
          'Data Interpretation'
        ]
      },
      {
        title: 'Perspectives on Education',
        topics: [
          'Concept of Growth, Maturation & Development',
          'Principles of Child Development',
          'Domains of Development (Physical, Cognitive)',
          'Understanding Adolescence',
          'Learning Theories & Motivation',
          'Assessment & Evaluation Methods',
          'Inclusive Education & Disability',
          'Educational Technology & ICT',
          'Leadership & Governance'
        ]
      },
      {
        title: 'Computer Literacy',
        topics: [
          'Computer Fundamentals',
          'MS Office (Word, Excel, PowerPoint)',
          'Internet & Email',
          'Digital Initiation in Education',
          'Cyber Security Basics',
          'E-Governance',
          'Educational Software & Apps'
        ]
      }
    ],
    testimonials: [
      {
        quote: 'Selected as TGT Mathematics in KVS through this program. The faculty\'s expertise in pedagogy and subject knowledge is unmatched. The mock interviews prepared me thoroughly for the final selection.',
        name: 'Deepak Sharma',
        role: 'Selected, KVS TGT 2025',
        initials: 'DS'
      },
      {
        quote: 'The comprehensive coverage of all topics helped me crack multiple exams - KVS, NVS and my state TET. The Perspectives on Education section was particularly well-structured.',
        name: 'Kavita Verma',
        role: 'Selected, NVS PGT 2024',
        initials: 'KV'
      },
      {
        quote: 'Coming from a science background, the computer literacy module was crucial. The faculty made complex concepts simple and practical. Now teaching in a Kendriya Vidyalaya!',
        name: 'Arun Mishra',
        role: 'Selected, KVS PRT 2024',
        initials: 'AM'
      }
    ]
  },

  'ctet-tet': {
    slug: 'ctet-tet',
    title: 'CTET / TET Complete Preparation',
    tagline: 'Your first step towards becoming a certified teacher in central & state schools',
    heroImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1080&q=80',
    overview: 'Focused preparation for Central Teacher Eligibility Test (CTET) and State Teacher Eligibility Tests (TET). Our program covers both Paper 1 (Classes 1-5) and Paper 2 (Classes 6-8) with comprehensive pedagogy training.',
    eligibility: 'Paper 1: 12th + 2-year D.El.Ed / 4-year B.El.Ed | Paper 2: Graduate + 1-year B.Ed / 4-year B.El.Ed',
    duration: '4 Months',
    mode: 'Online Live Classes',
    batch: 'Limited Seats',
    language: 'English / Hindi',
    highlights: [
      'Both Paper 1 & Paper 2 preparation',
      'Child Development & Pedagogy mastery',
      'Language pedagogy special focus',
      'Math & Science (EVS) concept building',
      'Previous year paper analysis',
      'Weekly mock tests & assessments'
    ],
    examPattern: [
      {
        stage: 'Paper 1 (Classes I to V)',
        sections: [
          { name: 'Child Development & Pedagogy', questions: 30, marks: 30, duration: '2.5 Hours' },
          { name: 'Language I (Compulsory)', questions: 30, marks: 30, duration: '' },
          { name: 'Language II (Compulsory)', questions: 30, marks: 30, duration: '' },
          { name: 'Mathematics', questions: 30, marks: 30, duration: '' },
          { name: 'Environmental Studies (EVS)', questions: 30, marks: 30, duration: '' }
        ],
        totalQuestions: 150,
        totalMarks: 150,
        negativeMarking: 'No negative marking'
      },
      {
        stage: 'Paper 2 (Classes VI to VIII)',
        sections: [
          { name: 'Child Development & Pedagogy', questions: 30, marks: 30, duration: '2.5 Hours' },
          { name: 'Language I (Compulsory)', questions: 30, marks: 30, duration: '' },
          { name: 'Language II (Compulsory)', questions: 30, marks: 30, duration: '' },
          { name: 'Mathematics & Science (OR) Social Studies', questions: 60, marks: 60, duration: '' }
        ],
        totalQuestions: 150,
        totalMarks: 150,
        negativeMarking: 'No negative marking'
      }
    ],
    syllabus: [
      {
        title: 'Child Development & Pedagogy',
        topics: [
          'Concept of Development & its Characteristics',
          'Principles of Child Development',
          'Piaget, Kohlberg & Vygotsky Theories',
          'Learning & Motivation',
          'Child Thinking & Reasoning',
          'Assessment & Evaluation',
          'Inclusive Education',
          'Understanding Children with Special Needs',
          'Learning Disabilities'
        ]
      },
      {
        title: 'Language Development',
        topics: [
          'Principles of Language Teaching',
          'Language Acquisition',
          'Multi-linguistic Environment',
          'Reading & Writing Skills',
          'Remedial Teaching',
          'Grammar & Vocabulary',
          'Storytelling & Poetry',
          'Questioning & Communication',
          'Language Errors Analysis'
        ]
      },
      {
        title: 'Mathematics & EVS',
        topics: [
          'Numbers & Place Value',
          'Operations & Mental Math',
          'Fractions, Decimals & Percentages',
          'Geometry & Spatial Understanding',
          'Measurement & Data Handling',
          'Environmental Studies',
          'History & Geography',
          'Science & Technology',
          'Teaching Methodology for Math & EVS'
        ]
      }
    ],
    testimonials: [
      {
        quote: 'Cleared CTET in my first attempt with 98/150 marks! The pedagogy section was explained so well that even complex theories became easy. The language teaching methodology was particularly helpful.',
        name: 'Neha Gupta',
        role: 'Qualified CTET 2025 (Paper 1 & 2)',
        initials: 'NG'
      },
      {
        quote: 'I had attempted CTET twice before but failed. This program changed my approach completely. The focus on understanding concepts rather than rote learning made all the difference. Now teaching in a KVS school!',
        name: 'Suresh Patel',
        role: 'Qualified CTET & Selected at DSSSB 2024',
        initials: 'SP'
      },
      {
        quote: 'The mock tests were incredibly close to the actual exam pattern. The detailed feedback helped me identify my weak areas. Scored 110/150 in Paper 1 and 105/150 in Paper 2!',
        name: 'Lakshmi Devi',
        role: 'Qualified CTET Paper 1 & 2, 2025',
        initials: 'LD'
      }
    ]
  },

  'ugc-net-jrf': {
    slug: 'ugc-net-jrf',
    title: 'UGC NET / JRF Complete Program',
    tagline: 'Your path to Assistant Professorship and Junior Research Fellowship',
    heroImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1080&q=80',
    overview: 'Comprehensive coaching for UGC NET examination to qualify for Assistant Professor and earn Junior Research Fellowship (JRF). Our program covers both Paper 1 (General Aptitude) and Paper 2 (Subject-Specific) with research methodology training.',
    eligibility: 'Master\'s degree with minimum 55% marks (50% for SC/ST/OBC/PwD) | JRF: Max 30 years age',
    duration: '8 Months',
    mode: 'Online Live Classes',
    batch: 'Limited Seats',
    language: 'English / Hindi',
    highlights: [
      'Paper 1 complete coverage (10 units)',
      '85+ subjects for Paper 2',
      'Research methodology training',
      'Previous year question analysis',
      'JRF-focused preparation strategy',
      'Answer writing practice for Assistant Professor'
    ],
    examPattern: [
      {
        stage: 'Paper 1 (General Aptitude)',
        sections: [
          { name: 'Teaching Aptitude', questions: 5, marks: 10, duration: '1 Hour' },
          { name: 'Research Aptitude', questions: 5, marks: 10, duration: '' },
          { name: 'Comprehension', questions: 5, marks: 10, duration: '' },
          { name: 'Communication', questions: 5, marks: 10, duration: '' },
          { name: 'Mathematical Reasoning', questions: 5, marks: 10, duration: '' },
          { name: 'Logical Reasoning', questions: 5, marks: 10, duration: '' },
          { name: 'Data Interpretation', questions: 5, marks: 10, duration: '' },
          { name: 'ICT', questions: 5, marks: 10, duration: '' },
          { name: 'People & Environment', questions: 5, marks: 10, duration: '' },
          { name: 'Higher Education System', questions: 5, marks: 10, duration: '' }
        ],
        totalQuestions: 50,
        totalMarks: 100,
        negativeMarking: 'No negative marking'
      },
      {
        stage: 'Paper 2 (Subject-Specific)',
        sections: [
          { name: 'Subject Concerned (85 subjects available)', questions: 100, marks: 200, duration: '2 Hours' }
        ],
        totalQuestions: 100,
        totalMarks: 200,
        negativeMarking: 'No negative marking'
      }
    ],
    syllabus: [
      {
        title: 'Paper 1 - Teaching & Research Aptitude',
        topics: [
          'Concept, Objectives & Levels of Teaching',
          'Characteristics of Learning',
          'Evaluation Systems',
          'Research: Meaning, Types & Methods',
          'Research Ethics & Paper Publication',
          'Thesis & Dissertation Writing',
          'Survey & Case Study Methods',
          'Sampling & Data Collection',
          'Hypothesis Testing'
        ]
      },
      {
        title: 'Paper 1 - Reasoning & Communication',
        topics: [
          'Logical Deduction & Venn Diagrams',
          'Analogies & Classifications',
          'Number Series & Letter Series',
          'Codes & Decoding',
          'Data Sufficiency',
          'Bar Graphs & Pie Charts',
          'Tables & Line Graphs',
          'Ratio & Percentage Analysis',
          'Communication: Types & Barriers'
        ]
      },
      {
        title: 'Paper 1 - ICT & Higher Education',
        topics: [
          'Internet & World Wide Web',
          'E-Learning & Digital Initiatives',
          'MS Office Applications',
          'Educational Technology',
          'Governance, Polity & Administration',
          'Policies & Reforms in Higher Education',
          'Right to Education Act',
          'National Education Policy 2020',
          'Universities & College System'
        ]
      }
    ],
    testimonials: [
      {
        quote: 'Cleared UGC NET with JRF in my first attempt! The Paper 1 preparation was exceptional - every unit was covered in depth. The research methodology module gave me a solid foundation for my PhD journey.',
        name: 'Dr. Amit Kumar',
        role: 'Qualified UGC NET JRF 2025',
        initials: 'AK'
      },
      {
        quote: 'The answer writing practice sessions were invaluable. The faculty\'s feedback helped me improve my writing style significantly. Now an Assistant Professor at a central university!',
        name: 'Dr. Sneha Reddy',
        role: 'Qualified UGC NET & Assistant Professor 2024',
        initials: 'SR'
      },
      {
        quote: 'Working professionals need flexible learning options. The recorded lectures and weekend batches helped me prepare without affecting my job. Scored 180/200 in Paper 2 (Commerce)!',
        name: 'Ravi Shankar',
        role: 'Qualified UGC NET Paper 2 (Commerce) 2024',
        initials: 'RS'
      }
    ]
  },

  'interview-prep': {
    slug: 'interview-prep',
    title: 'Government Job Interview Mastery',
    tagline: 'Transform your interview performance and land your dream government job',
    heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&q=80',
    overview: 'Specialized program to crack government job interviews for Banking, SSC, UPSC, State PSCs, Teaching positions, and PSUs. Master the art of presenting yourself confidently with comprehensive DAF preparation, mock interviews, and body language training.',
    eligibility: 'Candidates who have cleared written examination for government job recruitment',
    duration: '2 Months',
    mode: 'Online Live Classes',
    batch: 'Limited Seats',
    language: 'English / Hindi',
    highlights: [
      'DAF (Detailed Application Form) preparation',
      'Mock interview sessions with feedback',
      'Body language & grooming training',
      'Current affairs for interview focus',
      'Situational judgment training',
      'Personality development sessions'
    ],
    examPattern: [
      {
        stage: 'Interview Components',
        sections: [
          { name: 'Personal Background Assessment', questions: 0, marks: 20, duration: 'Variable' },
          { name: 'Academic Knowledge', questions: 0, marks: 25, duration: '' },
          { name: 'Current Affairs & General Knowledge', questions: 0, marks: 25, duration: '' },
          { name: 'Personality & Communication', questions: 0, marks: 20, duration: '' },
          { name: 'Situational Judgment', questions: 0, marks: 10, duration: '' }
        ],
        totalQuestions: 0,
        totalMarks: 100,
        negativeMarking: 'N/A'
      }
    ],
    syllabus: [
      {
        title: 'DAF Preparation',
        topics: [
          'Hometown & State Analysis',
          'Educational Background Deep Dive',
          'Hobby & Interest Exploration',
          'Current/Past Work Experience',
          'Family Background Preparation',
          'Strengths & Weaknesses Articulation',
          'Why This Service/Department',
          'Choice of Subject/Optional',
          'Current Affairs Related to DAF'
        ]
      },
      {
        title: 'Interview Skills',
        topics: [
          'STAR Method for Behavioral Questions',
          'Answer Structuring Techniques',
          'Handling Difficult Questions',
          'Multi-round Interview Preparation',
          'Group Discussion Techniques',
          'Effective Communication Skills',
          'Body Language & Posture',
          'Eye Contact & Hand Gestures',
          'Dress Code & Grooming'
        ]
      },
      {
        title: 'Subject-Specific Preparation',
        topics: [
          'Current Affairs (Last 6-12 Months)',
          'Government Schemes & Policies',
          'International Relations',
          'Economic Developments',
          'Science & Technology Updates',
          'Environmental Issues',
          'Social Issues & Justice',
          'Constitutional Values',
          'Department-Specific Knowledge'
        ]
      }
    ],
    testimonials: [
      {
        quote: 'Appeared for 4 bank interviews before joining this program. After the mock interview sessions and feedback, I cleared my 5th interview and got selected as PO in SBI! The transformation was remarkable.',
        name: 'Rahul Verma',
        role: 'Selected, SBI PO 2025',
        initials: 'RV'
      },
      {
        quote: 'The mock interviews were conducted exactly like real UPSC interviews. The board feedback was so authentic that I felt prepared for every possible question. Scored 185/275 in my final interview!',
        name: 'Priya Nair',
        role: 'Selected, UPSC CSE 2024',
        initials: 'PN'
      },
      {
        quote: 'As a first-generation government employee, I had no idea how to present myself. This program taught me everything - from dressing to speaking. The mock sessions built my confidence manifold.',
        name: 'Mohammed Ali',
        role: 'Selected, SSC CGL 2024',
        initials: 'MA'
      }
    ]
  }
};

export const courseList = Object.values(courses);

export function getCourseBySlug(slug: string): Course | undefined {
  return courses[slug];
}

export function getAllCourseSlugs(): string[] {
  return Object.keys(courses);
}
