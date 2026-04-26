import Navbar from '@/components/Navbar'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-cream pt-32 px-8 md:px-16 pb-24">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-4xl font-serif italic text-brand-red">Privacy Policy</h1>
        <div className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>At Ilaara, we value your privacy. We collect minimal data required to fulfill your orders — name, email, phone number, and shipping address.</p>
          <p>Your payment information is processed securely by Razorpay and never touches our servers. We use sessionStorage for your cart to ensure your browsing remains private.</p>
          <p>We do not sell your data. We do not track you. We simply craft.</p>
        </div>
      </div>
    </main>
  )
}
