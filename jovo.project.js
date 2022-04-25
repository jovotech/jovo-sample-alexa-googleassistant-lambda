const { ProjectConfig } = require('@jovotech/cli-core');
const { GoogleAssistantCli } = require('@jovotech/platform-googleassistant');
const { AlexaCli } = require('@jovotech/platform-alexa');
const { ServerlessCli } = require('@jovotech/target-serverless');

// This name will appear in the Alexa and Actions on Google consoles
const NAME = 'Jovo Sample';

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
    // "Stageless" configuration for Alexa: Map 'en' model to 'en-US'
    // @see https://www.jovo.tech/marketplace/platform-alexa/project-config
    new AlexaCli({ locales: { en: ['en-US'] } }),

    // "Stageless" configuration for Serverless
    // @see https://www.jovo.tech/marketplace/target-serverless
    new ServerlessCli({
      service: 'jovo-sample',
      provider: {
        runtime: 'nodejs14.x',
        iam: {
          role: {
            statements: [
              {
                Effect: 'Allow',
                Action: [
                  // @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations.html
                  'dynamodb:CreateTable',
                  'dynamodb:DescribeTable',
                  'dynamodb:Query',
                  'dynamodb:Scan',
                  'dynamodb:GetItem',
                  'dynamodb:PutItem',
                  'dynamodb:UpdateItem',
                  'dynamodb:DeleteItem',
                ],
                Resource: 'arn:aws:dynamodb:*:*:table/*',
              },
            ],
          },
        },
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
        // Dev config for Alexa, gets merged into the stageless config
        // @see https://www.jovo.tech/marketplace/platform-alexa/project-config
        new AlexaCli({
          skillId: process.env.ALEXA_SKILL_ID_DEV,
          askProfile: process.env.ALEXA_ASK_PROFILE_DEV,

          // Overrides the skill.json to change the Skill name
          // @see https://www.jovo.tech/marketplace/platform-alexa/project-config#files
          files: {
            'skill-package/skill.json': {
              manifest: {
                publishingInformation: {
                  locales: {
                    'en-US': {
                      name: `${NAME} DEV`,
                    },
                  },
                },
              },
            },
          },
        }),

        // Dev config for Google Assistant
        // @see https://www.jovo.tech/marketplace/platform-googleassistant/project-config
        new GoogleAssistantCli({
          projectId: process.env.GOOGLE_ACTION_PROJECT_ID_DEV,

          // Overrides the settings.yaml to change the Action name
          // @see https://www.jovo.tech/marketplace/platform-alexa/project-config#files
          files: {
            'settings/settings.yaml': {
              localizedSettings: {
                displayName: `${NAME} DEV`,
              },
            },
          },
        }),
      ],

      // @see https://www.jovo.tech/docs/project-config#models
      models: {
        override: {
          en: {
            invocation: 'my dev test app',
          },
        },
      },
    },
    prod: {
      plugins: [
        // Prod config for Alexa, gets merged into the stageless config
        // @see https://www.jovo.tech/marketplace/platform-alexa/project-config
        new AlexaCli({
          skillId: process.env.ALEXA_SKILL_ID_PROD,
          askProfile: process.env.ALEXA_ASK_PROFILE_PROD,
          endpoint: process.env.LAMBDA_ARN_PROD,

          // Overrides the skill.json to change the Skill name
          // @see https://www.jovo.tech/marketplace/platform-alexa/project-config#files
          files: {
            'skill-package/skill.json': {
              manifest: {
                publishingInformation: {
                  locales: {
                    'en-US': {
                      name: `${NAME} PROD`,
                    },
                  },
                },
              },
            },
          },
        }),

        // Prod config for Google Assistant
        // @see https://www.jovo.tech/marketplace/platform-googleassistant/project-config
        new GoogleAssistantCli({
          projectId: process.env.GOOGLE_ACTION_PROJECT_ID_PROD,
          endpoint: process.env.LAMBDA_URL_PROD,

          // Overrides the settings.yaml to change the Action name
          // @see https://www.jovo.tech/marketplace/platform-alexa/project-config#files
          files: {
            'settings/settings.yaml': {
              localizedSettings: {
                displayName: `${NAME} PROD`,
              },
            },
          },
        }),

        // Prod config for Serverless, gets merged into the stageless config
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
