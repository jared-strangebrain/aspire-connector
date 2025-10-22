import type { TokenOperationHandlerAuth } from "@trayio/cdk-dsl/connector/operation/OperationHandler";

// User auth - populated after #token_request completes
export type AspireUserAuth = {
  access_token: string;
  refresh_token?: string;
};

// App auth - from authentication form (auth_form_input)
export type AspireAppAuth = {
  client_id: string;
  client_secret: string;
  environment: "production" | "sandbox" | "demo";
};

// Combined auth type for the connector
export type AspireConnectorAuth = TokenOperationHandlerAuth<
  AspireUserAuth,
  AspireAppAuth
>;

// Helper functions for authentication

/**
 * Get the base URL for a given environment
 * 
 * @param env - The Aspire environment (production, sandbox, or demo)
 * @returns The base URL for API requests
 */
export function getBaseUrlForEnvironment(env: "production" | "sandbox" | "demo"): string {
  switch (env) {
    case "production":
      return "https://cloud-api.youraspire.com";
    case "sandbox":
      return "https://cloudsandbox-api.youraspire.com";
    case "demo":
      return "https://clouddemo-api.youraspire.com";
    default:
      return "https://clouddemo-api.youraspire.com"; // Default to demo
  }
}
