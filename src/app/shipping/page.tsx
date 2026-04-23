import Navbar from '@/components/Navbar'

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-brand-cream pt-32 px-8 md:px-16 pb-24">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-4xl font-serif italic text-brand-red">Shipping Policy</h1>
        <div className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>Ilaara ships across India. As our pieces are handmade, please allow 3-5 business days for preparation before shipping.</p>
          <p>Once dispatched, domestic shipping typically takes 5-7 business days depending on your location.</p>
          <p>You will receive a tracking link via email once your collection is on its way.</p>
        </div>
      </div>
    </main>
  )
}
