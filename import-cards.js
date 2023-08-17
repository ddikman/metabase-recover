const fs = require('fs').promises;
const dotenv = require('dotenv')
dotenv.config()

// GET INPUTS

function getEnvOrFail(name) {
  const value = process.env[name]
  if (!value || value === '') {
    console.error(`Environment variable ${name} is not defined`);
    process.exit(1);
  }
  return value
}

const METABASE_URL = getEnvOrFail('MB_URL')
const METABASE_USERNAME = getEnvOrFail('MB_USERNAME')
const METABASE_PASSWORD = getEnvOrFail('MB_PASSWORD')

if (process.argv.length !== 3) {
  console.error('Usage: node <script_name> <path_to_json_file>');
  process.exit(1);
}
const FILENAME = process.argv[2];

async function readInputFile(filePath) {
  const jsonString = await fs.readFile(filePath, 'utf8');
  return JSON.parse(jsonString);
}

async function getSessionToken() {
  const endpoint = `${METABASE_URL}/api/session`;

  const body = JSON.stringify({
    username: METABASE_USERNAME,
    password: METABASE_PASSWORD
  })
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error('Error fetching session token:', responseData)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Session token:', responseData)
    return responseData.id;
  } catch (error) {
    console.error('Error fetching session token');
    throw error
  }
}

async function createQuery(query, token) {
  const endpoint = `${METABASE_URL}/api/card`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Metabase-Session': token
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Query created:', responseData);
  } catch (error) {
    console.error('Error creating query:', error);
  }
}

(async () => {
  const queries = await readInputFile(FILENAME);
  const sessionToken = await getSessionToken();
  console.log(`Importing ${queries.length} queries...`)
  for (let i = 0; i < queries.length; i++) {
    await createQuery(queries[i], sessionToken);
    console.log(`Imported query ${i+1} of ${queries.length}`)
  }
})();


