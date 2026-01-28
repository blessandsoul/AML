// User type (matches backend SafeUser model)
export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: UserRole[]; // Array of roles (user can have multiple roles)
    isActive: boolean;
    emailVerified: boolean;

    // Profiles
    companyProfile?: ICompanyProfile | null;
    guideProfile?: IGuideProfileResponse | null;
    driverProfile?: IDriverProfileResponse | null;

    driverProfileId?: string;
    guideProfileId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyProfile {
    id: string;
    companyName: string;
    description?: string;
    registrationNumber?: string;
    logoUrl?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IGuideProfileResponse {
    id: string;
    bio?: string;
    languages: string | null; // JSON string from DB
    yearsOfExperience?: number;
    photoUrl?: string;
    phoneNumber?: string;
    isVerified: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IDriverProfileResponse {
    id: string;
    bio?: string;
    vehicleType?: string;
    vehicleCapacity?: number;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: number;
    licenseNumber?: string;
    photoUrl?: string;
    phoneNumber?: string;
    isVerified: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}


export type UserRole = 'USER' | 'COMPANY' | 'ADMIN' | 'GUIDE' | 'DRIVER' | 'TOUR_AGENT';

// Auth tokens
export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

// Request types
export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface CreateUserInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'USER' | 'COMPANY' | 'ADMIN' | 'TOUR_AGENT' | 'GUIDE' | 'DRIVER';
}

export interface ICompanyRegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
    registrationNumber?: string;
    description?: string;
    websiteUrl?: string;
    phoneNumber?: string;
}

// Guide profile for claim role
export interface IGuideProfile {
    bio?: string;
    languages: string[];
    yearsOfExperience?: number;
    phoneNumber?: string;
}

// Driver profile for claim role
export interface IDriverProfile {
    bio?: string;
    vehicleType?: string;
    vehicleCapacity?: number;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: number;
    licenseNumber?: string;
    phoneNumber?: string;
}

// Claim GUIDE role request
export interface IClaimGuideRoleRequest {
    role: 'GUIDE';
    profile: IGuideProfile;
}

// Claim DRIVER role request
export interface IClaimDriverRoleRequest {
    role: 'DRIVER';
    profile: IDriverProfile;
}

// Union type for claim role request
export type IClaimRoleRequest = IClaimGuideRoleRequest | IClaimDriverRoleRequest;

// State types
export interface IAuthState {
    user: IUser | null;
    tokens: IAuthTokens | null;
    isAuthenticated: boolean;
}
