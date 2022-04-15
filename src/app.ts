import { GoogleAssistantPlatform } from '@jovotech/platform-googleassistant';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { App } from '@jovotech/framework';

import { GlobalComponent } from './components/GlobalComponent';
import { LoveHatePizzaComponent } from './components/LoveHatePizzaComponent';

/*
|--------------------------------------------------------------------------
| APP CONFIGURATION
|--------------------------------------------------------------------------
|
| All relevant components, plugins, and configurations for your Jovo app
| Learn more here: www.jovo.tech/docs/app-config
|
*/
const app = new App({
  /*
  |--------------------------------------------------------------------------
  | Components
  |--------------------------------------------------------------------------
  |
  | Components contain the Jovo app logic
  | Learn more here: www.jovo.tech/docs/components
  |
  */
  components: [GlobalComponent, LoveHatePizzaComponent],

  /*
  |--------------------------------------------------------------------------
  | Plugins
  |--------------------------------------------------------------------------
  |
  | Includes platforms, database integrations, third-party plugins, and more
  | Learn more here: www.jovo.tech/marketplace
  |
  */
  plugins: [
    // @see https://www.jovo.tech/marketplace/platform-googleassistant
    new GoogleAssistantPlatform(),

    // @see https://www.jovo.tech/marketplace/platform-alexa
    new AlexaPlatform({
      intentMap: { 'AMAZON.StopIntent': 'END', 'AMAZON.CancelIntent': 'END' },
    }),
  ],

  /*
  |--------------------------------------------------------------------------
  | Other options
  |--------------------------------------------------------------------------
  |
  | Includes all other configuration options like logging
  | Learn more here: www.jovo.tech/docs/app-config
  |
  */
  logging: true,
});

export { app };
