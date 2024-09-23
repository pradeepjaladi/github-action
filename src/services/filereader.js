const core = require('@actions/core')
const glob = require('@actions/glob')
const io = require('@actions/io')

class FileManager {
  /**
   * Finds files in a specified directory that match a given glob pattern.
   * @param {string} pattern - The glob pattern to match file names.
   * @returns {Promise<string[]>} A promise that resolves to an array of matching file paths.
   */
  async findFiles(pattern) {
    try {
      // Create a globber object with the specified pattern
      const globber = await glob.create(pattern)

      // Get all matching files as an array
      const files = await globber.glob()

      for (const file of files) {
        core.debug(`Found file: ${file}`)
        console.log(`Found file: ${file}`)
      }

      return files
    } catch (error) {
      core.setFailed(`Error finding files: ${error.message}`)
      throw error
    }
  }

  async getTestResults(directory, pattern) {
    const files = await this.findFiles(pattern)
    console.log('Found files:', files)

    if (files.length === 0) {
      core.warning(`No files found in ${directory} with pattern: ${pattern}`)
    }

    return files
  }
}

module.exports = FileManager
