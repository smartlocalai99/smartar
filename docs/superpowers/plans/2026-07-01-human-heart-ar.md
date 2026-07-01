# Human Heart AR Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Next.js pages-router AR demo that uses MindAR image tracking to anchor a human heart model to a printed poster, with a fallback 3D viewer and a printable QR poster page.

**Architecture:** The app will be a minimal Next.js pages-router project in JavaScript with Tailwind for UI. The main AR scene will live in a client-only component that loads MindAR and A-Frame from CDN, renders only after scripts are ready, and checks required assets before starting. Supporting pages will provide a fallback model-viewer experience and a printable QR poster page.

**Tech Stack:** Next.js pages router, React, JavaScript, Tailwind CSS, MindAR, A-Frame, @google/model-viewer, client-side QR code generation.

## Global Constraints

- Use Next.js Pages Router only.
- Use JavaScript only, no TypeScript and no TSX.
- Use Tailwind CSS for UI.
- Main route must be `/ar/heart`.
- Add Next.js rewrites in `next.config.js` for `/ar/heart.html`, `/ar/heart-fallback.html`, and `/ar/qr-heart.html`.
- Do not make `/public/ar/heart.html` the main page.
- Load MindAR and A-Frame only on the client side.
- Render the A-Frame scene only after scripts are loaded.
- QR code should open `/ar/heart`.
- Tracking target must come from `/public/posters/heart-poster.png` compiled into `/public/targets/heart-poster.mind`.
- Keep fallback page `/ar/heart-fallback` using model-viewer for devices where marker AR fails.
- Show clear missing-file warnings for `/models/heart.glb`, `/targets/heart-poster.mind`, and `/posters/heart-poster.png`.
- Mobile-first UX; primary use case is phones scanning the poster.
- Deploy over HTTPS before testing QR on a phone.

---

### Task 1: Scaffold the Next.js app shell

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `postcss.config.js`
- Create: `tailwind.config.js`
- Create: `pages/_app.js`
- Create: `pages/index.js`
- Create: `styles/globals.css`

**Interfaces:**
- Consumes: Next.js app bootstrap conventions.
- Produces: a working pages-router app shell with Tailwind available globally.

- [ ] **Step 1: Create the app configuration**

```json
{
  "name": "smartar-heart-ar",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

- [ ] **Step 2: Verify the app can build once dependencies are installed**

Run: `npm run build`
Expected: Next.js build completes after the app files are in place.

- [ ] **Step 3: Keep the home page minimal**

```javascript
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">Human Heart AR</h1>
        <p className="text-slate-300">
          Open the QR poster page to print the tracking image and launch the mobile AR demo.
        </p>
      </div>
    </main>
  );
}
```

**Files:**
- Create: `components/HeartArScene.js`
- Create: `components/NeetInfoPanel.js`
- Create: `components/AssetWarnings.js`

**Interfaces:**
- Consumes: asset URLs, button actions, and script-ready state.
- Produces: reusable UI and AR scene components.

- [ ] **Step 4: Define the client-only AR scene behavior**

```javascript
export default function HeartArScene({ scriptsReady, assetStatus, onExplain, onToggleBloodFlow }) {
  return null;
}
```

- [ ] **Step 5: Verify the component mounts only on the client**

Run: `npm run build`
Expected: no SSR reference errors from `window`, `document`, or MindAR/A-Frame.

### Task 2: Build the MindAR image-tracking page

**Files:**
- Create: `pages/ar/heart.js`
- Create: `components/HeartArScene.js`
- Create: `components/NeetInfoPanel.js`
- Create: `components/AssetWarnings.js`

**Interfaces:**
- Consumes: client-only script readiness, asset checks, explanation selection, blood-flow toggle state.
- Produces: the mobile AR experience anchored to the poster target.

- [ ] **Step 1: Write the AR page structure**

```javascript
import dynamic from 'next/dynamic';

