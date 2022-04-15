const { ProjectConfig } = require('@jovotech/cli-core');
const { GoogleAssistantCli } = require('@jovotech/platform-googleassistant');
const { AlexaCli } = require('@jovotech/platform-alexa');
const { ServerlessCli } = require('@jovotech/target-serverless');

/*
|--------------------------------------------------------------------------
| JOVO PROJECT CONFIGURATION
|--------------------------------------------------------------------------
|
| Information used by the Jovo CLI to build and deploy projects
| Learn more here: www.jovo.tech/docs/project-config
|
*/
const project = new ProjectConfig({
  endpoint: '${JOVO_WEBHOOK_URL}',
  plugins: [
    // @see https://www.jovo.tech/marketplace/platform-googleassistant/project-config
    new GoogleAssistantCli({ projectId: '<YOUR-PROJECT-ID>' }),

    // @see https://www.jovo.tech/marketplace/platform-alexa/project-config
    new AlexaCli({ locales: { en: ['en-US'] } }),

    // @see https://www.jovo.tech/marketplace/target-serverless
    new ServerlessCli(),
  ],
});

module.exports = project;
