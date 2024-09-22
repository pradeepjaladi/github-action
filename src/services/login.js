const core = require('@actions/core')
const http = require('@actions/http-client')

class OAuthClient {
  /**
   * Initializes the OAuthClient with base URL, client credentials, and token endpoint.
   * @param {string} baseUrl - The base URL of the API.
   * @param {string} clientId - The client ID for authentication.
   * @param {string} clientSecret - The client secret for authentication.
   */
  constructor(baseUrl, clientId, clientSecret) {
    this.baseUrl = baseUrl
    this.clientId = clientId
    this.clientSecret = clientSecret
    core.debug(
      `Base URL : ${baseUrl} Client ID : ${clientId} Client Secret : ${clientSecret}`
    )
  }

  /**
   * Encodes client credentials in Base64 format.
   * @returns {string} Base64 encoded client credentials.
   */
  getAuthorizationHeader() {
    core.debug(
      `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
    )
    return `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
  }

  /**
   * Requests an OAuth token using the 'password' grant type.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} A promise that resolves to the OAuth token response.
   */
  async requestToken(uname, pwd) {
    const url = `${this.baseUrl}/oauth/token`

    core.debug(`Login URL : ${url}`)

    // Headers for the request
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: this.getAuthorizationHeader()
    }

    const body = {
      grant_type: 'password',
      username: uname,
      password: pwd
    }

    core.debug(`Headers : ${headers}`)
    core.debug(`Body : ${body}`)

    try {
      // Make the POST request to fetch the token
      const httpClient = new http.HttpClient()

      const response = await httpClient.post(url, body, { headers })
      core.debug(`Response : ${response.data}`)
      return response.data // Return the full response data, including the access token
    } catch (error) {
      // Handle error and throw it back for the caller to manage
      throw new Error(
        `Error fetching token: ${error.response ? error.response.data : error.message}`
      )
    }
  }
}

module.exports = OAuthClient
