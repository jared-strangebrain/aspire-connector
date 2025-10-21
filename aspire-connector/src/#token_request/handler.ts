import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth, getBaseUrlForEnvironment } from '../AspireConnectorAuth';
import { TokenRequestInput } from './input';
import { TokenRequestOutput, AspireTokenResponse } from './output';

export const tokenRequestHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  TokenRequestInput,
  TokenRequestOutput
>((handler) =>
  handler.usingComposite(async (ctx, input, invoke) => {
    const baseUrl = getBaseUrlForEnvironment(input.auth_form_input.environment);
    const url = `${baseUrl}/Authorization`;
    
    console.log('[TokenRequest] === AUTHENTICATION START ===');
    console.log('[TokenRequest] URL:', url);
    console.log('[TokenRequest] ClientId:', input.auth_form_input.client_id);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ClientId: input.auth_form_input.client_id,
        Secret: input.auth_form_input.client_secret
      })
    });
    
    console.log('[TokenRequest] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[TokenRequest] FAILED:', errorText);
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: `Authentication failed (${response.status}): ${errorText}`
      });
    }
    
    const data: AspireTokenResponse = await response.json();
    
    console.log('[TokenRequest] Token received:', !!data.Token);
    console.log('[TokenRequest] Token (first 50 chars):', data.Token?.substring(0, 50));
    console.log('[TokenRequest] RefreshToken received:', !!data.RefreshToken);
    console.log('[TokenRequest] RefreshToken (first 50 chars):', data.RefreshToken?.substring(0, 50));
    
    if (!data.Token) {
      console.error('[TokenRequest] ERROR: No Token in response!');
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: 'Response missing Token field'
      });
    }
    
    // CRITICAL: Match Tray example format EXACTLY
    const outputBody = {
      access_token: data.Token,
      refresh_token: data.RefreshToken
    };
    
    console.log('[TokenRequest] Creating success response...');
    console.log('[TokenRequest] output.body.access_token length:', outputBody.access_token.length);
    console.log('[TokenRequest] output.body.refresh_token length:', outputBody.refresh_token?.length);
    
    const finalResult = OperationHandlerResult.success({
      status_code: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: outputBody
    });
    
    console.log('[TokenRequest] === AUTHENTICATION SUCCESS ===');
    
    return finalResult;
  })
);
