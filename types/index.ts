// User types
export interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  dateOfBirth: string | null;
  authProvider: 'phone' | 'google';
  profilePicture: string | null;
  role: 'user' | 'professional' | 'admin';
  phoneVerified: boolean;
  isActive: boolean;
  isFlagged: boolean;
  createdAt: string;
}

// Category types
export interface Category {
  id: number;
  slug: string;
  name: string;
  icon: string;
  type: 'emergency' | 'project';
  sortOrder: number;
  chips: CategoryChip[];
  conditionalFields?: CategoryConditionalField[];
  pricing?: CategoryPricing[];
}

export interface CategoryChip {
  id: number;
  categoryId: number;
  label: string;
  slug: string;
  sortOrder: number;
}

export interface CategoryConditionalField {
  id: number;
  categoryId: number;
  fieldKey: string;
  label: string;
  fieldType: 'text' | 'number' | 'select' | 'multi_select' | 'boolean';
  options: string[] | null;
  required: boolean;
  showWhenChipSlugs: string[] | null;
}

export interface CategoryPricing {
  id: number;
  categoryId: number;
  urgencyTier: UrgencyTier;
  priceMXN: number;
  qualifiedSurchargeMXN: number;
}

export type UrgencyTier = 'standard' | 'today' | 'immediate';

// Lead types
export interface Lead {
  id: number;
  userId: string;
  categoryId: number;
  urgencyTier: UrgencyTier;
  status: LeadStatus;
  description: string;
  lat: number;
  lng: number;
  address: string;
  photos: string[];
  priceMXN: number;
  isQualified: boolean;
  createdAt: string;
  category?: Category;
  chips?: LeadChip[];
}

export type LeadStatus = 'pending' | 'matched' | 'taken' | 'in_progress' | 'completed' | 'cancelled' | 'expired';

export interface LeadChip {
  id: number;
  leadId: number;
  categoryChipId: number;
  categoryChip?: CategoryChip;
}

// Professional types
export interface ProfessionalProfile {
  id: number;
  userId: string;
  businessName: string;
  description: string;
  baseLat: number;
  baseLng: number;
  serviceRadiusKm: number;
  isAvailable: boolean;
  rating: number;
  completedJobs: number;
  avgResponseTimeMinutes: number;
  acceptanceRate: number;
  cancellationRate: number;
  badges: string[];
  onboardingStatus: string;
}

// Search types
export interface SearchFilters {
  query: string;
  categorySlug: string | null;
  urgency: UrgencyTier | null;
  maxDistance: number | null;
}

// Service Request types
export interface ServiceRequestData {
  categoryId: number;
  chipIds: number[];
  conditionalFields: { fieldId: number; value: string }[];
  description: string;
  photos: string[];
  lat: number;
  lng: number;
  address: string;
  urgencyTier: UrgencyTier;
  preferredSchedule: string;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Map types
export interface MapMarker {
  id: number | string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

export interface MapPosition {
  lat: number;
  lng: number;
}
