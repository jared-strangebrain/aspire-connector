const path = require('path');
const O = require('fp-ts/Option');
const { AxiosHttpClient } = require('@trayio/axios/http/AxiosHttpClient');
const { NodeFsFileStorage } = require('@trayio/commons/file/NodeFsFileStorage');
const { OperationExecutionGateway } = require('@trayio/cdk-runtime/connector/operation/OperationExecutionGateway');

const distRoot = path.resolve(__dirname, '..', 'dist');
// eslint-disable-next-line import/no-dynamic-require, global-require
const { tokenRequestHandler } = require(path.join(distRoot, '#token_request', 'handler.js'));
// eslint-disable-next-line import/no-dynamic-require, global-require
const { properties_getHandler } = require(path.join(distRoot, 'properties_get', 'handler.js'));

const clientId = process.env.ASPIRE_CLIENT_ID || process.argv[2];
const clientSecret = process.env.ASPIRE_CLIENT_SECRET || process.argv[3];
const environment = (process.env.ASPIRE_ENVIRONMENT || process.argv[4] || 'demo').toLowerCase();

if (!clientId || !clientSecret) {
  console.error('Usage:');
  console.error('  ASPIRE_CLIENT_ID=<id> ASPIRE_CLIENT_SECRET=<secret> node scripts/run-properties-get.js [environment]');
  console.error('  node scripts/run-properties-get.js <clientId> <clientSecret> [environment]');
  process.exit(1);
}

async function main() {
  const gateway = new OperationExecutionGateway(new AxiosHttpClient(), new NodeFsFileStorage());

  const tokenExecutionOpt = gateway.lookup(tokenRequestHandler, true);
  if (O.isNone(tokenExecutionOpt)) {
    throw new Error('Could not resolve #token_request handler');
  }

  const ctx = {
    auth: {
      app: {
        client_id: clientId,
        client_secret: clientSecret,
        environment,
      },
    },
  };

  const tokenResult = await tokenExecutionOpt.value.execute(ctx, {
    client_id: clientId,
    client_secret: clientSecret,
    environment,
  });

  console.log('Token request result:', JSON.stringify(tokenResult, null, 2));

  if (!tokenResult.isSuccess) {
    process.exitCode = 1;
    return;
  }

  ctx.auth.user = {
    access_token: tokenResult.value.access_token,
    refresh_token: tokenResult.value.refresh_token,
  };

  const baseUrl = `${ctx.auth.app.environment === 'demo' ? 'https://aspire-clouddemo-ext.youraspire.com' : ctx.auth.app.environment === 'sandbox' ? 'https://cloudsandbox-api.youraspire.com' : 'https://cloud-api.youraspire.com'}`;

  const directUrl = `${baseUrl}/Properties?limit=5`;
  try {
    const directResponse = await fetch(directUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ctx.auth.user.access_token}`,
      },
    });
    const directText = await directResponse.text();
    console.log('Direct fetch status:', directResponse.status, directResponse.statusText);
    console.log('Direct fetch body (first 1000 chars):', directText.slice(0, 1000));
  } catch (error) {
    console.error('Direct fetch failed:', error instanceof Error ? error.message : error);
  }

  const propertiesExecutionOpt = gateway.lookup(properties_getHandler, true);
  if (O.isNone(propertiesExecutionOpt)) {
    throw new Error('Could not resolve properties_get handler');
  }

  const propertiesResult = await propertiesExecutionOpt.value.execute(ctx, {});

  console.log('properties_get result:', JSON.stringify(propertiesResult, null, 2));

  if (!propertiesResult.isSuccess) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Failed to run properties_get:', error instanceof Error ? error.message : error);
  process.exit(1);
});

