export const UserRole = {
    ADMIN: "admin",
    USER: "user"
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface TokenResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface User {
    id: number;
    email: string;
    role: UserRole;
    is_active: boolean;
}

export interface LoginFormValues {
    username: string;
    password: string;
}

export interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
}