import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth, getBaseUrlForEnvironment } from '../AspireConnectorAuth';
import { TokenRefreshInput } from './input';
import { TokenRefreshOutput, AspireRefreshTokenResponse } from './output';

export const tokenRefreshHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  TokenRefreshInput,
  TokenRefreshOutput
>((handler) =>
  handler.usingComposite(async (ctx, input, invoke) => {
    const rawEnv = ctx?.auth?.app?.environment;
    const env = (rawEnv?.toLowerCase() ?? 'demo') as "production" | "sandbox" | "demo";
    const baseUrl = getBaseUrlForEnvironment(env);
    const refreshToken = ctx?.auth?.user?.refresh_token;
    
    // STRATEGY 1: Try to refresh using the refresh token
    if (refreshToken) {
      console.log('[TokenRefresh] Attempting token refresh');
      try {
        const refreshResponse = await fetch(`${baseUrl}/Authorization/RefreshToken`, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ RefreshToken: refreshToken })
        });
        
        if (refreshResponse.ok) {
          const data: AspireRefreshTokenResponse = await refreshResponse.json();
          if (data.Token) {
            console.log('[TokenRefresh] SUCCESS via refresh token');
            return OperationHandlerResult.success({
              status_code: refreshResponse.status,
              headers: Object.fromEntries(refreshResponse.headers.entries()),
              body: { access_token: data.Token, refresh_token: data.RefreshToken || refreshToken }
            });
          }
        }
        console.log('[TokenRefresh] Refresh token expired, using client credentials');
      } catch (error) {
        console.log('[TokenRefresh] Refresh failed, using client credentials');
      }
    }
    
    // STRATEGY 2: Automatic re-authentication using client_id and secret
    const clientId = ctx?.auth?.app?.client_id;
    const clientSecret = ctx?.auth?.app?.client_secret;
    
    if (!clientId || !clientSecret) {
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: 'Cannot refresh token: Missing client credentials'
      });
    }
    
    console.log('[TokenRefresh] Automatic re-authentication with client credentials');
    const authResponse = await fetch(`${baseUrl}/Authorization`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ClientId: clientId, Secret: clientSecret })
    });
    
    if (!authResponse.ok) {
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: `Automatic re-authentication failed (${authResponse.status})`
      });
    }
    
    const data: AspireRefreshTokenResponse = await authResponse.json();
    if (!data.Token) {
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: 'Re-authentication response missing Token field'
      });
    }
    
    console.log('[TokenRefresh] SUCCESS via automatic re-authentication');
    return OperationHandlerResult.success({
      status_code: authResponse.status,
      headers: Object.fromEntries(authResponse.headers.entries()),
      body: { access_token: data.Token, refresh_token: data.RefreshToken }
    });
  })
);
