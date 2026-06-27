// ============================================================
// DogParentGuide - Badge Component
// ============================================================

import { Link } from 'react-router-dom';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'category' | 'tag' | 'trending' | 'featured' | 'new';
  color?: string;
  href?: string;
  className?: string;
}

const variantStyles = {
  category: 'bg-green-100 text-green-700 hover:bg-green-200',
  tag: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  trending: 'bg-orange-100 text-orange-700',
  featured: 'bg-blue-100 text-blue-700',
  new: 'bg-emerald-100 text-emerald-700',
};

export function Badge({ children, variant = 'category', href, className = '' }: BadgeProps) {
  const baseStyles = `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link to={href} className={baseStyles}>
        {children}
      </Link>
    );
  }

  return <span className={baseStyles}>{children}</span>;
}
