// ============================================================
// DogParentGuide - Newsletter Page
// ============================================================

import { SEOHead } from '../components/layout/SEOHead';
import { NewsletterBox } from '../components/ui/NewsletterBox';

export function NewsletterPage() {
  return (
    <>
      <SEOHead
        title="Join 50,000+ Dog Parents | DogParentGuide Newsletter"
        description="Subscribe to the DogParentGuide newsletter for weekly expert tips on dog nutrition, training, health, and more. Free, no spam."
        url="/newsletter"
      />

      <main>
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 min-h-[60vh] flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
            <NewsletterBox variant="card" />
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
              What You'll Get Every Week
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: '🥗', title: 'Nutrition Tips', desc: 'Expert advice on feeding your dog for optimal health and longevity.' },
                { icon: '🎯', title: 'Training Tricks', desc: 'Step-by-step training guides from certified professional dog trainers.' },
                { icon: '🏥', title: 'Health Alerts', desc: 'Important health information and seasonal safety tips from veterinarians.' },
                { icon: '🐾', title: 'Breed Spotlights', desc: 'In-depth guides on popular and rare dog breeds.' },
                { icon: '✂️', title: 'Grooming Guides', desc: 'Professional grooming techniques you can do at home.' },
                { icon: '❤️', title: 'Heartwarming Stories', desc: 'Inspiring stories from dog parents just like you.' },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center text-sm text-gray-500">
              <p>✓ 100% Free  ·  ✓ No spam  ·  ✓ Unsubscribe anytime  ·  ✓ Expert-curated content</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
