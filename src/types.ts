export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: 'engineering' | 'automation' | 'digital';
  iconName: string; // Refers to Lucide icon names
}

export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'mechanical' | 'electrical' | 'automation' | 'creative';
  imageUrl: string;
  specifications: string[];
}

export interface TechnologyItem {
  name: string;
  category: 'hardware' | 'software' | 'automation' | 'creative';
  logoText: string;
  rating: number; // Experience/proficiency out of 100
}

export interface ContactInfo {
  name: string;
  brand: string;
  phone: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  grabcad: string;
  youtube: string;
  instagram: string;
}
