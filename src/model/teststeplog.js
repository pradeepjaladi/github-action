class AutomationTestStepLog {
  constructor(
    description = null,
    expectedResult = null,
    order = null,
    status = null
  ) {
    this.description = description
    this.expectedResult = expectedResult
    this.actualResult = null
    this.order = order
    this.status = status
  }

  getDescription() {
    return this.description
  }

  setDescription(description) {
    this.description = description
  }

  getExpectedResult() {
    return this.expectedResult
  }

  setExpectedResult(expectedResult) {
    this.expectedResult = expectedResult
  }

  getActualResult() {
    return this.actualResult
  }

  setActualResult(actualResult) {
    this.actualResult = actualResult
  }

  getOrder() {
    return this.order
  }

  setOrder(order) {
    this.order = order
  }

  getStatus() {
    return this.status
  }

  setStatus(status) {
    this.status = status
  }

  equals(other) {
    if (this === other) return true
    if (other == null || this.constructor !== other.constructor) return false

    return (
      this.description === other.description &&
      this.expectedResult === other.expectedResult &&
      this.status === other.status
    )
  }

  hashCode() {
    let result = this.description ? this.description.hashCode() : 0
    result =
      31 * result + (this.expectedResult ? this.expectedResult.hashCode() : 0)
    result = 31 * result + (this.status ? this.status.hashCode() : 0)
    return result
  }
}

module.exports = AutomationTestStepLog
