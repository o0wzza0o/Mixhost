# Mix Host Website

A modern, responsive portfolio website for Mix Host - a digital agency providing web development, mobile apps, and design services.

## 🌐 Live Website

**Domain:** [mix-app.online](https://mix-app.online)

**GitHub Pages:** [o0wzza0o.github.io/Mixhost](https://o0wzza0o.github.io/Mixhost)

---

## 📁 Project Structure

```
mix-hots/
├── index.html              # Main homepage
├── CNAME                   # Domain configuration (mix-app.online)
├── logo.glb                # 3D logo model for hero section
├── README.md               # This documentation file
│
├── assets/
│   ├── css/
│   │   ├── style.css       # Main stylesheet (44KB)
│   │   └── home.css        # Homepage-specific styles
│   │
│   ├── js/
│   │   ├── home.js         # Main homepage functionality
│   │   ├── starfield.js    # Three.js starfield animation
│   │   └── view.js         # 3D model viewer helper
│   │
│   ├── data/
│   │   ├── team.json       # Team members data
│   │   ├── services.json   # Services & tech stack data
│   │   └── admin.json      # Admin configuration
│   │
│   └── images/
│       ├── mix-host.png           # Main logo
│       ├── mix-host-removebg-preview.png
│       ├── wzza.png               # Team member photo
│       ├── salma.png              # Team member photo
│       ├── Sharif Gomaa.png       # Team member photo
│       └── ZIEX.jpeg              # Team member photo
│
└── .vscode/                # VS Code settings
```

---

## 🎨 Features

### 1. Hero Section
- **3D Animated Logo**: Uses `model-viewer` with `logo.glb` file
- Auto-rotating 3D model (120deg per second)
- Typewriter text animation with looping effect
- Floating particle animation

### 2. Team Section (`#Team`)
Dynamic team tree layout loaded from `assets/data/team.json`

**Current Team Members:**

| Name | Role | Color Theme |
|------|------|-------------|
| Wzza Almkseky | Full Stack Developer | #00d4ff (Cyan) |
| Salma Amin | Flutter Developer & UI/UX Designer | #a80003 (Red) |
| Sherif Gomaa | Designer | #a259ff (Purple) |
| Ahmed Mohamed | Front-end Developer & Editor | #ff6b6b (Pink) |

**Skills Displayed:**
- Wzza: JavaScript, PHP, C#, Dart, Flutter, C++, Node.js
- Salma: Dart, Flutter, UI/UX, Editing, Design
- Sherif: UI/UX, Editing, Design
- Ahmed: HTML, CSS, JavaScript, Editor

### 3. Services Section (`#Services`)
Infinite scrolling carousel with dual tracks:

**Track 1 - Services:**
Web Development, Mobile Apps, Game Development, FiveM Scripts, Windows Apps, System Creation, E-Commerce, Cross Platform Apps, RESTful APIs, Database Design, Desktop Software, Backend Systems, Frontend Design, Custom Dashboards, Data Science, Machine Learning, Web Scraping, Automation Scripts

**Track 2 - Tech Stack:**
C/C++, C#, Dart, Flutter, JavaScript, Java, MySQL, MongoDB, React, Next.js, Python

### 4. Stats Section (`#About`)
- 66+ Projects Completed
- 50+ Happy Clients
- 7+ Years Experience
- 99% Commitment

### 5. Contact Section (`#Contact`)
- Email: info@mix-host.in
- WhatsApp: +20 100 325 2844
- Discord: Join Our Server

### 6. Footer
- Quick Links navigation
- Social media icons (Facebook, Twitter/X, Instagram, TikTok)
- Brand tagline: "Turning your ideas into content you can't ignore."

---

## 🚀 Technical Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Custom styling with CSS variables
- **Vanilla JavaScript** - No frameworks
- **Font Awesome 7.0.1** - Icons
- **Google Model Viewer** - 3D model display
- **Three.js** - Starfield animation

### External Libraries (CDN)
```html
<!-- Font Awesome -->
https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css

<!-- Model Viewer (for 3D logo) -->
https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js
```

---

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

### Mobile Features
- Hamburger menu (logo click toggles navigation)
- Collapsible left/right navigation
- Touch-friendly interface

---

## 🎭 Animations & Effects

### 1. Typewriter Effect
- Character-by-character text reveal
- 100ms typing delay
- 2000ms pause after completion
- 50ms delete delay
- Infinite loop

### 2. Starfield Background
- Three.js powered particle system
- 3000 stars
- Star colors: white, blue, purple, yellow
- Connection lines between nearby stars (max distance: 70)
- Mouse parallax effect
- Responsive to window resize

### 3. Scroll Reveal
- Elements fade in when scrolled into view
- Intersection Observer API
- Staggered animations for child elements

### 4. Navbar Scroll Effect
- Background blur on scroll (>80px)
- Smooth transition

### 5. Team Tree Animation
- Branch lines grow from center trunk
- Cards slide in from sides
- Staggered delay per member

### 6. Services Carousel
- Infinite horizontal scroll
- Dual track design
- Pause on hover
- Smooth CSS animation

---

## 📝 Data Files

### team.json
Structure for team member data:
```json
{
    "name": "Member Name",
    "role": "Job Title",
    "roleIcon": "fa-solid fa-icon",
    "photo": "assets/images/photo.png",
    "color": "#hexcolor",
    "skills": [
        {"icon": "fa-brands fa-icon", "label": "Skill Name"}
    ],
    "projectsUrl": "optional-project-page.html"
}
```

### services.json
Structure for services and tech stack:
```json
{
    "track1": [
        {"name": "Service Name", "icon": "fa-solid fa-icon"}
    ],
    "track2": [
        {"name": "Technology", "icon": "fa-brands fa-icon"}
    ]
}
```

### admin.json
Admin configuration:
```json
{
    "password": "admin123"
}
```

---

## 🎯 Key JavaScript Functions

### home.js
- `loadTeam()` - Renders team tree from JSON
- `loadServices()` - Renders services carousel
- `setupScrollSpy()` - Active nav link highlighting
- `typeText()/deleteText()` - Typewriter animation
- `animateValue()` - Number counter animation

### starfield.js
- `initStarfield()` - Three.js scene setup
- `createStars()` - Generate star particles
- `animate()` - Animation loop
- `onMouseMove()` - Parallax effect

### view.js
- `initModelViewer()` - 3D model viewer helper

---

## 🌟 CSS Variables (Custom Properties)

```css
:root {
    --primary: #00d4ff;
    --accent: #a259ff;
    --text: #ffffff;
    --bg: #0a0a0a;
    --glass: rgba(255, 255, 255, 0.05);
    --radius: 20px;
    --transition: all 0.3s ease;
}
```

---

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `main` branch
4. Website auto-deploys to `username.github.io/repo-name`

### Custom Domain
1. Add `CNAME` file with domain name
2. Configure DNS A records to GitHub Pages IPs:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
3. Enable HTTPS in repository settings

---

## 🛠️ Development

### Local Development
```bash
# Clone repository
git clone https://github.com/o0wzza0o/Mixhost.git

# Navigate to project
cd Mixhost

# Open in VS Code
code .

# Serve locally (using Python)
python -m http.server 8080

# Or using Node.js
npx serve .
```

### File Watcher
VS Code settings included for auto-save and live server.

---

## 📸 Screenshots

### Desktop View
- Full navigation with all links
- 3D animated hero section
- Team tree visualization
- Services carousel

### Mobile View
- Collapsible hamburger menu
- Stacked layout
- Touch-optimized buttons

---

## 🔒 Security

- No backend server required (static site)
- Admin password stored in plain JSON (for demo purposes)
- No sensitive data in repository

---

## 📝 License

© 2026 Mix Host. All rights reserved.

---

## 👥 Credits

- **Wzza Almkseky** - Lead Developer
- **Salma Amin** - UI/UX Designer
- **Sherif Gomaa** - Graphic Designer
- **Ahmed Mohamed** - Frontend Developer

---

## 📞 Contact

- Website: [mix-app.online](https://mix-app.online)
- Email: info@mix-host.in
- WhatsApp: +20 100 325 2844

---

## 🔄 Version History

### Current Version
- Added 3D logo animation
- Implemented starfield background
- Created dynamic team tree
- Added services carousel
- Responsive mobile design

---

**Last Updated:** May 2026