const HeartArScene = dynamic(() => import('../../components/HeartArScene'), { ssr: false });

export default function HeartArPage() {
  return <HeartArScene />;
}
```

- [ ] **Step 2: Verify route-only rendering works without SSR AR code**

Run: `npm run build`
Expected: `/ar/heart` builds without server-side AR execution.

- [ ] **Step 3: Implement explanations and blood-flow toggling**

```javascript
const INFO_CONTENT = {
  default: {
    title: 'Human Heart',
    text: 'The human heart is a four-chambered muscular organ responsible for double circulation: pulmonary circulation and systemic circulation.'
  }
};
```

- [ ] **Step 4: Render the MindAR scene only after CDN scripts load**

```javascript
if (!scriptsReady) {
  return <div>Loading AR scene...</div>;
}
```

- [ ] **Step 5: Verify target-found and target-lost UI updates**

Run: `npm run build`
Expected: page compiles with the target-state handlers and instruction/fallback UI.

### Task 3: Add the fallback 3D viewer page

**Files:**
- Create: `pages/ar/heart-fallback.js`

**Interfaces:**
- Consumes: the same NEET explanation content as the AR page.
- Produces: a mobile-friendly model-viewer fallback with back navigation to `/ar/heart`.

- [ ] **Step 1: Create the fallback page shell**

```javascript
export default function HeartFallbackPage() {
  return null;
}
```

- [ ] **Step 2: Verify model-viewer is client-safe in Next.js**

Run: `npm run build`
Expected: no SSR errors from `@google/model-viewer` usage.

### Task 4: Add the printable QR poster page

**Files:**
- Create: `pages/ar/qr-heart.js`

**Interfaces:**
- Consumes: `window.location.origin`, client-side QR library, poster image URL.
- Produces: printable poster preview and QR code pointing to `/ar/heart`.

- [ ] **Step 1: Build the poster layout**

```javascript
export default function QrHeartPage() {
  return null;
}
```

- [ ] **Step 2: Verify the QR link resolves to the current HTTPS origin plus `/ar/heart`**

Run: `npm run build`
Expected: QR page compiles and uses client-side origin logic.

### Task 5: Add asset checks and route rewrites

**Files:**
- Modify: `next.config.js`
- Modify: `components/AssetWarnings.js`

**Interfaces:**
- Consumes: required asset paths.
- Produces: friendly missing-file warnings and HTML compatibility rewrites.

- [ ] **Step 1: Add rewrites for `.html` compatibility URLs**

```javascript
async rewrites() {
  return [
    { source: '/ar/heart.html', destination: '/ar/heart' },
    { source: '/ar/heart-fallback.html', destination: '/ar/heart-fallback' },
    { source: '/ar/qr-heart.html', destination: '/ar/qr-heart' }
  ];
}
```

- [ ] **Step 2: Verify missing-file warnings are visible instead of silent failures**

Run: `npm run build`
Expected: warnings are part of the UI behavior, not runtime crashes.

### Task 6: Document setup and phone testing flow

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: the final file locations and deployment flow.
- Produces: exact setup and test instructions for mobile AR.

- [ ] **Step 1: Write the setup steps and mobile HTTPS guidance**

```markdown
1. Put the heart model in `public/models/heart.glb`.
2. Put the poster image in `public/posters/heart-poster.png`.
3. Compile the poster image into `public/targets/heart-poster.mind`.
```

- [ ] **Step 2: Verify the README matches the implementation paths**

Run: `npm run build`
Expected: docs and app paths stay aligned.

## Spec Coverage Check

- Marker/image tracking: Task 2.
- Client-only script loading: Task 2.
- /ar/heart main route: Task 2.
- /ar/heart.html rewrite: Task 5.
- Fallback viewer: Task 3.
- Printable QR page: Task 4.
- Missing-file warnings: Task 5.
- README instructions: Task 6.
- Mobile-first UX and HTTPS guidance: Tasks 2, 4, 6.
