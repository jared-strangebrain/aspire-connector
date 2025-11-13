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
        // Support both direct inputs and nested auth_form_input (Token Based vs legacy behavior)
        const clientId =
          input.client_id ??
          (input as { auth_form_input?: { client_id?: string } }).auth_form_input?.client_id;
        const clientSecret =
          input.client_secret ??
          (input as { auth_form_input?: { client_secret?: string } }).auth_form_input?.client_secret;
        const rawEnv =
          input.environment ??
          (input as { auth_form_input?: { environment?: string } }).auth_form_input?.environment;

        if (!clientId || !clientSecret) {
          console.error('[TokenRequest] Missing client credentials in input');
          return OperationHandlerResult.failure({
            _tag: 'ConnectorError',
            message: 'Authentication failed: Missing client credentials in token request input'
          });
        }

    const env = (rawEnv?.toLowerCase() ?? 'demo') as "production" | "sandbox" | "demo";
    const baseUrl = getBaseUrlForEnvironment(env);
    const authUrl = `${baseUrl}/Authorization`;
    
    console.log('[TokenRequest] Starting authentication');
    console.log('[TokenRequest] Environment:', env);
    console.log('[TokenRequest] URL:', authUrl);
        console.log('[TokenRequest] ClientId:', clientId);
    
    try {
      // Make the authentication request
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
