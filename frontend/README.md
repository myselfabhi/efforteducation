# Effort Education - Frontend

A modern, responsive frontend for the Effort Education platform built with Next.js 15, React 19, and TypeScript.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Animations:** Custom CSS keyframes, IntersectionObserver
- **Form Handling:** React Hook Form with Zod validation

## ✨ Features

### Mobile-First Design
- Premium mobile UX with bottom navigation bar
- Swipe carousels for one-card-at-a-time navigation
- Touch-optimized interactions (44px+ touch targets)
- Responsive layouts across all breakpoints (320px - 1920px+)

### Performance Optimizations
- Static page generation for fast load times
- Image optimization with fallback support
- Code splitting and lazy loading
- Scroll-triggered animations (ScrollReveal)

### User Experience
- Smooth micro-interactions and hover effects
- Glassmorphism design elements
- Gradient animations and transitions
- Toast notifications for user feedback

## 📁 Project Structure

```
src/
├── app/
│   ├── about/          # About Us page
│   ├── contact/        # Contact page
│   ├── courses/        # Course listing and details
│   ├── programs/       # Programs page
│   ├── young-scholar/  # Young Scholar Program (Hero Product)
│   ├── components/
│   │   ├── common/     # Shared components
│   │   ├── forms/      # Form components
│   │   ├── layout/     # Header, Footer
│   │   ├── mobile/     # Mobile-specific components
│   │   ├── sections/   # Page sections
│   │   └── ui/         # shadcn/ui components
│   └── globals.css     # Global styles and animations
└── lib/
    ├── api.ts          # API utilities
    ├── utils.ts        # Helper functions
    └── validations.ts  # Zod schemas
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🎨 Key Components

### Mobile Components
- **BottomNavigation:** Mobile-only navigation bar
- **FloatingActionButton:** Quick contact access
- **SwipeCarousel:** One-card-at-a-time swipe carousel
- **ScrollReveal:** Scroll-triggered animations

### Layout Components
- **Header:** Responsive navigation with mobile/desktop variants
- **Footer:** Compact mobile layout, full desktop layout

### Page Sections
- **Hero:** Animated hero sections with gradient text
- **ProgramsScrollable:** Horizontal scrolling program cards
- **Testimonials:** Student testimonials carousel
- **WantToConnect:** Animated CTA section

## 📱 Responsive Breakpoints

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (sm - lg)
- **Desktop:** ≥ 1024px (lg+)

## 🎯 Key Pages

- **Home (`/`):** Hero, Programs, Testimonials, CTA
- **About (`/about`):** Mission, Vision, Stats, Team, Features
- **Programs (`/programs`):** Program categories and listings
- **Young Scholar (`/young-scholar`):** Hero product program details
- **Contact (`/contact`):** Contact form and information
- **Courses (`/courses/[slug]`):** Individual course details

## 🔧 Development

### Code Style
- ESLint for code quality
- Prettier for formatting
- TypeScript strict mode enabled
- Consistent component structure

### Build Process
- Static generation for most pages
- Dynamic routes for course details
- Optimized bundle sizes

## 📝 Notes

- Established since 1990
- Focus on competitive exam preparation and life skills
- Young Scholar Program is the hero product (Class 4-8)

## 📄 License

All rights reserved. Effort Education © 2025–2026
