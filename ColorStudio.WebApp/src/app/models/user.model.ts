import { BaseModel } from './base.model';

export interface User extends BaseModel {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    token?: string;
}

export enum UserRole {
    Admin = 'Admin',
    User = 'User'
} 