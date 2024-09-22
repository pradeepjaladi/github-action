const Constants = Object.freeze({
  TEXT_FILE: '.txt',
  CONTENT_TYPE_TEXT: 'text/plain'
})

class AutomationAttachment {
  constructor(caseResult = null) {
    if (caseResult) {
      this.name = `${caseResult.getSafeName()}${Constants.TEXT_FILE}`
      this.contentType = Constants.CONTENT_TYPE_TEXT
      this.data =
        caseResult.getErrorStackTrace() || caseResult.getErrorDetails()
    } else {
      this.name = null
      this.contentType = null
      this.data = null
    }
  }

  getName() {
    return this.name
  }

  setName(name) {
    this.name = name
  }

  getContentType() {
    return this.contentType
  }

  setContentType(contentType) {
    this.contentType = contentType
  }

  getData() {
    return this.data
  }

  setData(data) {
    this.data = data
  }
}

module.exports = AutomationAttachment
