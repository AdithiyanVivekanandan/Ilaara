# Ilaara Boutique E-Commerce Platform | Comprehensive Manual

A high-fidelity, production-grade e-commerce application designed for a premium handmade crochet and craft boutique. This document serves as a complete overview of the project's capabilities, an operational manual for the admin dashboard, and a critical guide on managing cloud costs.

---

## 🎨 1. Fully Decoupled Visual Engine (New Feature)

The platform is no longer a static website; it is a **"Low-Code Visual Engine."** Every aesthetic aspect of the store is controlled directly through the database, giving the administrator absolute freedom.

### Global Theme Flexibility
*   **Color Command**: Real-time control of the primary background (`--bg-color`) and brand accents (`--color-brand-red`) using visual color pickers.
*   **Glassmorphism Control**: Adjust the blur intensity and opacity of the "Glass Island" navigation dynamically.
*   **Edge Architecture**: Slide from sharp, strict corners (0px radius) to soft, heavily rounded UI elements dynamically.

### Dynamic Rendering
*   **Shop Grid Modularity**: Seamlessly toggle the Shop page between strict mathematical grids (2, 3, or 4 columns) and irregular **Masonry** layouts. You also control Card Ratios (Square vs. Portrait) and Hover states (Lift vs. Grayscale).
*   **Product Gallery Selector**: Dictate how users view your items (Large Splash, Stacked Scroll, or Thumbnail Arrays).

---

## 🛡️ 2. Production Security Architecture

The application is hardened against common vulnerabilities and bots, ensuring robust privacy and reliability.

*   **Forensic Audit Shield**: A centralized **Shield Dashboard** records temporal access patterns, tracking failed authorizations, bot hits, and system rate limits.
*   **Automated Failsafe (Revert)**: A strict "Revert to Original" safety latch on the Customize page. If visual settings break the layout, one click wipes the database settings and restores the original boutique configuration safely.
*   **Silent Bot Honeypots**: Invisible traps within checkout fields that catch and drop automated scrapers and bots silently.
*   **EXIF Metadata Stripping**: The Cloudinary upload pipeline automatically strips GPS location data from your product photos before they touch the public web.

---

## 📖 3. Administration & Usage Guide

### Section A: The Command Center (`/admin`)
Your administration panel is divided into domains:
1.  **Inventory**: Manage products, pricing, and stock.
2.  **Activity (Orders)**: Process incoming purchases.
3.  **Messages**: Respond to customer inquiries.
4.  **Shield**: Monitor your security traffic and anomalies.
5.  **Customize**: Control the visual engine of the website.

### Section B: Operating the "Customize" Engine
*   **Always test locally first**: When changing colors or layout columns, switch to a mobile phone browser size immediately to ensure the design scales properly.
*   **Animation Speeds**: Adjusting the `ScrollSpeed` below `0.5x` may cause visual jitter on low-end devices. Keep `ParallaxIntensity` conservative (around `1.0x` to `1.5x`) unless you want dramatic depth effects.
*   **Safety Latch**: If you accidentally change the font colors to match the background so the site becomes unreadable, navigate blindly to the `Customize` tab and hit the grey **"Revert to Original"** button in the top right.

---

## ⚠️ 4. Financial Security & Cost Management (CRITICAL)

Because this platform relies on extremely powerful cloud services (Vercel, Supabase, Cloudinary, Razorpay), **you must protect your credentials to avoid catastrophic billing.** Scammers frequently scrape GitHub for keys. 

### Rule 1: Never Expose `.env.local`
Your `.env` file contains keys that give hackers access to spend your money on massive email or database operations.
*   **What NOT to do**: Never run `git add -f .env.local` or upload this file to the internet.
*   **What you must do**: Only paste keys directly into the Vercel Dashboard under **Settings > Environment Variables**.

### Rule 2: Database Limits (Supabase)
You are likely on a free or low-tier plan. 
*   **Focus on**: Large query loops. The current codebase is optimized, but if you start making hundreds of API calls from multiple devices, you will exceed your Compute Quota. 
*   **Billing Security**: Do not attach a credit card to Supabase until you are ready and understand the "Spend Cap" settings. Always enable "Spend Caps".

### Rule 3: Image Bandwidth (Cloudinary)
Cloudinary charges by bandwidth (how heavily your images are downloaded).
*   **Focus on**: High Definition Images. Do not upload raw 50MB files from your camera directly. Even though Cloudinary optimizes them, massive initial uploads consume your transformation quota. Compress images slightly before uploading.

### Rule 4: Payment Webhooks (Razorpay)
*   **Focus on**: Your Razorpay Webhook Secret (`RAZORPAY_WEBHOOK_SECRET`). This ensures that only Razorpay can tell your system a payment succeeded. If this leaks, attackers can fake successful payments and generate fake orders.

---

## ⚙️ Technical Stack Overview
*   **Framework**: Next.js 16 (App Router)
*   **Database & Auth**: Supabase (PostgreSQL)
*   **Hardware Acceleration**: GSAP (GreenSock) for Parallax timelines
*   **CDNs**: Vercel (Hosting), Cloudinary (Media assets)
