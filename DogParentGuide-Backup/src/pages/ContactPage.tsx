// ============================================================
// DogParentGuide - Contact Page
// ============================================================

import { useState } from 'react';
import { SEOHead } from '../components/layout/SEOHead';
import { Button } from '../components/ui/Button';
import { siteSettings } from '../data/settings';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // In production: integrate with Cloudflare Workers or a form service
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <SEOHead
        title="Contact DogParentGuide - Get in Touch"
        description="Have a question, suggestion, or want to contribute? Contact the DogParentGuide team. We love hearing from dog parents!"
        url="/contact"
      />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-black text-white mb-4">Get in Touch</h1>
            <p className="text-gray-400 text-lg">
              We'd love to hear from you. Whether you have a question, feedback, or want to collaborate.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Contact Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    {[
                      {
                        icon: '📧',
                        title: 'Email',
                        content: siteSettings.email,
                        href: `mailto:${siteSettings.email}`,
                      },
                      {
                        icon: '🌐',
                        title: 'Website',
                        content: 'dogparentguide.com',
                        href: '/',
                      },
                    ].map(item => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors group"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">{item.title}</p>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {item.content}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Common Questions</h3>
                  <div className="space-y-3">
                    {[
                      'Submit a guest post',
                      'Advertise with us',
                      'Report incorrect information',
                      'Partnership opportunities',
                      'Media inquiries',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">→</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-yellow-800 mb-1">⚕️ Medical Disclaimer</p>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    We cannot provide personalized veterinary advice. For your dog's health questions, please consult a licensed veterinarian.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  {status === 'success' ? (
                    <div className="text-center py-12">
                      <div className="text-5xl mb-4">🎉</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for reaching out. We'll get back to you within 24-48 hours.
                      </p>
                      <Button onClick={() => setStatus('idle')} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Jane Smith"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="jane@example.com"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm bg-white"
                        >
                          <option value="">Select a subject...</option>
                          <option value="general">General Inquiry</option>
                          <option value="content">Content Correction</option>
                          <option value="guest-post">Guest Post Submission</option>
                          <option value="advertising">Advertising</option>
                          <option value="partnership">Partnership</option>
                          <option value="technical">Technical Issue</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder="Tell us how we can help you..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={status === 'loading'}
                        fullWidth
                        size="lg"
                      >
                        {status === 'loading' ? '⏳ Sending...' : '📧 Send Message'}
                      </Button>

                      <p className="text-xs text-gray-400 text-center">
                        By submitting this form, you agree to our{' '}
                        <a href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</a>.
                        We typically respond within 24-48 hours.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
