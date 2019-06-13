export interface IPasswordResetEmail {
    emailTo: string;
}

export interface IPasswordResetEmailResult {
    success: boolean;
}

export interface IPasswordReset {
    emailAddress: string;
    newPassword: string;
}

export interface IPasswordResetResult {
    success: boolean;
}