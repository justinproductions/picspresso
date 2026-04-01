# WebP Converter — justin.productions

## Project Overview
A browser-based WebP image converter. Upload single/bulk/folder images, resize with aspect ratio lock, quality control, and download as WebP.

Hosted on **Vercel** (static/Edge — no server needed, all conversion runs client-side via Canvas API).

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS vars (matches justin.productions branding)
- **Image Processing:** Browser Canvas API (client-side, zero server cost)
- **Bulk Download:** JSZip + file-saver
- **Icons:** Remix Icon
- **Font:** Poppins (Google Fonts)
- **Package Manager:** npm

## Branding (justin.productions)
```css
--bg:          #050505
--surface:     rgba(20,20,30,0.4)   /* glass panels */
--text:        #e0e0e0
--heading:     #ffffff
--muted:       #aaaaaa
--accent:      #bf201e              /* crimson red — buttons, highlights */
--glow-pink:   #ff1b6b
--glow-blue:   #45caff
--border:      rgba(255,255,255,0.1)
```

### Glass Panel
```css
background: rgba(20,20,30,0.4);
backdrop-filter: blur(10px);
border: 1px solid rgba(255,255,255,0.1);
box-shadow: 0 8px 32px rgba(0,0,0,0.37);
border-radius: 24px;
```

### Button (Accent)
```css
background: rgba(191,32,30,0.2);
border: 1px solid rgba(191,32,30,0.4);
border-radius: 15px;
/* hover: */ background: #bf201e; box-shadow: 0 0 20px #bf201e;
```

## Features
1. Single image upload (drag & drop + click)
2. Bulk upload / folder upload
3. Resize: width × height with aspect ratio lock/unlock toggle
4. Quality slider 0–100
5. Live preview
6. Export: single download or ZIP (bulk)

## Project Structure
```
src/
  app/
    page.tsx          # Main converter UI
    layout.tsx        # Root layout (Poppins font, dark bg)
    globals.css       # CSS vars + glass utilities
  components/
    ImageDropzone.tsx  # Upload area
    ImageCard.tsx      # Preview card per image
    ResizeControls.tsx # Width/height + lock toggle
    QualitySlider.tsx  # 0-100 slider
    ExportButton.tsx   # Download single or ZIP
  lib/
    converter.ts       # Canvas WebP conversion logic
    resize.ts          # Aspect ratio math
    zip.ts             # JSZip bulk download
```

## Commands
```bash
npm run dev    # Local dev
npm run build  # Production build
npm run lint   # ESLint
```

## Quality Rules
- No console.log
- No hardcoded values
- Immutable state patterns
- Zod for any form validation
- try/catch on all async
- Files max 400 lines, functions max 50 lines

## Agent Notes
- All conversion is client-side — no API routes needed
- Use `code-reviewer` after code changes
- Use `verifier` before commit
