#!/usr/bin/env node

import yargs from 'yargs';
import { baseOptions, writeOptions } from './options';
import { getBrowserslistStats, writeBrowserslistStats } from '../../index';
import { BaseOptionsCombined, WriteOptions } from '../types';
import ora from 'ora';

yargs
  // Middleware to default all the arguments to environment variables.
  .middleware((argv) => {
    const options = argv._.includes('write') ? writeOptions : baseOptions;
    for (const key of Object.keys(options)) {
      if (typeof key === 'string') {
        const parts = key.split(/(?=[A-Z])(?<![A-Z])/);
        const envar = ['BAA', ...parts].join('_').toUpperCase();
        if (envar && process.env[envar]) argv[key] = process.env[envar];
      }
    }
  }, true)
  // Default command to generate and print stats data.
  .command<BaseOptionsCombined>(
    '$0',
    'Generate browserslist stats from Adobe Analytics data.',
    (yargs) => yargs.options(baseOptions),
    async (args) => {
      const spinner = ora(
        'Generating browserslist stats from Adobe Analytics data.'
      ).start();
      try {
        const stats = await getBrowserslistStats(args);
        spinner.succeed();
        console.log(JSON.stringify(stats, null, 2));
        process.exitCode = 0;
      } catch (e) {
        spinner.fail();
        console.error(e);
        process.exitCode = 1;
      }
    }
  )
  // Write command to generate and write stats data to file.
  .command<WriteOptions>(
    'write',
    'Write browserslist stats to file from Adobe Analytics data.',
    (yargs) => yargs.options(writeOptions),
    async (args) => {
      const spinner = ora(
        'Writing browserslist stats to file from Adobe Analytics data.'
      ).start();
      try {
        await writeBrowserslistStats(args);
        spinner.succeed();
        process.exitCode = 0;
      } catch (e) {
        spinner.fail();
        console.error(e);
        process.exitCode = 1;
      }
    }
  )
  // Allow config file and package.json option.
  .config()
  .pkgConf('baa')
  .pkgConf('browserslist-adobe-analytics')
  // Personal preference, default is too narrow.
  .wrap(Math.min(100, yargs.terminalWidth()))
  // Link to moment docs for duration/date formats.
  .epilogue(
    'For possible duration formats see https://momentjs.com/docs/#/durations/\nFor possible date     formats see https://momentjs.com/docs/#/parsing/string/'
  )
  // Do not allow from and until because they are contradictory.
  .conflicts('from', 'until')
  .help().argv;
