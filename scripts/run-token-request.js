const path = require('path');
const O = require('fp-ts/Option');
const { AxiosHttpClient } = require('@trayio/axios/http/AxiosHttpClient');
const { NodeFsFileStorage } = require('@trayio/commons/file/NodeFsFileStorage');
const { OperationExecutionGateway } = require('@trayio/cdk-runtime/connector/operation/OperationExecutionGateway');

// Ensure the connector sources are compiled before running this script
const connectorDist = path.resolve(__dirname, '..', 'dist', '#token_request', 'handler.js');
// eslint-disable-next-line import/no-dynamic-require, global-require
const { tokenRequestHandler } = require(connectorDist);

const clientId = process.env.ASPIRE_CLIENT_ID || process.argv[2];
const clientSecret = process.env.ASPIRE_CLIENT_SECRET || process.argv[3];
const environment = (process.env.ASPIRE_ENVIRONMENT || process.argv[4] || 'demo').toLowerCase();

if (!clientId || !clientSecret) {
  console.error('Usage:');
  console.error('  ASPIRE_CLIENT_ID=<id> ASPIRE_CLIENT_SECRET=<secret> [ASPIRE_ENVIRONMENT=demo] node scripts/run-token-request.js');
  console.error('  node scripts/run-token-request.js <clientId> <clientSecret> [environment]');
  process.exit(1);
}

async function main() {
  const gateway = new OperationExecutionGateway(new AxiosHttpClient(), new NodeFsFileStorage());
  const executionOpt = gateway.lookup(tokenRequestHandler, true);

  if (O.isNone(executionOpt)) {
    throw new Error('Could not resolve #token_request handler from registry');
  }

  const execution = executionOpt.value;

  const ctx = {
    auth: {
      app: {
        client_id: clientId,
        client_secret: clientSecret,
        environment,
      },
    },
  };

  const input = {
    client_id: clientId,
    client_secret: clientSecret,
    environment,
  };

  const result = await execution.execute(ctx, input);

  console.log(JSON.stringify(result, null, 2));

  if (!result.isSuccess) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Failed to run #token_request:', error instanceof Error ? error.message : error);
  process.exit(1);
});

