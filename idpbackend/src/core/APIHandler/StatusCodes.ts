/**
 * Statuscode for the API user to handle the errors
 */

enum StatusCode {
  SUCCESS = "10000",
  FAILURE = "10001",
  RETRY = "10002",
  INVALID_ACCESS_TOKEN = "10003",
}

export default StatusCode;
