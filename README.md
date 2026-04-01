# Picspresso

**Fast, private, browser-based WebP image converter.**

Convert single images or entire folders to WebP — with resize controls, quality tuning, and bulk ZIP export. No sign-up. No upload. No nonsense.

🌐 **[picspresso.vercel.app](https://picspresso.vercel.app)** · Built by [justin.productions](https://justin.productions/en)

---

## Your images never leave your browser. Ever.

Most online image converters work like this: you pick a file, it uploads to their server, their server processes it, their server sends it back to you. Your photo — potentially personal, potentially confidential — passed through a machine you don't control, logged by software you've never read, stored for a duration you'll never know.

Picspresso works differently.

When you drop an image into Picspresso, it never travels anywhere. Your browser reads the file directly into memory and draws it onto an invisible canvas element — the same technology powering every browser-based game and photo editor you've ever used. We then call `canvas.toBlob("image/webp")`, a native API that's been built into every modern browser for years. The browser itself does the conversion, entirely on your device. The resulting WebP file is handed straight to your downloads folder.

No network request is made. No server is involved. No data leaves your machine.

You can verify this yourself. Open DevTools, go to the Network tab, convert an image. You'll see zero requests triggered by the conversion. The only traffic is the initial page load — fetching the app's HTML, CSS, and JavaScript. After that, Picspresso goes dark. It doesn't phone home. It doesn't track your files. It can't — there's nowhere to send anything.

This isn't a privacy policy you have to trust. It's a technical reality baked into the architecture.

---

## Why Picspresso beats server-side converters

Tools like Convertio, CloudConvert, and dozens of others route your images through their infrastructure because they have to — they rely on server-side libraries like ImageMagick or Sharp that can't run in a browser. That model has real costs:

- **Your files are uploaded to a stranger's server.** Even with HTTPS, your data is decrypted, processed, and temporarily stored on hardware you have no visibility into.
- **You're subject to their retention policies.** Most say they delete files after a few hours. Most. After a few hours.
- **File size limits.** Server-side processing costs money, so they cap you. 10 MB, 100 MB, whatever the plan allows.
- **It's slow.** Upload time + queue time + processing time + download time. For a 4K photo that can be seconds of waiting.

Picspresso has none of these problems. There's no upload step, so there's no upload time. There's no server, so there's no file size limit imposed by compute cost. There's no retention policy because there's nothing retained. Your 50 MB RAW export converts in the same time it takes your browser to paint a canvas — milliseconds.

---

## Features

- **Drag & drop or bulk select** — drop individual images or select hundreds at once
- **Resize with aspect ratio lock** — set a target width and height locks automatically, or unlock for free crop
- **Quality slider 0–100** — fine-tune the balance between file size and visual quality
- **Live size savings** — see exactly how much smaller each converted file is
- **Conversion stats** — total images, before/after size, and overall savings percentage
- **Single or bulk download** — grab one file or export everything as a ZIP
- **100% client-side** — runs entirely in your browser, works offline after first load

---

## Tech stack

- **Next.js 14** (App Router, static export)
- **TypeScript**
- **Tailwind CSS**
- **Canvas API** — native browser WebP encoding
- **JSZip** — client-side ZIP generation
- **Hosted on Vercel**

---

## Running locally

```bash
git clone https://github.com/justinproductions/picspresso.git
cd picspresso
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## The one honest caveat

Because the browser's canvas encoder is doing the work, very aggressive compression settings (quality 0–30) won't be as optimized as a dedicated encoder like `libwebp` running server-side. For web images, portfolio photos, blog assets, and social media exports — which covers 99% of use cases — you won't notice the difference. If you need frame-perfect compression for print production, you want a different tool. For everything else, Picspresso is faster, safer, and simpler.

---

Built by [justin.productions](https://justin.productions/en)
