const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { parseStringPromise } = require('xml2js')
const { findFiles } = require('./services/filereader')
const AutomationTestResult = require('../model/testresults')
const AutomationTestStepLog = require('../model/teststeplog')
const AutomationAttachment = require('../model/automationattachment')

class ToscaTestResultParser {
  /**
   * Parse Tosca test results
   *
   * @param {Object} request - Parse request
   * @return {Promise<Array>} List of AutomationTestResult
   */
  static async parse(request) {
    const logger = request.getListener().getLogger()
    console.info('Scan Tosca test results files and parse the results step.')

    const basedDir = request.getWorkSpace().toURI().getPath()
    const pattern = request.getParseTestResultPattern()

    const resultFiles = await findFiles(basedDir, pattern)
    const map = new Map()
    let currentTestLogOrder = 1

    for (const resultFile of resultFiles) {
      console.info(`Parsing result file: ${resultFile}`)
      const filePath = path.join(basedDir, resultFile)
      const fileContent = fs.readFileSync(filePath, 'utf-8')

      const doc = await parseStringPromise(fileContent)
      const testCaseNodes = doc.executionEntry || []

      if (testCaseNodes.length <= 0) {
        throw new Error('Tosca parser cannot find test cases')
      }

      for (const testCaseNode of testCaseNodes) {
        const testLog = this.buildTestCaseLog(
          testCaseNode,
          request.getOverwriteExistingTestSteps(),
          currentTestLogOrder++,
          logger
        )
        if (!testLog) {
          continue
        }
        const testCaseName = testLog.name
        if (!map.has(testCaseName)) {
          map.set(testCaseName, testLog)
        }
      }
    }

    return Array.from(map.values())
    //return processAttachment(Array.from(map.values()))
  }

  static buildTestCaseLog(
    testCaseNode,
    overwriteExistingTestSteps,
    currentTestLogOrder,
    logger
  ) {
    const testLog = new AutomationTestResult()
    const testCaseElement = testCaseNode

    if (!testCaseElement.testCaseLog) {
      return null
    }

    const testCaseName = testCaseElement.name[0]
    const startTime = testCaseElement.startTime[0]
    const endTime = testCaseElement.endTime[0]
    let startDate
    let endDate

    try {
      startDate = new Date(startTime)
      endDate = new Date(endTime)
    } catch (e) {
      startDate = new Date()
      endDate = new Date()
    }

    console.info(`Getting test case info: ${testCaseName}`)
    const testStepNodes = testCaseElement.testStepLog || []

    let totalFailedTestSteps = 0
    let totalSkippedTestSteps = 0
    let totalTestSteps = 0

    let currentTestStepOrder = 0
    const testStepLogs = []
    const attachments = []

    for (const testStepNode of testStepNodes) {
      const testStepLog = this.buildTestStepLog(
        testStepNode,
        currentTestStepOrder++
      )
      totalTestSteps += 1
      const testStepStatus = testStepLog.status

      if (['FAILED', 'FAIL', 'ERROR'].includes(testStepStatus.toUpperCase())) {
        totalFailedTestSteps += 1
      }

      if (['SKIP', 'SKIPPED'].includes(testStepStatus.toUpperCase())) {
        totalSkippedTestSteps += 1
      }

      if (overwriteExistingTestSteps) {
        testStepLogs.push(testStepLog)
      }
    }

    const attachment = this.buildAttachments(testCaseElement, testCaseName)
    attachments.push(attachment)

    testLog.order = currentTestLogOrder
    testLog.automationContent = testCaseName
    testLog.executedStartDate = startDate
    testLog.executedEndDate = endDate
    testLog.testLogs = testStepLogs
    testLog.attachments = attachments
    testLog.status = 'PASS'

    if (totalFailedTestSteps >= 1) {
      testLog.status = 'FAIL'
    } else if (totalSkippedTestSteps === totalTestSteps) {
      testLog.status = 'SKIP'
    }

    return testLog
  }

  static buildTestStepLog(testStepElement, testStepOrder) {
    const testStepName = testStepElement.name[0]
    console.info(`Getting test steps info: ${testStepName}`)
    const testStepStatus = testStepElement.result[0]
    const testStepsLog = new AutomationTestStepLog()
    testStepsLog.status = testStepStatus.toUpperCase()
    testStepsLog.expectedResult = testStepName
    testStepsLog.description = testStepName
    testStepsLog.order = testStepOrder
    return testStepsLog
  }

  static buildAttachments(testCaseElement, testCaseName) {
    const testCaseLogElement = testCaseElement.testCaseLog[0]
    const testCaseLog = testCaseLogElement.aggregatedDescription[0]
    const attachment = new AutomationAttachment()
    attachment.name = testCaseName.concat('.txt')
    attachment.contentType = 'text/plain'
    attachment.data = testCaseLog
    return attachment
  }
}

module.exports = ToscaTestResultParser
