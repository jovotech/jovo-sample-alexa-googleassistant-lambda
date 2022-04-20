import { DynamoDb } from '@jovotech/db-dynamodb';
import { app } from './app';

/*
|--------------------------------------------------------------------------
| STAGE CONFIGURATION
|--------------------------------------------------------------------------
|
| This configuration gets merged into the default app config
| Learn more here: www.jovo.tech/docs/staging
|
*/
app.configure({
  plugins: [
    // @see https://www.jovo.tech/marketplace/db-dynamodb
    new DynamoDb({ table: { name: process.env.DYNAMODB_TABLE_NAME || 'jovo-sample-db' } }),
  ],
});

export * from './server.lambda';
