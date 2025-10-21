/**
 * Token request input for Aspire API authentication
 * 
 * This is the authentication form that users fill out in Tray.
 * The auth_form_input structure is required for token-based authentication.
 * 
 * Based on: https://guide.youraspire.com/apidocs/authentication-authorization-1
 */
export type TokenRequestInput = {
  auth_form_input: {
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
};

