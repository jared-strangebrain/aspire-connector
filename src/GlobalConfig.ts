import { OperationGlobalConfigHttp } from '@trayio/cdk-dsl/connector/operation/OperationGlobalConfig';
import { AspireConnectorAuth, getBaseUrlForEnvironment } from './AspireConnectorAuth';

/*
 * IMPORTANT NOTE: DO NOT DELETE THIS FILE
 * This is a global configuration that is used by all operations in the connector.
 * The base URL is determined by the environment (production, sandbox, or demo).
 * Authentication uses Bearer tokens that are automatically refreshed.
 *
 * IMPORTANT NOTE: Do not change the name of the variable globalConfigHttp as it is used by the internal Raw Http Operation.
 * You can ignore this configuration if you have disabled the Raw Http Operation in connector.json
 */
export const globalConfigHttp =
	OperationGlobalConfigHttp.create<AspireConnectorAuth>()
		.withBaseUrl((ctx) => {
			// Always use environment from app auth (the authentication form)
			// Convert to lowercase to handle any case sensitivity issues
			const rawEnv = ctx?.auth?.app?.environment;
			const env = (rawEnv?.toLowerCase() ?? 'demo') as "production" | "sandbox" | "demo";
			const baseUrl = getBaseUrlForEnvironment(env);
			console.log('[GlobalConfig] Base URL Configuration:');
			console.log('  - Raw environment:', rawEnv);
			console.log('  - Normalized environment:', env);
			console.log('  - Base URL:', baseUrl);
			return baseUrl;
		})
		.withBearerToken((ctx) => {
			const token = ctx?.auth?.user?.access_token ?? '';
			console.log('[GlobalConfig] Token Configuration:');
			console.log('  - Token exists:', !!token);
			console.log('  - Token length:', token.length);
			if (token) {
				// Log first/last 10 chars for debugging (safe to show in logs)
				const preview = token.length > 20 
					? `${token.substring(0, 10)}...${token.substring(token.length - 10)}`
					: '***';
				console.log('  - Token preview:', preview);
				console.log('  - Full token (for 401 debugging):', token);
			} else {
				console.log('  - WARNING: No access token found!');
			}
			console.log('  - Refresh token exists:', !!(ctx?.auth?.user?.refresh_token));
			console.log('  - App auth exists:', !!(ctx?.auth?.app));
			console.log('  - User auth exists:', !!(ctx?.auth?.user));
			return token;
		})
		.addHeader((_ctx) => ({ name: "Accept", value: "application/json" }));

