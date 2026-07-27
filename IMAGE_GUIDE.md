# 🖼️ Image Replacement Guide

This guide details all the image slots used in your portfolio website. All images are tagged in `index.html` with explicit HTML comments (`<!-- IMAGE LINK SLOT: ... -->`).

---

## 📍 How to Replace Images

You can replace any image in two ways:

1. **Option A: Replace local image files**
   Place your new image files inside the `images/` or `assets/images/` directory using the file names listed below.

2. **Option B: Replace Image URLs directly in `index.html`**
   Open `index.html` and search for the comment `<!-- IMAGE LINK SLOT: ... -->`. Change the `src="..."` attribute of the `<img>` tag to your image link (e.g. `src="https://yourdomain.com/photo.jpg"` or `src="images/my-photo.jpg"`).

---

## 📸 Complete List of Image Slots

### 1. Hero & Profile Avatar
- **Location**: Home Page (`#home-view`)
- **HTML Element**: `<img src="images/profile.png" alt="Muhammad Haroon" class="profile-img">`
- **Recommended Size**: `800 x 800 px` (Square or Portrait)
- **Description**: Main profile picture displayed inside the circular glow frame on the hero section.

---

### 2. About Me Picture
- **Location**: About Page (`#about-view`)
- **HTML Element**: `<img src="images/image.png" alt="Muhammad Haroon - About">`
- **Recommended Size**: `800 x 1000 px` (Portrait)
- **Description**: About Me feature photo displayed on the left side of the About page.

---

### 3. Project Showcase Thumbnails
All project cards are located on the **Projects Showcase Page** (`#projects-view`) inside the horizontal row slider.

| Project Title | HTML File & Element | Current Path | Recommended Dimensions |
| :--- | :--- | :--- | :--- |
| **MediStore Pharmacy System** | `index.html` (Project 1) | `assets/images/project1.jpg` | `800 x 500 px` |
| **Tech Pioneers Company Website** | `index.html` (Project 2) | `assets/images/project6.jpg` | `800 x 500 px` |
| **FastAPI Scalable Backend** | `index.html` (Project 3) | `assets/images/project9.jpg` | `800 x 500 px` |
| **Agentic AI Workflow Assistant** | `index.html` (Project 4) | `assets/images/project14.jpg` | `800 x 500 px` |
| **ESP32 Industrial Motor HCI** | `index.html` (Project 5) | `assets/images/project19.jpg` | `800 x 500 px` |
| **Autonomous Navigation Robot** | `index.html` (Project 6) | `assets/images/project25.jpg` | `800 x 500 px` |

> 💡 *Note: Fallback high-resolution Unsplash tech placeholder images have been configured automatically. If a local file is missing, a backup tech visual will render cleanly.*
