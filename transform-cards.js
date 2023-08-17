/**
 * This script reformats the Metabase export of the `REPORT_CARD` table to a format that the import script can use.
 * Pipe the content of a file to this script and save the output.
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let inputJSON = '';

rl.on('line', (line) => {
  inputJSON += line;
});

rl.on('close', () => {
  const parsedInput = JSON.parse(inputJSON);
  transformData(parsedInput.data);
});

function transformData(dataArray) {
  const transformed = dataArray.map(item => {
    return {
      name: item.NAME,
      dataset_query: JSON.parse(item.DATASET_QUERY),
      display: item.DISPLAY.toLowerCase(),
      visualization_settings: JSON.parse(item.VISUALIZATION_SETTINGS),
      database: item.DATABASE_ID
    };
  });

  console.log(JSON.stringify(transformed, null, 2));
}
