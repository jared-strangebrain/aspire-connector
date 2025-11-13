const path = require('path');
const O = require('fp-ts/Option');
const { AxiosHttpClient } = require('@trayio/axios/http/AxiosHttpClient');
const { NodeFsFileStorage } = require('@trayio/commons/file/NodeFsFileStorage');
const { OperationExecutionGateway } = require('@trayio/cdk-runtime/connector/operation/OperationExecutionGateway');

const distRoot = path.resolve(__dirname, '..', 'dist');
// eslint-disable-next-line import/no-dynamic-require, global-require
const { tokenRequestHandler } = require(path.join(distRoot, '#token_request', 'handler.js'));
// eslint-disable-next-line import/no-dynamic-require, global-require
const { contacts_getHandler } = require(path.join(distRoot, 'contacts_get', 'handler.js'));

const clientId = process.env.ASPIRE_CLIENT_ID || process.argv[2];
const clientSecret = process.env.ASPIRE_CLIENT_SECRET || process.argv[3];
const environment = (process.env.ASPIRE_ENVIRONMENT || process.argv[4] || 'demo').toLowerCase();

if (!clientId || !clientSecret) {
  console.error('Usage:');
  console.error('  ASPIRE_CLIENT_ID=<id> ASPIRE_CLIENT_SECRET=<secret> node scripts/run-contacts-get.js [environment]');
  console.error('  node scripts/run-contacts-get.js <clientId> <clientSecret> [environment]');
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

  const contactsExecutionOpt = gateway.lookup(contacts_getHandler, true);
  if (O.isNone(contactsExecutionOpt)) {
    throw new Error('Could not resolve contacts_get handler');
  }

  const contactsResult = await contactsExecutionOpt.value.execute(ctx, {});

  console.log('contacts_get result:', JSON.stringify(contactsResult, null, 2));

  if (!contactsResult.isSuccess) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Failed to run contacts_get:', error instanceof Error ? error.message : error);
  process.exit(1);
});

