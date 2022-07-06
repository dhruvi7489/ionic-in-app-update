
export class LoginResponse {

    private _jwtToken: string;
    private _jwtTokenType: string;
    private _userName: string;
    private _email: string;
    private _userId: string;
    private _roles: any[];
    private _expires_in: number;
    private _jti: string;
    private _scope: string;
    private _token_type: string;

    get jwtToken(): string {
        return this._jwtToken;
    }
    set jwtToken(value: string) {
        this._jwtToken = value;
    }

    get tokentype(): string {
        return this._jwtTokenType;
    }
    set tokentype(value: string) {
        this._jwtTokenType = value;
    }

    get userName(): string {
        return this._userName;
    }
    set userName(value: string) {
        this._userName = value;
    }

    get userId(): string {
        return this._userId;
    }
    set userId(value: string) {
        this._userId = value;
    }

    get email(): string {
        return this._email;
    }
    set email(value: string) {
        this._email = value;
    }

    get authorities(): any[] {
        return this._roles;
    }
    set authorities(value: any[]) {
        this._roles = value;
    }

    get expires_in(): number {
        return this._expires_in;
    }
    set expires_in(value: number) {
        this._expires_in = value;
    }

    get jti(): string {
        return this._jti;
    }
    set jti(value: string) {
        this._jti = value;
    }

    get scope(): string {
        return this._scope;
    }
    set scope(value: string) {
        this._scope = value;
    }

    get token_type(): string {
        return this._token_type;
    }
    set token_type(value: string) {
        this._token_type = value;
    }
}
