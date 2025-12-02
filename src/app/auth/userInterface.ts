export interface UserInterface {
    username: string;
    id: number;
    role_number_fk: number;
}

export interface UserUpdateInterface {
    username?: string;
    email?: string;
    password?: string;
    role_number_fk?: number;
}