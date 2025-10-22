import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth, getBaseUrlForEnvironment } from '../AspireConnectorAuth';
import { TokenRequestInput } from './input';
import { TokenRequestOutput, AspireTokenResponse } from './output';

// This operation is used for Token Based authentication to get access tokens
export const tokenRequestHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  TokenRequestInput,
  TokenRequestOutput
>((handler) =>
  handler.usingComposite(async (ctx, input, invoke) => {
    // Get the environment from the input (Token Based auth passes directly, not in auth_form_input)
    const rawEnv = input.environment;
    const env = (rawEnv?.toLowerCase() ?? 'demo') as "production" | "sandbox" | "demo";
    const baseUrl = getBaseUrlForEnvironment(env);
    const authUrl = `${baseUrl}/Authorization`;
    
    console.log('[TokenRequest] Starting authentication');
    console.log('[TokenRequest] Environment:', env);
    console.log('[TokenRequest] URL:', authUrl);
    console.log('[TokenRequest] ClientId:', input.client_id);
    
    try {
      // Make the authentication request
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ClientId: input.client_id,
          Secret: input.client_secret
        })
      });
      
      console.log('[TokenRequest] Response status:', authResponse.status);
      
      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('[TokenRequest] Authentication failed:', errorText);
        return OperationHandlerResult.failure({
          _tag: 'ConnectorError',
          message: `Authentication failed (${authResponse.status}): ${errorText}`
        });
      }
      
      const data: AspireTokenResponse = await authResponse.json();
      console.log('[TokenRequest] Token exists:', !!data.Token);
      console.log('[TokenRequest] RefreshToken exists:', !!data.RefreshToken);
      
      if (!data.Token) {
        return OperationHandlerResult.failure({
          _tag: 'ConnectorError',
          message: 'Authentication response missing Token field'
        });
      }
      
      console.log('[TokenRequest] Authentication successful');
      // For Token Based auth, return token data directly (not wrapped in body/headers)
      return OperationHandlerResult.success({
        access_token: data.Token,
        refresh_token: data.RefreshToken,
        token_type: 'Bearer',
        expires_in: 86400
      });
    } catch (error) {
      console.error('[TokenRequest] Exception during authentication:', error);
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: `Authentication error: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  })
);
