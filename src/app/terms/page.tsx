import Navbar from '@/components/Navbar'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-cream pt-32 px-8 md:px-16 pb-24">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-4xl font-serif italic text-brand-red">Terms & Conditions</h1>
        <div className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>By purchasing from Ilaara, you agree to our terms. Each item is handmade and unique; slight variations from photographs are to be expected — they are the mark of the craft.</p>
          <p>Orders are processed once payment is confirmed. Cancellations are only accepted within 24 hours of placing an order.</p>
          <p>All sales are final once shipped, except in cases of damage during transit.</p>
        </div>
      </div>
    </main>
  )
}
