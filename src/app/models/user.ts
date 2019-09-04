export class User {
    public userId?: number;
    public emailAddress: string;
    public firstName: string;
    public lastName: string;
    public emailVerified: boolean;
    public token?: string;

    constructor(x: User) {
        this.userId = x.userId;
        this.emailAddress = x.emailAddress;
        this.firstName = x.firstName;
        this.lastName = x.lastName;
        this.emailAddress = x.emailAddress;
        this.token = x.token;
        
    }
}