export interface User {
    id: number;
    name: string;
    email: string;
    backup_email: string;
    password: string;
    confirmPassword?: string;
    address: string;
    phone: string;
}