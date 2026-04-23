# Ilaara Boutique E-Commerce Platform | Project Overview

A high-fidelity, production-grade e-commerce application designed for a premium handmade crochet and craft boutique.

---

## 🎨 Design Philosophy & Unique Features

### 1. Boutique Aesthetic
*   **Minimalist Background**: A clean, distraction-free **Cream & White** palette that emphasizes high-resolution product photography.
*   **Glass Island Navigation**: A sophisticated navigation system that uses selective "blur islands" for the brand and menu links, maintaining full transparency while ensuring legibility.
*   **Premium Typography**: A curated blend of **Cormorant Garamond** (Serif) for narrative depth and **Inter** (Sans) for modern utility.
*   **Micro-Animations**: Fluid GSAP-powered transitions that respond to user interaction without overwhelming the visual space.

### 2. User Experience (UX)
*   **Mobile-First Grid**: Optimized 2-column mobile layout specifically designed for the boutique's primary audience on smartphones.
*   **Editorial Product Pages**: Story-driven product descriptions with integrated **Key Features** sections (Artisanal Craft, Pure Materials).
*   **Fluid Cart Experience**: Interactive quantity controls (+/-), instant removal utilities, and a "Clear All" function for a standard yet high-end shopping experience.

---

## 🛡️ Security Architecture (Hardened)

The application has been built with a "Security by Design" approach, featuring several layers of protection usually absent from small business platforms.

### 1. Data Privacy & Forensics
*   **Automated EXIF Stripping**: All uploaded product images undergo an automatic metadata stripping process. This removes sensitive GPS location data and camera metadata (protecting the artist's privacy).
*   **Security Audit Logging**: A dedicated `security_logs` system records rate-limit hits, honeypot activations, and unauthorized access attempts.
*   **Shield Dashboard**: A centralized administrative "Shield" view that monitors the temporal access manifest and flags anomalous IP behavior.

### 2. Threat Prevention
*   **Bot Honeypot**: A silent "trap" field in checkout forms that detects and blocks automated bot orders without alerting the attacker.
*   **Production Headers**: Implementation of strict **Content Security Policies (CSP)**, **HSTS**, and **X-Frame-Options** to prevent XSS, clickjacking, and man-in-the-middle attacks.
*   **Rate Limiting**: IP-based request throttling on sensitive endpoints (Checkout, Admin) to prevent spam and brute-force attacks.
*   **Price Verification**: Server-side price validation that ensures prices are never trusted from the client side, preventing payment manipulation.

---

## ⚙️ Technical Stack

*   **Frontend**: Next.js 16 (App Router), Tailwind CSS 4, GSAP (Animations).
*   **Backend**: Supabase (PostgreSQL, Authentication, Row-Level Security).
*   **Payments**: Razorpay Integration (with secure Webhook signature verification).
*   **Media**: Cloudinary (Optimized image delivery and secure upload pipeline).
*   **Infrastructure**: Vercel (Edge Functions, Global CDN, Automated Deployments).

---

## 💼 Management & Administration

*   **Unified Admin Panel**: A single, consistent interface for managing **Inventory**, tracking **Orders**, and handling **Customer Enquiries**.
*   **RLS-Protected Database**: Every database operation is protected by **Row-Level Security**, ensuring only the authorized administrator can modify boutique data.
*   **Automated Logistics**: Real-time order manifest generation and customer email confirmations via Resend.
