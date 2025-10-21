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
			console.log('[GlobalConfig] Raw environment:', rawEnv, '-> Normalized:', env, '-> Base URL:', baseUrl);
			return baseUrl;
		})
		.withBearerToken((ctx) => {
			const token = ctx?.auth?.user?.access_token ?? '';
			console.log('[GlobalConfig] Token exists:', !!token, 'Length:', token.length);
			return token;
		})
		.addHeader((_ctx) => ({ name: "Accept", value: "application/json" }));

