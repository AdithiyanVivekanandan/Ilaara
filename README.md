# ILAARA: A High-Fidelity Storytelling Platform

ILAARA is a modern, premium e-commerce platform built with Next.js 16, designed to blend immersive storytelling with seamless shopping experiences.

## ✨ Core Features

- **Immersive Landing Page**: High-fidelity, scroll-driven storytelling using GSAP and minimalist line-art assets.
- **Secure Admin Dashboard**: Full control over products, orders, and site settings with persistent audit logging.
- **Dynamic Product Discovery**: Smooth animations and premium UI for exploring hand-crafted products.
- **Seamless Checkout**: Integrated with Razorpay for secure and reliable payment processing.
- **Real-time Notifications**: Automated email alerts for orders and administrative security audits via Resend.
- **Cloud-Powered Assets**: Image optimization and management powered by Cloudinary.
- **Robust Security**: Hardened security posture with anomaly detection and automated admin alerts.

## 🚀 Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/)
- **UI/UX**: React 19, Tailwind CSS 4, Lucide Icons
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Animations**: [GSAP](https://gsap.com/)
- **Payments**: Razorpay
- **Email**: Resend
- **Storage**: Cloudinary

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AdithiyanVivekanandan/Ilaara.git
   cd ilaara
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ADMIN_EMAIL=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   CLOUDINARY_CLOUD_NAME=...
   RESEND_API_KEY=...
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new). Simply connect your GitHub repository and import the project.

---

Built with ❤️ by Adithiyan.
