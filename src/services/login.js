const Client = require('node-rest-client').Client

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
      `Base URL: ${baseUrl}, Client ID: ${clientId}, Client Secret: ${clientSecret}`
    )
  }

  /**
   * Encodes client credentials in Base64 format.
   * @returns {string} Base64 encoded client credentials.
   */
  getAuthorizationHeader() {
    return `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
  }

  /**
   * Requests an OAuth token using the 'password' grant type.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} A promise that resolves to the OAuth token response.
   */
  requestToken(username, password) {
    const loginUrl = `${this.baseUrl}/oauth/token`
    const loginData = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    const client = new Client()

    const args = {
      data: loginData,
      headers: {
        Authorization: this.getAuthorizationHeader(),
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }

    // Correctly creating and resolving the Promise
    return new Promise((resolve, reject) => {
      client
        .post(loginUrl, args, (data, response) => {
          if (data.error) {
            console.error('Error:', data.error_description)
            reject(new Error(data.error_description))
          } else {
            resolve(data)
          }
        })
        .on('error', err => {
          reject(new Error(`HTTP Request Error: ${err.message}`))
        })
    })
  }
}

module.exports = OAuthClient
