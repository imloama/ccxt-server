
export const CODE_OK = 200
export const CODE_ERROR = 500
export const CODE_REQUEST_ERROR = 400
// not sign in
export const CODE_UNAUTHENTICATION = 401
// not permission
export const CODE_UNAUTHORIZATION = 403

export type APIResult = {
  code: number
  message?:String,
  result?:any
}

export function ok(message?:String, result?:any):APIResult{
  return {
    code: CODE_OK,
    message,
    result,
  }
}

export function fail(message?:String, result?:any):APIResult{
  return {
    code: CODE_ERROR,
    message,
    result
  }
}