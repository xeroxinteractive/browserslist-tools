import { Options } from 'yargs';
import {
  WriteOptions,
  BaseOptionsWithPrivateKey,
  BaseOptionsWithPrivateKeyPath,
} from '../types';

// BaseOptions -> yargs mapping.
export const baseOptions: {
  [key in keyof Required<
    BaseOptionsWithPrivateKey & BaseOptionsWithPrivateKeyPath
  >]: Options;
} = {
  clientId: {
    alias: 'cid',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Integration client ID.',
    demandOption: true,
  },
  technicalAccountId: {
    alias: 't',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Integration technical account ID.',
    demandOption: true,
  },
  orgId: {
    alias: 'o',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Integration organization ID.',
    demandOption: true,
  },
  clientSecret: {
    alias: 'cs',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Integration client secret.',
    demandOption: true,
  },
  privateKey: {
    alias: 'pk',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Integration private key.',
  },
  privateKeyPath: {
    alias: 'pkp',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Integration private key path.',
  },
  passphrase: {
    alias: 'p',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Passphrase used to secure integration public/private key.',
  },
  ims: {
    alias: 'i',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Identity management system ID.',
  },
  rsid: {
    alias: 'r',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Report Suite ID.',
    demandOption: true,
  },
  globalId: {
    alias: 'g',
    type: 'string',
    group: 'Adobe Analytics',
    describe: 'Global ID.',
    demandOption: true,
  },
  duration: {
    alias: 'd',
    type: 'string',
    group: 'Time',
    describe: 'Period of time to request data for.',
    defaultDescription: 'P3M',
  },
  from: {
    alias: 'f',
    type: 'string',
    group: 'Time',
    describe: 'Date to request data from.',
  },
  until: {
    alias: 'u',
    type: 'string',
    group: 'Time',
    describe: 'Date to request data until.',
    defaultDescription: "Today's date",
  },
  limit: {
    alias: 'l',
    type: 'number',
    group: 'Adobe Analytics',
    describe: 'The maximum number of browser entries to request.',
    defaultDescription: '50',
  },
};

// WriteOptions -> yargs mapping.
export const writeOptions: {
  [key in keyof Required<WriteOptions>]: Options;
} = {
  ...baseOptions,
  cwd: {
    alias: 'c',
    type: 'string',
    group: 'File Writing',
    describe: 'The current working directory to write the file in.',
    defaultDescription: 'process.cwd()',
  },
  filename: {
    alias: 'fn',
    type: 'string',
    group: 'File Writing',
    describe: 'The name of the file to write.',
    defaultDescription: 'browserslist-stats.json',
  },
};
