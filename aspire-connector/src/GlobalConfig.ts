import { OperationGlobalConfigHttp } from '@trayio/cdk-dsl/connector/operation/OperationGlobalConfig';
import { AspireConnectorAuth, getBaseUrlForEnvironment } from './AspireConnectorAuth';

/*
 * IMPORTANT NOTE: DO NOT DELETE THIS FILE
 * This is a global configuration that is used by all operations in the connector.
 * The base URL is determined by the environment (production, sandbox, or demo).
 * Authentication uses Bearer tokens that are automatically refreshed.
 *
 * IMPORTANT NOTE: Do not change the name of the variable `globalConfigHttp` as it is used by the internal Raw Http Operation.
 * You can ignore this configuration if you have disabled the Raw Http Operation in connector.json
 */
export const globalConfigHttp =
	OperationGlobalConfigHttp.create<AspireConnectorAuth>()
		.withBaseUrl((ctx) => {
			const env = ctx?.auth?.user?.environment ?? 'production';
			return ctx?.auth?.user?.base_url ?? getBaseUrlForEnvironment(env);
		})
		.requestTemplate((ctx, input, request) => {
			// Add Bearer token to all requests
			const token = ctx?.auth?.user?.access_token;
			if (token) {
				return request.withBearerToken(token);
			}
			return request;
		});
