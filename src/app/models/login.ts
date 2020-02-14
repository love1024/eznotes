/**
 * Login Form Model
 *
 * @export
 * @class Login
 */
export class Login {
  public emailAddress: number;
  public password: string;
}

export interface ILoginResult {
  userId: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  token: string;
  emailVerified: boolean;
  expire: Date;
  passwordChanged?: boolean;
  follow: string;
  parentUserId: number;
  role: string;
}
