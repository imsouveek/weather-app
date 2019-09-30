/*
  Yargs command definition. Expected syntax:-
  command <location>
*/

/* Syntax */
exports.command = '* <location>';

/* Description */
exports.describe = 'Get location forecast';

/* Define positional argument */
exports.builder = (yargs) => {
  yargs.positional('location', {
    describe: 'Specify address or location',
    type: 'string'
  });
};
