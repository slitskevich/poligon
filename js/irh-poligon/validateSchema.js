'use strict';

const Ajv = require('ajv');
const ajv = new Ajv({ verbose: true });

const data = {
    template: "iRH_donation_1_0",
    action: "donate",
    userId: "us-east-1:a6e2109e-e9be-42b6-a96e-f839a43f217e",
    timestamp: 1494076245157,
    eventType: "donation",
    verification: [],
    amount: {
        USD: 0.01
    },
    donatee: {
        donateeId: "bf1a6454-427a-4fb3-8c44-53506db86756",
        description: "Test donatee",
        destinationUrl: "https://api.dwolla.com/accounts/5bae514b-2350-4e71-8296-c520a561aff3",
        name: "iRewardHealth 3, Inc."
    }
};

const schema = {
//   $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'iRewardHealth Donation event, v1.0',
  type: 'object',
  properties: {
    template: {
      description: 'Internal identifier of type of event',
      type: 'string',
      pattern: '^iRH_donation_1_0$',
    },
    userId: {
      description: 'ID of user, primary key of database',
      type: 'string',
      minLength: 36,
      pattern: '^[0-9a-z:-]*$',
    },
    timestamp: {
      description: 'Milliseconds from Epoch',
      type: 'integer',
      minimum: 0,
    },
    eventType: {
      description: "Type of event ('point')",
      type: 'string',
      pattern: '^donation$',
    },
    action: {
      description: 'Type of point event',
      type: 'string',
      enum: ['donate'],
    },
    donatee: {
      description: 'Donatee data',
      type: 'object',
      properties: {
        donateeId: {
          description: 'donatee Identifier, only required upon addition',
          type: 'string',
          minLength: 36,
          pattern: '^[0-9a-z:-]*$',
        },
        name: {
          description: 'donatee name',
          type: 'string',
        },
        description: {
          description: 'donatee description',
          type: 'string',
        },
      },
      required: ['donateeId', 'name'],
    },
    verification: {
      description: 'Data needed to verify financial transactions',
      type: 'array',
      items: {
        description: 'URLs of transactions, if available',
        type: 'string',
        pattern: '^https://',
      },
    },
    deleted: {
      description: 'Flag for whether this event was deleted',
      type: 'boolean',
    },
  },
  required: ['template', 'userId', 'timestamp', 'eventType', 'action', 'donatee'],
}

const validator = ajv.compile(schema);
const valid = validator(data);
console.log('valid: ', valid);
console.log('errors: ', validator.errors);

