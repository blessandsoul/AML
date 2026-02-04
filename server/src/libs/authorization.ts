import { ForbiddenError } from './errors.js';

/**
 * User roles in the AML system
 */
export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

/**
 * Role hierarchy (higher index = more permissions)
 */
const roleHierarchy: Record<UserRoleType, number> = {
  USER: 1,
  ADMIN: 2,
};

/**
 * Check if user has one of the required roles
 */
export function hasRole(userRole: string, requiredRoles: UserRoleType[]): boolean {
  return requiredRoles.includes(userRole as UserRoleType);
}

/**
 * Check if user role is at least at the required level
 */
export function hasMinimumRole(userRole: string, minimumRole: UserRoleType): boolean {
  const userLevel = roleHierarchy[userRole as UserRoleType] ?? 0;
  const requiredLevel = roleHierarchy[minimumRole];
  return userLevel >= requiredLevel;
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: string): boolean {
  return userRole === UserRole.ADMIN;
}

/**
 * Check if user can manage the resource (owner or admin)
 */
export function canManageResource(
  userId: string,
  resourceOwnerId: string,
  userRole: string
): boolean {
  return userId === resourceOwnerId || isAdmin(userRole);
}

/**
 * Require one of the specified roles, throw ForbiddenError if not
 */
export function requireRole(userRole: string, requiredRoles: UserRoleType[]): void {
  if (!hasRole(userRole, requiredRoles)) {
    throw new ForbiddenError(
      `This action requires one of the following roles: ${requiredRoles.join(', ')}`
    );
  }
}

/**
 * Require minimum role level, throw ForbiddenError if not
 */
export function requireMinimumRole(userRole: string, minimumRole: UserRoleType): void {
  if (!hasMinimumRole(userRole, minimumRole)) {
    throw new ForbiddenError(`This action requires at least ${minimumRole} role`);
  }
}

/**
 * Require resource ownership or admin role
 */
export function requireOwnershipOrAdmin(
  userId: string,
  resourceOwnerId: string,
  userRole: string
): void {
  if (!canManageResource(userId, resourceOwnerId, userRole)) {
    throw new ForbiddenError('You do not have permission to manage this resource');
  }
}
