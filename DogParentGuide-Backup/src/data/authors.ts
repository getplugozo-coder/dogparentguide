// ============================================================
// DogParentGuide - Authors Data
// In production: fetched from Google Sheets API
// ============================================================

import type { Author } from './types';

export const authors: Author[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    slug: 'dr-sarah-johnson',
    bio: 'Dr. Sarah Johnson is a Doctor of Veterinary Medicine with 15 years of experience in small animal practice. She specializes in preventive care and nutrition and has a passion for educating pet parents about evidence-based care.',
    avatar: '/images/author-sarah.jpg',
    role: 'Veterinary Expert & Senior Editor',
    credentials: 'DVM, MS, DACVN',
    website: 'https://dogparentguide.com',
    twitter: '@drsarahjohnson',
    instagram: '@drsarahjohnsonvet',
    pinterest: '',
    facebook: '',
    email: 'sarah@dogparentguide.com',
    post_count: 47,
    status: 'active'
  },
  {
    id: '2',
    name: 'Mike Chen',
    slug: 'mike-chen',
    bio: 'Mike Chen is a certified professional dog trainer (CPDT-KA) with over a decade of experience working with dogs of all breeds and temperaments. He specializes in positive reinforcement techniques and behavior modification.',
    avatar: '/images/author-sarah.jpg',
    role: 'Head Dog Trainer & Behavior Specialist',
    credentials: 'CPDT-KA, AKC CGC Evaluator',
    website: '',
    twitter: '@mikechen_trainer',
    instagram: '@mikechentraining',
    pinterest: '',
    facebook: '',
    email: 'mike@dogparentguide.com',
    post_count: 32,
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    slug: 'emily-rodriguez',
    bio: 'Emily Rodriguez is a professional pet groomer and dog care specialist with expertise in breed-specific grooming techniques. She runs her own grooming studio and has worked with hundreds of breeds.',
    avatar: '/images/author-sarah.jpg',
    role: 'Grooming Expert & Content Writer',
    credentials: 'Certified Master Groomer',
    website: '',
    twitter: '',
    instagram: '@emilygrooming',
    pinterest: '@emilygrooms',
    facebook: '',
    email: 'emily@dogparentguide.com',
    post_count: 28,
    status: 'active'
  }
];
