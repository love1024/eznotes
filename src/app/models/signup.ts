/**
 * Login Form Model
 * 
 * @export
 * @class Login
 */
export interface ISignUp {
    emailAddress: number;
    password: string;
    firstName: string;
    lastName: string;
}

export interface ISignUpResult {
  emailAddress: number;
  password: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}