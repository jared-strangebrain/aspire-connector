import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth, getBaseUrlForEnvironment } from '../AspireConnectorAuth';
import { AuthorizationAuthenticateApiRequestInput } from './input';
import { AuthorizationAuthenticateApiRequestOutput } from './output';

export const authorization_authenticate_api_requestHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  AuthorizationAuthenticateApiRequestInput,
  AuthorizationAuthenticateApiRequestOutput
>((handler) =>
  handler.usingComposite(async (ctx, input, invoke) => {
    console.log('[AuthRequest] Starting authentication');
    
    // Determine environment and base URL
    let env: "production" | "sandbox" | "demo" = "demo";
    let clientId: string;
    let clientSecret: string;
    
    // Support both input formats: direct body or auth_form_input
    if (input.auth_form_input) {
      // Tray authentication form input
      env = input.auth_form_input.environment;
      clientId = input.auth_form_input.client_id;
      clientSecret = input.auth_form_input.client_secret;
      console.log('[AuthRequest] Using auth_form_input format');
    } else if (input.body) {
      // Direct API call format
      clientId = input.body.ClientId;
      clientSecret = input.body.Secret;
      console.log('[AuthRequest] Using direct body format');
    } else {
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: 'Missing authentication credentials'
      });
    }
    
    const baseUrl = getBaseUrlForEnvironment(env);
    const authUrl = `${baseUrl}/Authorization`;
    
    console.log('[AuthRequest] Environment:', env);
    console.log('[AuthRequest] URL:', authUrl);
    console.log('[AuthRequest] ClientId:', clientId);
    
    try {
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ClientId: clientId,
          Secret: clientSecret
        })
      });
      
      console.log('[AuthRequest] Response status:', authResponse.status);
      
      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('[AuthRequest] Authentication failed:', errorText);
        return OperationHandlerResult.failure({
          _tag: 'ConnectorError',
          message: `Authentication failed (${authResponse.status}): ${errorText}`
        });
      }
      
      const data = await authResponse.json();
      console.log('[AuthRequest] Token exists:', !!data.Token);
      console.log('[AuthRequest] RefreshToken exists:', !!data.RefreshToken);
      
      if (!data.Token) {
        return OperationHandlerResult.failure({
          _tag: 'ConnectorError',
          message: 'Authentication response missing Token field'
        });
      }
      
      console.log('[AuthRequest] Authentication successful');
      return OperationHandlerResult.success(data);
      
    } catch (error) {
      console.error('[AuthRequest] Authentication error:', error);
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: `Authentication error: ${error}`
      });
    }
  })
);

