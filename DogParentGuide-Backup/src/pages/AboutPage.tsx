// ============================================================
// DogParentGuide - About Page
// ============================================================

import { Link } from 'react-router-dom';
import { SEOHead } from '../components/layout/SEOHead';
import { Button } from '../components/ui/Button';
import { authors } from '../data/authors';

export function AboutPage() {
  return (
    <>
      <SEOHead
        title="About DogParentGuide - Our Mission & Expert Team"
        description="Learn about DogParentGuide, our mission to provide evidence-based dog care advice, and meet our team of veterinarians, trainers, and dog care experts."
        url="/about"
      />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-600 to-green-500 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-5xl mb-6">🐾</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              About DogParentGuide
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              We believe every dog deserves the best care possible — and every dog parent deserves access to expert, evidence-based advice.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  DogParentGuide was founded by a team of passionate dog lovers and animal health professionals who were frustrated by the overwhelming amount of misinformation online about dog care.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We set out to create a trusted resource where dog parents could find accurate, science-backed information — the kind of advice you'd get from your veterinarian or a certified trainer.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Today, DogParentGuide reaches over 50,000 dog parents monthly, and we're just getting started. Every article we publish is reviewed by licensed professionals to ensure the highest level of accuracy and reliability.
                </p>
              </div>
              <div className="bg-green-50 rounded-2xl p-8">
                <div className="space-y-6">
                  {[
                    { emoji: '🎯', title: 'Our Mission', text: 'Empower dog parents with expert, evidence-based guidance for healthier, happier dogs.' },
                    { emoji: '👁️', title: 'Our Vision', text: 'A world where every dog has access to proper care through educated, confident pet parents.' },
                    { emoji: '💡', title: 'Our Values', text: 'Accuracy, compassion, accessibility, and a deep love for dogs guide everything we do.' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-4">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Standards */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Our Editorial Standards</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We hold ourselves to the highest standards of accuracy and editorial integrity. Here's how we ensure quality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: '🔬',
                  title: 'Evidence-Based Content',
                  description: 'All health and nutrition information is sourced from peer-reviewed research and veterinary literature.',
                },
                {
                  icon: '👨‍⚕️',
                  title: 'Expert Review',
                  description: 'Every article is written by or reviewed by licensed veterinarians, certified trainers, or relevant specialists.',
                },
                {
                  icon: '🔄',
                  title: 'Regular Updates',
                  description: 'We regularly review and update our content to reflect the latest research and veterinary guidelines.',
                },
                {
                  icon: '🚫',
                  title: 'Editorial Independence',
                  description: 'Our editorial content is completely independent of our advertising relationships. Sponsors never influence our recommendations.',
                },
                {
                  icon: '✅',
                  title: 'Fact-Checking',
                  description: 'All facts, statistics, and medical claims are verified against authoritative sources before publication.',
                },
                {
                  icon: '💬',
                  title: 'Transparency',
                  description: 'We clearly disclose affiliate relationships, sponsored content, and our methodology for product reviews.',
                },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Meet Our Experts</h2>
              <p className="text-gray-600">
                Our team of veterinarians, certified trainers, and dog care specialists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {authors.filter(a => a.status === 'active').map(author => (
                <Link
                  key={author.id}
                  to={`/author/${author.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300 text-center"
                >
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-green-50"
                  />
                  <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-xs text-green-600 font-semibold mt-1">{author.credentials}</p>
                  <p className="text-sm text-gray-500 mt-1">{author.role}</p>
                  <p className="text-xs text-gray-400 mt-3 line-clamp-3">{author.bio}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '500+', label: 'Expert Articles' },
                { value: '50K+', label: 'Monthly Readers' },
                { value: '15+', label: 'Expert Authors' },
                { value: '2024', label: 'Founded' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-green-400">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Have Questions?</h2>
            <p className="text-gray-600 mb-8">
              We love hearing from dog parents. Whether you have a question, suggestion, or want to collaborate, we'd love to connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg">Contact Us</Button>
              <Button href="/newsletter" variant="outline" size="lg">Subscribe to Newsletter</Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
