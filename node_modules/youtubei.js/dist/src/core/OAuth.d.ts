import { OAuthError } from '../utils/Utils.js';
import type Session from './Session.js';
/**
 * Represents the credentials used for authentication.
 */
export interface Credentials {
    /**
     * Token used to sign in.
     */
    access_token: string;
    /**
     * Token used to get a new access token.
     */
    refresh_token: string;
    /**
     * Access token's expiration date, which is usually 24hrs-ish.
     */
    expires: Date;
    /**
     * Optional client ID.
     */
    client_id?: string;
    /**
     * Optional client secret.
     */
    client_secret?: string;
}
export type OAuthAuthPendingData = any;
export type OAuthAuthEventHandler = (data: {
    credentials: Credentials;
    status: 'SUCCESS';
}) => any;
export type OAuthAuthPendingEventHandler = (data: OAuthAuthPendingData) => any;
export type OAuthAuthErrorEventHandler = (err: OAuthError) => any;
export type OAuthClientIdentity = {
    client_id: string;
    client_secret: string;
};
export default class OAuth {
    #private;
    static TAG: string;
    constructor(session: Session);
    /**
     * Starts the auth flow in case no valid credentials are available.
     */
    init(credentials?: Credentials): Promise<void>;
    cacheCredentials(): Promise<void>;
    removeCache(): Promise<void>;
    /**
     * Refresh access token if the same has expired.
     */
    refreshIfRequired(): Promise<void>;
    revokeCredentials(): Promise<Response | undefined>;
    get credentials(): Credentials | undefined;
    get has_access_token_expired(): boolean;
    validateCredentials(): this is this & {
        credentials: Credentials;
    };
}
