class AutomationTestResult {
  constructor() {
    this.buildNumber = null
    this.buildURL = null
    this.executedStartDate = null
    this.executedEndDate = null
    this.automationContent = null
    this.status = null
    this.name = null
    this.order = null
    this.testLogs = []
    this.attachments = []
    this.totalFailedTestSteps = 0
    this.totalSkippedTestSteps = 0
    this.totalSuccessTestSteps = 0
    this.currentOrder = 0
  }

  getExecutedStartDate() {
    return this.executedStartDate
  }

  setExecutedStartDate(executedStartDate) {
    this.executedStartDate = executedStartDate
  }

  getExecutedEndDate() {
    return this.executedEndDate
  }

  setExecutedEndDate(executedEndDate) {
    this.executedEndDate = executedEndDate
  }

  getAutomationContent() {
    return this.automationContent
  }

  setAutomationContent(automationContent) {
    this.automationContent = automationContent
    this.setName(automationContent)
  }

  getStatus() {
    return this.status
  }

  setStatus(status) {
    this.status = status
  }

  getTestLogs() {
    return this.testLogs
  }

  setTestLogs(testLogs) {
    this.testLogs = testLogs
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }

  getAttachments() {
    return this.attachments
  }

  setAttachments(attachments) {
    this.attachments = attachments
  }

  addAttachment(attachment) {
    this.attachments.push(attachment)
    return this.attachments
  }

  getBuildNumber() {
    return this.buildNumber
  }

  setBuildNumber(buildNumber) {
    this.buildNumber = buildNumber
  }

  getBuildURL() {
    return this.buildURL
  }

  setBuildURL(buildURL) {
    this.buildURL = buildURL
  }

  getOrder() {
    return this.order
  }

  setOrder(order) {
    this.order = order
  }

  addTestStepLog(automationTestStepLog, isOverwriteExistingTestSteps) {
    automationTestStepLog.order = this.currentOrder++
    if (isOverwriteExistingTestSteps) {
      this.testLogs.push(automationTestStepLog)
    }
    const status = automationTestStepLog.status
    if (['FAILED', 'REGRESSION'].includes(status.toUpperCase())) {
      this.totalFailedTestSteps += 1
    }
    if (status.toUpperCase() === 'SKIPPED') {
      this.totalSkippedTestSteps += 1
    }
    if (['PASSED', 'FIXED'].includes(status.toUpperCase())) {
      this.totalSuccessTestSteps += 1
    }
    this.setStatus(status)
    if (this.totalFailedTestSteps >= 1) {
      this.status = 'FAIL'
    } else {
      this.status = 'PASS'
    }
    return automationTestStepLog
  }
}

module.exports = AutomationTestResult
