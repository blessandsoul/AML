import type { IUser } from '@/features/auth/types/auth.types';

export interface IDashboardStats {
    totalTours: number;
    activeTours: number;
    totalBookings: number;
    totalRevenue: number;
}

// Re-export User as TourAgent since they share the same structure for now
export type TourAgent = IUser;

export interface IGetTourAgentsResponse {
    tourAgents: TourAgent[];
}

// Media type for company photos
export interface ICompanyMedia {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    entityType: string;
    entityId: string;
    uploadedBy: string | null;
    createdAt: string;
    updatedAt: string;
}

// Company types
export interface ICompany {
    id: string;
    userId: string;
    companyName: string;
    description: string | null;
    registrationNumber: string | null;
    logoUrl: string | null;
    websiteUrl: string | null;
    phoneNumber: string | null;
    isVerified: boolean;
    averageRating: number | null;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        emailVerified: boolean;
    };
    photos?: ICompanyMedia[];
}

export interface IUpdateCompanyRequest {
    companyName?: string;
    description?: string;
    registrationNumber?: string;
    logoUrl?: string;
    websiteUrl?: string;
    phoneNumber?: string;
}

export interface IGetMyCompanyResponse {
    company: ICompany;
}
