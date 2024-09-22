const core = require('@actions/core')
const { wait } = require('./wait')
const { getTestResults } = require('./services/filereader')
const path = require('path')
const OAuthClient = require('./services/login')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    // Get inputs from action.yml
    const ms = core.getInput('milliseconds', { required: true })

    // Retrieve the input values (URL, username, password) from inputs/secrets
    const url = core.getInput('url', { required: true })
    const username = core.getInput('username', { required: true })
    const password = core.getInput('password', { required: true }) // Password from secret
    const pattern = core.getInput('pattern', { required: true })

    //const project = core.getInput('projectid', { required: true })
    //const releaseId = core.getInput('releaseid', { required: true })

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Output the inputs for debugging (omit sensitive info like password)
    core.debug(`URL: ${url}`)
    core.debug(`Username: ${username}`)
    core.debug(`Pattern: ${pattern}`)
    //core.debug(`Project ID: ${project}`)
    //core.debug(`Release ID: ${releaseId}`)

    // Create a new instance of OAuthClient with your base URL, client ID, and client secret
    const client = new OAuthClient(url, 'apitryout', '')
    const tokenResponse = await client.requestToken(username, password)
    core.debug(`tokenResponse: ${tokenResponse}`)
    const response = JSON.parse(tokenResponse)
    core.debug(`response: ${response}`)
    core.debug(`token: ${response.access_token}`)

    // Log the access token
    console.log('Access Token:', response.access_token)

    const projectBaseDir = process.env.GITHUB_WORKSPACE
    const filePath = path.join(projectBaseDir, '/target')

    const files = getTestResults(filePath, pattern)
    console.log('Found files:', files)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
