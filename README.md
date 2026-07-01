# Human Heart AR

This project is a mobile-first Next.js Pages Router demo for a NEET Biology Human Heart poster. The main experience uses MindAR image tracking plus A-Frame so the 3D heart appears anchored on the printed poster image.

## File placement

1. Put the heart model in `public/models/heart.glb`.
2. Put the poster image in `public/posters/heart.png`.
3. Compile the poster image into `public/targets/heart-poster.mind` using the MindAR image target compiler.

## Routes

- Main AR page: `/ar/heart`
- Compatibility rewrite: `/ar/heart.html`
- Fallback 3D viewer: `/ar/heart-fallback`
- Fallback rewrite: `/ar/heart-fallback.html`
- Printable QR page: `/ar/qr-heart`
- QR rewrite: `/ar/qr-heart.html`

### Human Spine AR

- Main AR page: `/ar/spine`
- Compatibility rewrite: `/ar/spine.html`
- Fallback 3D viewer: `/ar/spine-fallback`
- Fallback rewrite: `/ar/spine-fallback.html`
- Printable QR page: `/ar/qr-spine`
- QR rewrite: `/ar/qr-spine.html`

### Chloroplast AR

- Main AR page: `/ar/chloroplast`
- Compatibility rewrite: `/ar/chloroplast.html`
- Fallback viewer: `/ar/chloroplast-fallback`
- Fallback rewrite: `/ar/chloroplast-fallback.html`
- Printable QR page: `/ar/qr-chloroplast`
- QR rewrite: `/ar/qr-chloroplast.html`

### Animal Cell AR

- Main AR page: `/ar/animal-cell`
- Compatibility rewrite: `/ar/animal-cell.html`
- Fallback viewer: `/ar/animal-cell-fallback`
- Fallback rewrite: `/ar/animal-cell-fallback.html`
- Printable QR page: `/ar/qr-animal-cell`
- QR rewrite: `/ar/qr-animal-cell.html`

## How to use

1. Open `/ar/qr-heart`.
2. Print the poster page clearly.
3. Scan the QR code from a phone.
4. Allow camera permission.
5. Point the phone camera at the printed poster image.
6. The heart model should appear anchored to the poster.
7. Use the explanation buttons to explore the NEET content.

## Mobile testing

- The QR link should point to a real HTTPS URL before you print for a client demo.
- Camera access requires HTTPS on real mobile devices.
- For local phone testing, use a Vercel preview deployment or tunnel the dev server with ngrok or Cloudflare Tunnel.
- `localhost` only works on the same development device; it is not directly usable from another phone.
- This demo is optimized for mobile browsers, especially Android Chrome and iPhone Safari.

## Development

```bash
npm install
npm run dev
```

## Notes

- The main AR experience is marker/image tracking, not a floor-based viewer.
- If the heart model, MindAR target, or poster image is missing, the UI shows a clear warning instead of failing silently.
