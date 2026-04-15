export interface User {
    id: string;
    name: string;
    email: string;
    backup_email: string;
    password: string;
    confirmPassword?: string;
    address: string;
    phone: string;
    profile_picture?: string;
    role_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}