# Testing Checklist - Phase 1.6 & 1.7

## Browser Compatibility Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet

---

## Functional Testing

### Homepage (/)
- [ ] Hero section displays correctly
- [ ] ProgramsScrollable centers Young Scholar card on load
- [ ] Navigation arrows work
- [ ] Touch swipe works on mobile
- [ ] "View Our Programs" button scrolls to programs section
- [ ] Testimonials carousel auto-scrolls
- [ ] Contact form submits successfully
- [ ] All links navigate correctly

### Young Scholar Page (/young-scholar)
- [ ] Hero section loads with correct badges
- [ ] Program overview cards display
- [ ] Skills continuous scroll animation works
- [ ] Skills scroll pauses on hover
- [ ] Program details show correct info (₹999, Weekend, Online)
- [ ] FAQ accordion expands/collapses
- [ ] Enrollment CTA buttons work
- [ ] Contact form pre-fills with "young-scholar" interest

### Programs Page (/programs)
- [ ] Programs hero displays
- [ ] Government Competitive Exams card shows all 10 courses
- [ ] Each course is clickable (links to detail page)
- [ ] "Contact for Pricing" badge shows for all courses
- [ ] "Online (Live Classes)" mode displays
- [ ] Program features section displays
- [ ] CTA buttons work

### About Page (/about)
- [ ] About hero with image displays
- [ ] Our Foundation cards (Mission, Vision, Founder) display
- [ ] Stats section shows numbers correctly
- [ ] Team section displays with dark background
- [ ] All sections have proper spacing

### Contact Page (/contact)
- [ ] Contact hero displays
- [ ] Contact form validates inputs
- [ ] Program interest dropdown includes all options
- [ ] Form submission works
- [ ] Success/error messages display
- [ ] Contact info shows correct details (no physical address)
- [ ] Counselling CTA button works

### Course Detail Pages (/courses/[slug])
- [ ] Course hero displays
- [ ] Course details show "Online (Live Classes)" mode
- [ ] Faculty section displays
- [ ] Testimonials show
- [ ] Counselling CTA works

---

## Responsive Testing

### Breakpoints to Test
- [ ] Mobile (320px - 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Large Desktop (1440px+)

### Components to Verify
- [ ] Header navigation (mobile menu)
- [ ] Hero sections (text sizing, spacing)
- [ ] Card grids (responsive columns)
- [ ] Forms (input widths, button sizing)
- [ ] Scrollable sections (touch support)
- [ ] Footer (responsive layout)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Escape closes modals/menus
- [ ] Enter/Space activates buttons
- [ ] Arrow keys for carousels

### Screen Reader
- [ ] All images have alt text
- [ ] ARIA labels on interactive elements
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Form labels associated correctly
- [ ] Error messages announced

### Visual Accessibility
- [ ] Color contrast ratios meet WCAG AA (4.5:1)
- [ ] Text readable on all backgrounds
- [ ] Focus states visible
- [ ] No text-only information in colors

---

## Performance Testing

### Metrics to Check
- [ ] Lighthouse score > 90
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Total page size < 3 MB
- [ ] Time to Interactive < 3.8s

### Optimizations Verified
- [ ] Images use Next/Image
- [ ] Lazy loading for below-fold content
- [ ] Code splitting enabled
- [ ] No console errors
- [ ] No memory leaks

---

## Content Verification

### Homepage
- [ ] "Established Since 1990" badge
- [ ] "34+ Years of Excellence in Education"
- [ ] All program cards display correctly
- [ ] Testimonials show only positive reviews

### Young Scholar Page
- [ ] All 5 skills covered
- [ ] Fee: ₹999
- [ ] Mode: Online (Live Classes)
- [ ] Schedule: Weekend program
- [ ] Age: Class 4-8

### Programs Page
- [ ] 10 courses listed: IBPS PO, IBPS Clerk, SBI PO, SSC CGL, SSC CHSL, Railway, Police, UPPSC, NET, PCS
- [ ] All show "Contact for Pricing"
- [ ] All show "Online (Live Classes)"
- [ ] No IAS/IPS courses

### About Page
- [ ] Team members display
- [ ] Mission, Vision, Founder's Note cards
- [ ] Stats accurate

### Contact Page
- [ ] Phone: 9910335093
- [ ] No physical address (Online only)
- [ ] Location: "Online Classes (Live) - Available across India"

---

## SEO Verification

### Meta Tags
- [ ] Each page has unique title
- [ ] Each page has description
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Keywords defined

### URLs
- [ ] Clean, descriptive URLs
- [ ] No broken links
- [ ] Proper routing

---

## Build & Deployment

### Pre-Deployment
- [ ] `npm run build` succeeds
- [ ] No build warnings/errors
- [ ] All pages generate successfully
- [ ] Static pages optimized
- [ ] Bundle size acceptable

### Deployment
- [ ] Deploy to Vercel
- [ ] Production URL working
- [ ] SSL certificate active
- [ ] All routes accessible
- [ ] Forms work in production

---

## Post-Launch Monitoring

### Week 1
- [ ] Monitor error logs
- [ ] Check analytics setup
- [ ] Verify form submissions
- [ ] Monitor page load times
- [ ] Check mobile usage

### Ongoing
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Content updates as needed
- [ ] Bug fixes

---

**Status:** Phase 1.6 Complete
**Next:** Phase 1.7 - Testing & Launch
