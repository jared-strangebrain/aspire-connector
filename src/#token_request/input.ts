/**
 * Token request input for Aspire API authentication
 * 
 * This is the authentication form that users fill out in Tray.
 * For Token Based authentication, Tray passes the auth parameters directly,
 * not wrapped in auth_form_input.
 * 
 * Based on: https://guide.youraspire.com/apidocs/authentication-authorization-1
 */
export type TokenRequestInput = {
  /**
   * @title Client ID
   * @description Your Aspire API Client ID (created in Aspire Admin > API)
   */
  client_id: string;
  
  /**
   * @title Client Secret  
   * @description Your Aspire API Client Secret
   */
  client_secret: string;
  
  /**
   * @title Environment
   * @description Select your Aspire environment
   */
  environment: "production" | "sandbox" | "demo";
};

