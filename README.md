# 🎂 The Birthday Shenanigans™

A personalized, interactive birthday website for a very special person. Built with React + Vite + Framer Motion + MediaPipe.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Asset Checklist — ADD THESE FILES

> The website runs without any of these assets. Missing files show placeholder cards.

### 🎵 Birthday Music (MP3)

```
public/audio/birthday-song.mp3
```

- Format: MP3
- Loops automatically
- Plays on successful date unlock
- If missing: music player hides gracefully

---

### 🐱 Birthday Cat (PNG)

```
public/images/stickers/birthday-cat.jpg
```

- A cute cat wearing a blue birthday hat and holding a birthday cake
- Used in the Magic Hand AR section
- If missing: emoji placeholder 🐱🎂 is shown instead

---

### 📸 Photographs (8 files)

#### Present-day photos

```
public/images/good/good-1.jpeg    → Two-shot selfie collage
public/images/good/good-2.jpeg    → White and pink outfit photo
```

#### Childhood photos

```
public/images/childhood/childhood-1.jpeg  → School photograph
public/images/childhood/childhood-2.jpeg  → Yellow-chair photograph
public/images/childhood/childhood-3.jpeg  → Garden photograph
public/images/childhood/childhood-4.jpeg  → Study photograph
public/images/childhood/childhood-5.jpeg  → Standing photograph
```

#### Special photo

```
public/images/special/thela.jpeg  → The iconic blue thela photograph
```

**Important:**
- Use the EXACT filenames listed above
- Supported formats: `.jpeg` / `.jpg`
- Recommended size: 800×1066px (3:4 ratio) or similar portrait orientation
- If any file is missing, a designed placeholder card is shown instead

---

## ✍️ Changing Text Content

All editable text lives in one file:

```
src/data/birthdayContent.js
```

Sections you can edit:
- `landing` — landing page text
- `reveal` — birthday reveal heading
- `intro` — birthday wish
- `roast` — Double Battery and Goldfish content
- `gallery` — photo section headings and captions
- `lilyGarden` — lily messages (up to 7)
- `finalSurprise` — final message
- `easterEgg` — goldfish easter egg dialogue
- `music` — track title
- `camera` — AR section text

---

## 📸 Changing Photo Captions

All photo paths and captions live in:

```
src/data/photoManifest.js
```

You can change:
- `src` — file path
- `caption` — polaroid caption text
- `rotation` — slight tilt angle (degrees)
- `alt` — accessibility text

---

## 🌐 Deploy on Vercel

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click Deploy

---

## 🔒 Why HTTPS Is Required for Camera

The MediaPipe Hand Landmarker and `getUserMedia` camera API only work on **HTTPS** origins (or `localhost`).

This means:
- ✅ Works on `localhost:5173` (dev mode)
- ✅ Works on Vercel, Netlify, or any HTTPS host
- ❌ Does NOT work on plain HTTP

If the camera fails, the website automatically falls back to a manual tap-to-show-cat interaction.

---

## 📱 Testing Camera Permission

1. Open on a mobile browser over HTTPS
2. Navigate to the **Magic Hand** section
3. Tap **ACTIVATE YOUR MAGIC ✨**
4. Allow camera access when prompted
5. Show your open palm to the camera
6. The birthday cat should appear above your palm

**Supported browsers:** Chrome for Android, Safari iOS 15+, Samsung Browser

---

## 🎯 Date Validation

The lock screen accepts the following formats for November 14:

| Input | Accepted? |
|-------|-----------|
| `14` / `11` | ✅ |
| `14` / `November` | ✅ |
| `14` / `Nov` | ✅ |
| `14` / `november` | ✅ |
| `14` / `11` (number) | ✅ |

---

## 🏗️ Project Structure

```
src/
  components/
    common/          → Loading, doodles, petals, scroll, heading
    landing/         → Date verification, birthday reveal
    birthday/        → Intro, roast, gallery, lily, final surprise, easter egg
    audio/           → Music player
    camera/          → Hand tracking, fallback, magic experience
  data/
    birthdayContent.js    → ALL editable text
    photoManifest.js      → ALL photo paths + captions
  hooks/
    useAudio.js           → Persistent audio management
    useHandTracking.js    → MediaPipe hand detection
  pages/
    LandingPage.jsx
    BirthdayExperience.jsx
  styles/
    globals.css           → Design system
    animations.css        → Keyframes
  utils/
    dateValidation.js
    animationHelpers.js
  App.jsx
  main.jsx

public/
  audio/            → birthday-song.mp3
  images/
    good/           → good-1.jpeg, good-2.jpeg
    childhood/      → childhood-1.jpeg through childhood-5.jpeg
    special/        → thela.jpeg
    stickers/       → birthday-cat.jpg
  fonts/            → (optional custom fonts)
  favicon.svg
```

---

## ⚙️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Framer Motion | 11 | Animations |
| Tailwind CSS | 3 | Styling |
| Lucide React | 0.439 | Icons |
| MediaPipe Tasks Vision | 0.10 | Hand tracking |

---

## 🐛 Known Limitations

1. **MediaPipe model loads from CDN** — requires internet on first load. Subsequent loads use browser cache.
2. **Camera AR requires HTTPS** — doesn't work on plain HTTP deployments.
3. **Autoplay policy** — browsers may block music autoplay. A "tap to play" button appears if blocked.
4. **iOS Safari** — camera works but MediaPipe GPU acceleration may fall back to CPU (slower detection).

---

*Made with 🌸 mild chaos and genuine friendship. The Birthday Department™ — Est. November 14.*
