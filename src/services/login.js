const http = require('@actions/http-client')
const core = require('@actions/core')
const querystring = require('querystring')

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
    console.log(
      `Base URL : ${baseUrl} Client ID : ${clientId} Client Secret : ${clientSecret}`
    )
  }

  /**
   * Encodes client credentials in Base64 format.
   * @returns {string} Base64 encoded client credentials.
   */
  getAuthorizationHeader() {
    console.log(
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
  async requestToken(username, password) {
    const url = `${this.baseUrl}/oauth/token`
    const loginData = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`

    // Set headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: this.getAuthorizationHeader()
    }

    try {
      // Make the POST request to fetch the token
      const httpClient = new http.HttpClient()

      const response = await httpClient.post(url, loginData, headers)
      if (
        response.message.statusCode >= 200 &&
        response.message.statusCode < 300
      ) {
        // Read and parse the response body
        const responseBody = await response.readBody()
        return JSON.parse(responseBody)
      } else {
        throw new Error(
          `Request failed with status code ${response.message.statusCode}`
        )
      }
    } catch (error) {
      core.setFailed(`Error in POST request: ${error.message}`)
      throw error
    }
  }
}

module.exports = OAuthClient
