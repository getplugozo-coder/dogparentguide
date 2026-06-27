// ============================================================
// DogParentGuide - Categories Data
// In production: fetched from Google Sheets API
// ============================================================

import type { Category } from './types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Nutrition',
    slug: 'nutrition',
    description: 'Expert guidance on dog nutrition, diet plans, best dog foods, and feeding schedules for optimal health.',
    icon: '🥗',
    color: '#22c55e',
    featured_image: '/images/article-nutrition.jpg',
    seo_title: 'Dog Nutrition Articles & Guides | DogParentGuide',
    meta_description: 'Expert dog nutrition advice, food reviews, feeding guides, and diet plans from certified veterinary nutritionists.',
    parent_category: '',
    post_count: 24,
    order: 1,
    status: 'active'
  },
  {
    id: '2',
    name: 'Training',
    slug: 'training',
    description: 'Proven dog training techniques, obedience tips, behavior modification, and puppy training guides.',
    icon: '🎯',
    color: '#f97316',
    featured_image: '/images/article-training.jpg',
    seo_title: 'Dog Training Tips & Guides | DogParentGuide',
    meta_description: 'Science-based dog training techniques, obedience training guides, behavior solutions, and tips from professional trainers.',
    parent_category: '',
    post_count: 18,
    order: 2,
    status: 'active'
  },
  {
    id: '3',
    name: 'Health',
    slug: 'health',
    description: 'Veterinary-approved health guides, disease prevention, wellness tips, and when to see the vet.',
    icon: '🏥',
    color: '#3b82f6',
    featured_image: '/images/article-health.jpg',
    seo_title: 'Dog Health & Wellness Articles | DogParentGuide',
    meta_description: 'Vet-approved dog health information, disease prevention guides, symptoms checker, and wellness tips for happy, healthy dogs.',
    parent_category: '',
    post_count: 31,
    order: 3,
    status: 'active'
  },
  {
    id: '4',
    name: 'Grooming',
    slug: 'grooming',
    description: 'Step-by-step grooming guides, product reviews, coat care tips, and professional grooming advice.',
    icon: '✂️',
    color: '#a855f7',
    featured_image: '/images/article-grooming.jpg',
    seo_title: 'Dog Grooming Tips & Guides | DogParentGuide',
    meta_description: 'Professional dog grooming techniques, coat care by breed, product reviews, and step-by-step grooming tutorials.',
    parent_category: '',
    post_count: 15,
    order: 4,
    status: 'active'
  },
  {
    id: '5',
    name: 'Breeds',
    slug: 'breeds',
    description: 'In-depth breed profiles, temperament guides, breed comparisons, and finding the right dog for your lifestyle.',
    icon: '🐕',
    color: '#f59e0b',
    featured_image: '/images/article-breeds.jpg',
    seo_title: 'Dog Breed Guides & Profiles | DogParentGuide',
    meta_description: 'Complete dog breed guides with temperament, care needs, exercise requirements, and expert advice on finding your perfect match.',
    parent_category: '',
    post_count: 28,
    order: 5,
    status: 'active'
  },
  {
    id: '6',
    name: 'Puppy Care',
    slug: 'puppy-care',
    description: 'Everything for new puppy parents: socialization, vaccinations, first vet visit, and puppy development stages.',
    icon: '🐾',
    color: '#ec4899',
    featured_image: '/images/hero-dog.jpg',
    seo_title: 'Puppy Care Guides & Tips | DogParentGuide',
    meta_description: 'Complete puppy care guides from bringing puppy home to adult dog. Covers vaccination schedules, socialization, training, and development.',
    parent_category: '',
    post_count: 22,
    order: 6,
    status: 'active'
  }
];
