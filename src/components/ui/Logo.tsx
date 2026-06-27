// ============================================================
// DogParentGuide - Logo Component
// ============================================================

import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'text-xl', name: 'text-lg', tagline: 'text-xs' },
    md: { icon: 'text-2xl', name: 'text-xl', tagline: 'text-xs' },
    lg: { icon: 'text-3xl', name: 'text-2xl', tagline: 'text-sm' },
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const taglineColor = variant === 'light' ? 'text-white/70' : 'text-gray-500';

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md group-hover:shadow-green-200 transition-shadow duration-300">
        <span className={`${sizes[size].icon}`}>🐾</span>
      </div>
      <div className="flex flex-col">
        <span className={`${sizes[size].name} font-bold leading-tight ${textColor}`}>
          Dog<span className="text-green-500">Parent</span>
          <span className="text-orange-500">Guide</span>
        </span>
        <span className={`${sizes[size].tagline} ${taglineColor} leading-tight hidden sm:block`}>
          Expert Advice for Every Dog Parent
        </span>
      </div>
    </Link>
  );
}
