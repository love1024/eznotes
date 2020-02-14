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
  follow: string;
  parentUserId: number;
}

export interface ISignUpResult {
  userId: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  follow: string;
  parentUserId: number;
}
