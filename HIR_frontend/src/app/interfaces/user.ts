export interface User {
    id: string;
    name: string;
    email: string;
    backup_email: string;
    password: string;
    confirmPassword?: string;
    address: string;
    phone: string;
    profilePicture?: string;
    role_id: number;
}