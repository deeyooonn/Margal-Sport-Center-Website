# 🏀 Margal Sports Center Website

> Premium, private, and state-of-the-art athletic booking platform.
> **"Your Game, Your Rules!"**

Welcome to the official repository for the **Margal Sports Center** web platform. Designed to offer a premium digital experience for ballers, athletes, and the local community in Brgy. Cambaog, Bustos, Bulacan, Philippines. 

This platform enables frictionless online bookings, event coordination, and highlights the premium hardwood facility.

---

## 🌟 Brand Values & Identity
* **Exclusive:** Private court rentals—no waiting, no strangers, just pure game time.
* **Clean & Safe:** Fully maintained, premium athletic facilities.
* **Community-Focused:** Bringing the local "Ka-Margal" community together.
* **Open Daily:** 8:00 AM - 12:00 MN
* **Contact:** 0921 663 8243

---

## 🎨 Visual Identity & Theme
Following the official Margal Sports Center Brand Book, the website matches the athletic tri-color scheme with smooth gradients and glassmorphism:
*   🔷 **Athletic Navy (`#1A3673`)** - Base branding, headers, and primary court styling.
*   🔴 **Court Crimson (`#C1272D`)** - Call-to-action buttons ("BOOK NOW") and high-energy highlights.
*   🟡 **Hardwood Gold (`#F1C40F`)** - Accent overlays, promo badges, and special announcements.
*   ⚪ **Pure White (`#FFFFFF`)** - Dynamic contrasting typography.

---

## 🚀 Key Features
1. **Interactive Hero Section:** Sleek modern landing showcasing physical court images, real-time status, and energetic call-to-actions.
2. **Seamless Booking Engine (`/book`):** A custom calendar and slot selector to reserve exclusive court times without conflicts.
3. **Local Events & Tournaments (`/events`):** Highlighting upcoming leagues, community clinics, and local basketball activities.
4. **Secure User Authentication (`/login`, `/signup`):** User accounts to track past and future court bookings.
5. **Theme Support:** Custom Theme Provider for dynamic rendering.

---

## 💻 Tech Stack
*   **Core:** React 18 & TypeScript
*   **Build Tool:** Vite 5 (Supercharged HMR)
*   **Styling:** Tailwind CSS & PostCSS (Curated athletic palettes)
*   **Animations:** Framer Motion (Premium micro-interactions and transitions)
*   **Routing:** React Router DOM v6
*   **Notifications:** Sonner (Toast notifications)
*   **Icons:** Lucide React

---

## 📁 Directory Structure
```
├── src/
│   ├── components/       # Reusable components (Header, Footer, Layout, Menu)
│   ├── contexts/         # ThemeContext for design state
│   ├── docs/             # Official Brand Book & documentation
│   ├── pages/            # Core views (Landing, Booking, Events, Login, Signup)
│   ├── App.tsx           # App Router & Layout Shell
│   ├── index.css         # Tailwind & custom global styling
│   └── index.tsx         # Mount node
├── index.html            # Entry HTML template
├── tailwind.config.js    # Curated tailwind configuration
└── vite.config.ts        # Vite plugins and build settings
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/deeyooonn/Margal-Sport-Center-Website.git
   cd "Margal Sports Center Website"
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
To generate the highly optimized and minified production bundles:
```bash
npm run build
```
This builds static assets into the `dist/` folder, ready for deployment.

---

## 📄 License
This project is private and exclusive to **Margal Sports Center**. All rights reserved.
