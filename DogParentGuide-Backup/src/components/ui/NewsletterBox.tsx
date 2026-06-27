// ============================================================
// DogParentGuide - Newsletter Box Component
// ============================================================

import { useState } from 'react';
import { Button } from './Button';

interface NewsletterBoxProps {
  variant?: 'inline' | 'card' | 'banner';
  title?: string;
  subtitle?: string;
}

export function NewsletterBox({
  variant = 'card',
  title = '🐾 Join 50,000+ Dog Parents',
  subtitle = 'Get expert dog care tips, training advice, and health guides delivered to your inbox weekly. No spam, ever.',
}: NewsletterBoxProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulate API call - in production, integrate with Mailchimp, ConvertKit, etc.
    // using the configuration from Google Sheets Newsletter tab
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setMessage('🎉 Welcome to the pack! Check your email to confirm your subscription.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-green-100 mb-6">{subtitle}</p>
          {status === 'success' ? (
            <div className="bg-white/20 rounded-xl p-4 text-white font-medium">{message}</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={status === 'loading'}
                className="bg-white text-green-600 hover:bg-green-50 font-bold whitespace-nowrap"
              >
                {status === 'loading' ? 'Joining...' : 'Join Free'}
              </Button>
            </form>
          )}
          {status === 'error' && (
            <p className="mt-3 text-red-200 text-sm">{message}</p>
          )}
          <p className="mt-3 text-green-200 text-xs">
            By subscribing, you agree to our <a href="/privacy-policy" className="underline hover:text-white">Privacy Policy</a>. Unsubscribe anytime.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
        {status === 'success' ? (
          <div className="bg-green-100 rounded-xl p-3 text-green-700 text-sm font-medium">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm bg-white"
            />
            <Button type="submit" disabled={status === 'loading'} fullWidth>
              {status === 'loading' ? '⏳ Joining...' : '🐾 Join the Pack'}
            </Button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-2 text-red-500 text-sm">{message}</p>
        )}
      </div>
    );
  }

  // Card variant
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white text-center">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="text-4xl mb-4">🐾</div>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">{subtitle}</p>

        {status === 'success' ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-300 font-medium">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
            <Button type="submit" disabled={status === 'loading'} fullWidth>
              {status === 'loading' ? '⏳ Joining...' : '🐾 Join 50,000+ Dog Parents Free'}
            </Button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-2 text-red-400 text-sm">{message}</p>
        )}
        <p className="mt-4 text-gray-500 text-xs">
          ✓ No spam  ·  ✓ Weekly tips  ·  ✓ Unsubscribe anytime
        </p>
      </div>
    </div>
  );
}
