# Ilaara Boutique: Owner's Platform Guide

Welcome to the Ilaara backend platform. This is your completely custom, high-end e-commerce engine. Unlike basic builders like Shopify or Wix, this platform is tailored specifically to your boutique, offering unique security frameworks and an entirely unlocked visual engine that you control.

This document is your operational manual. It outlines exactly what your platform can do, how to use it, and critical rules to follow to protect your business.

---

## 🌟 1. Your Unique Features

### The Unlocked Visual Engine
Your website is not a static template; it is a "Low-Code Visual Engine." Every fundamental design choice—from the curve of a button to the layout of your product grid—can be modified in real-time through your dashboard without touching a single line of code.

### Hand-Drawn Scrollytelling
Your homepage features a unique GSAP-powered "Scrollytelling" experience. As visitors scroll, elements fade, expand, and shift into view, creating an editorial, magazine-like experience rather than a standard store.

### Forensic Security & Privacy
We have built invisible layers of security specifically for your boutique:
*   **EXIF Metadata Stripping:** When you take photos on your iPhone/Camera, they store exact GPS coordinates of your studio. When you upload photos to Ilaara, the system *automatically strips* this GPS data to protect your physical location.
*   **Invisible Bot Traps:** Your checkout and contact forms contain hidden "honeypots." Automated spam bots fall into these invisible traps and are blocked silently, preventing spam from reaching your inbox.
*   **The Shield Dashboard:** You have a dedicated tab to watch for suspicious IP addresses or failed login attempts in real-time.

---

## 🛠️ 2. How to Use Your Features (What You CAN Do)

All of these features are controlled from the **Customize** and **Dashboard** tabs at `your-website.com/admin`.

### A. Controlling the Visual Vibe
*   **Color & Glass:** In the Customize > Theme tab, you can change the exact hex code of your brand red, the cream background, and adjust the "Glassmorphism" (blur) of your navigation menu.
*   **Soft vs. Sharp:** Adjust the "Element Roundness" slider. Pushing it to 0px creates a very harsh, brutalist aesthetic. Sliding it to 24px creates soft, friendly bubbles.

### B. Editing the Homepage Story
*   **Narrative Control:** In the Customize > Home tab, you can re-write the primary Hero text and add/remove the narrative "Stories" that appear as users scroll down your homepage.
*   **Animation Pacing:** You can control the `Animation Speed` and `Parallax Intensity`. Want the images to float slowly like a dream? Lower the speed.

### C. Restructuring the Shop
*   **Grid vs. Masonry:** In Customize > Shop, you can force products to align in perfect squares (Grid) or intentionally misalign them for an artsy, Pinterest-style look (Masonry).
*   **Hover Magic:** Change what happens when a customer hovers over a product. You can make the image zoom softly, lift up with a shadow, or turn from grayscale to color. 

### D. The Safety Button
*   **Revert to Original:** If you ever play with the sliders too much and accidentally make the website ugly or unreadable, go to the top right of the Customize page and click **Revert to Original**. It will instantly wipe your mistakes and restore our verified, professional aesthetic.

---

## 🚫 3. Critical Rules (What You MUST NOT Do)

Because this is a bespoke platform running on powerful, professional cloud infrastructure, **you must follow these rules to avoid high bills, site crashes, or security breaches.**

### Do Not Upload Raw Camera Files (The Cloudinary Bill Rule)
*   **Why:** Your images are hosted on a lightning-fast CDN called Cloudinary, which charges based on *Transformation Bandwidth*.
*   **What you must NOT do:** Never upload massive, uncompressed 25MB RAW or High-Res PNG files directly from your DSLR camera. 
*   **The Rule:** Always quickly compress your images (using tools like TinyPNG or exporting as manageable JPEGs) before uploading. Massive files will drain your free bandwidth quota and trigger overage bills from Cloudinary.

### Do Not Ignore Your "Spend Caps"
*   **Why:** Your database (Supabase) and hosting (Vercel) automatically scale. If you suddenly get 100,000 visitors, the servers expand to handle it so your site doesn't crash.
*   **What you must NOT do:** Do not turn off "Spend Caps" or "Usage Limits" in your Supabase/Vercel billing settings unless you are ready to pay for massive traffic spikes. 

### Do Not Slow Down the Scroll Speed Too Much
*   **Why:** The complex animations on your homepage require processing power from your customers' phones.
*   **What you must NOT do:** In the Customize dashboard, do not set the `ScrollSpeed` below `0.5x` or the `Parallax Intensity` above `2.5x`.
*   **The Rule:** If you push these values to the extreme, older iPhones or cheap Android devices will lag heavily, causing a jittery experience. Keep them moderate.

### Do Not Expose Admin Links or Passwords
*   **Why:** You are the sole administrator.
*   **What you must NOT do:** Uniquely, your database is protected by Row-Level Security (RLS). This means the database physically rejects any change unless it detects your specific Admin credential token. Never login to the admin panel on a public computer, and never share your specific Supabase login. If someone gets your credentials, they can change product prices.

### Do Not Create Zero-Visibility Interfaces
*   **Why:** You have the power to make the background color `Black` and the text color `Black`.
*   **What you must NOT do:** Do not make drastic color changes without simultaneously checking the site on your mobile phone to ensure buttons (like "Add to Cart") are still visible and readable. Use the `Revert` button immediately if you lose visibility.
