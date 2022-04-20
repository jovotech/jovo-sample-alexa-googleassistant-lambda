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
  plugins: [
    // Default configuration for Alexa: Map 'en' model to 'en-US'
    // @see https://www.jovo.tech/marketplace/platform-alexa/project-config
    new AlexaCli({ locales: { en: ['en-US'] } }),

    // Default configuration for Google Assistant
    // @see https://www.jovo.tech/marketplace/platform-googleassistant/project-config
    new GoogleAssistantCli({
      files: {
        // Workaround: Add manifest.yaml file, @see https://github.com/jovotech/jovo-framework/issues/1238
        'manifest.yaml': {
          version: '1.0',
        },
      },
    }),

    // Default configuration for Serverless
    // @see https://www.jovo.tech/marketplace/target-serverless
    new ServerlessCli({
      service: 'jovo-sample',
      provider: {
        runtime: 'nodejs14.x',
        iamRoleStatements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:CreateTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: '*',
          },
        ],
      },
      functions: {
        handler: {
          url: true, // @see https://www.serverless.com/blog/aws-lambda-function-urls-with-serverless-framework
          timeout: 7, // Sets the timeout to 7 seconds
        },
      },
    }),
  ],

  // @see https://www.jovo.tech/docs/project-config#staging
  defaultStage: 'dev',
  stages: {
    dev: {
      // @see https://www.jovo.tech/docs/webhook
      endpoint: '${JOVO_WEBHOOK_URL}',

      plugins: [
        // @see https://www.jovo.tech/marketplace/platform-alexa/project-config
        new AlexaCli({
          skillId: process.env.ALEXA_SKILL_ID_DEV,
          askProfile: process.env.ALEXA_ASK_PROFILE_DEV,
        }),

        // @see https://www.jovo.tech/marketplace/platform-googleassistant/project-config
        new GoogleAssistantCli({ projectId: process.env.GOOGLE_ACTION_PROJECT_ID_DEV }),
      ],
    },
    prod: {
      plugins: [
        // @see https://www.jovo.tech/marketplace/platform-alexa/project-config
        new AlexaCli({
          skillId: process.env.ALEXA_SKILL_ID_PROD,
          askProfile: process.env.ALEXA_ASK_PROFILE_PROD,
          endpoint: process.env.LAMBDA_ARN_PROD,
        }),

        // @see https://www.jovo.tech/marketplace/platform-googleassistant/project-config
        new GoogleAssistantCli({
          projectId: process.env.GOOGLE_ACTION_PROJECT_ID_PROD,
          endpoint: process.env.LAMBDA_URL_PROD,
        }),

        // @see https://www.jovo.tech/marketplace/target-serverless
        new ServerlessCli({
          provider: {
            stage: 'prod',
            environment: {
              DYNAMODB_TABLE_NAME: 'jovo-sample-db',
            },
          },
          functions: {
            handler: {
              events: [
                {
                  alexaSkill: process.env.ALEXA_SKILL_ID_PROD,
                },
              ],
            },
          },
        }),
      ],
    },
  },
});

module.exports = project;
