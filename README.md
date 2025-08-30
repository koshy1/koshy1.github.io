# Bethel Community Website

A vanilla HTML/CSS/JS rebuild of the Bethel Community Presbyterian Church website.

## Site Analysis

### Original WordPress Site: https://bethelcommunitysl.org

**Site Purpose**: Progressive Presbyterian church website focused on community, social justice, and inclusion.

### Extracted Content Structure

#### Main Navigation
- **About** (with submenu)
  - Our Story - Church history from 1955 merger to present
  - Our Values - Justice-oriented, open and affirming principles
  - Staff and Elders - Leadership team and contact information
- **Gather** - Worship schedules and gathering information
- **Partners** - Community partnerships and collaborations
- **Give** - Donation options and ministry support
- **Resources** - Spiritual materials and community resources
- **Contact** - Contact forms, address, and connection card

#### Detailed Content Extracted

**Homepage Core Content:**
- Main heading: "Beth-el: House of God."
- Mission: "We believe that church is meant to be more than an institution, a building, or belief system."
- Community vision: "We are a community reimagining church around God's great welcome table."
- Identity: "Bethel Community is a justice-oriented, open and affirming PC(USA) church"
- Core sections: "A Spiritual Family..." and "Centered on Jesus..."

**Worship Information:**
- Sunday Gathering: 10AM Worship Service
- Hybrid format: In-person 2nd and 4th Sundays, Zoom on alternating Sundays
- Midweek Gatherings: Prayer groups + Topical Discussions

**Contact Details:**
- Address: 14235 Bancroft Avenue, San Leandro, CA 94578
- Phone: (510) 357-4130
- General email: info@bethelcommunitySL.org
- Leadership: Erina Kim-Eubanks (erina@bethelcommunitysl.org), Michael Kim-Eubanks (michael@bethelcommunitysl.org)

**Historical Context:**
- Founded from merger of two churches in 1955
- Over 300 members originally with thriving ministries
- Rev. Sarah Reyes Gibbs led redevelopment in 1998
- Started San Leandro Community Food Pantry
- Partnership with First Presbyterian Church of Hayward (approved 2019)
- Current co-ministry leaders: Michael and Erina Kim-Eubanks

### Design Characteristics
- **Layout**: Clean, modern, grid-based responsive design
- **Color Scheme**: Professional, neutral tones (likely earth tones/blues)
- **Typography**: Clean, accessible fonts
- **Imagery**: High-quality photos emphasizing community and diversity
- **Mobile-first**: Responsive design with mobile navigation

### Interactive Features
- Newsletter email signup
- Mobile hamburger menu
- Dropdown navigation menus
- Sermon audio integration
- Social media links
- Contact forms

### Technical Requirements
- Semantic HTML5 structure
- Responsive CSS (mobile-first)
- Accessible navigation
- Form handling for newsletter signup
- Image optimization
- Progressive enhancement with vanilla JavaScript

## Project Structure

```
bethel_community_website/
├── index.html                 # Homepage with hero, mission, gatherings, newsletter
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   └── main.js           # Main JavaScript file
│   └── images/               # Site images and graphics
├── pages/                    # Additional HTML pages
│   ├── our-story.html        # Church history and founding story
│   ├── our-values.html       # Core values and principles
│   ├── staff-elders.html     # Leadership team and contact info
│   ├── gather.html           # Worship times and gathering info
│   ├── partners.html         # Community partnerships and collaborations
│   ├── give.html             # Donation options and ministry support
│   ├── resources.html        # Spiritual resources and materials
│   └── contact.html          # Contact information and connection form
└── README.md                 # This file
```

### File Status
✅ **Created Files:**
- `index.html` - Complete with extracted homepage content
- `pages/our-story.html` - Church history and founding narrative
- `pages/our-values.html` - Core values and principles
- `pages/staff-elders.html` - Leadership team information
- `pages/gather.html` - Worship schedules and gathering details
- `pages/contact.html` - Contact information and connection form
- `pages/partners.html` - Community partnerships
- `pages/give.html` - Donation and giving information
- `pages/resources.html` - Spiritual resources and materials

All pages use semantic HTML5 structure with proper header, nav, main, section, article, and footer elements.

## Development Guidelines

### HTML Structure
- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Implement proper heading hierarchy (h1-h6)
- Include appropriate ARIA labels and accessibility features
- Use descriptive alt text for images

### CSS Approach
- Mobile-first responsive design
- CSS Grid and Flexbox for layouts
- CSS custom properties for consistent theming
- Progressive enhancement approach
- Optimize for performance and accessibility

### JavaScript Features
- Mobile navigation toggle
- Form validation and submission
- Smooth scrolling navigation
- Progressive enhancement (site works without JS)

## Content Strategy

### Target Audience
- Current and prospective church members
- Community members interested in social justice
- People seeking inclusive spiritual community
- Local residents looking for community engagement

### Key Messages
- Welcoming and inclusive community
- Progressive Presbyterian values
- Social justice commitment
- Accessible worship options (in-person and online)
- Community-centered approach to faith

## Next Steps

1. Create base CSS file with responsive grid system
2. Implement mobile navigation with JavaScript
3. Create individual page templates
4. Add form handling for newsletter signup
5. Optimize images and implement lazy loading
6. Test accessibility and performance
7. Set up deployment pipeline

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers