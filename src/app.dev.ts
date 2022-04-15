import { app } from './app';
import { FileDb } from '@jovotech/db-filedb';
import { JovoDebugger } from '@jovotech/plugin-debugger';

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
    // @see https://www.jovo.tech/marketplace/db-filedb
    new FileDb({
      pathToFile: '../db/db.json',
    }),

    // @see https://www.jovo.tech/docs/debugger
    new JovoDebugger(),
  ],
});

export * from './server.express';
