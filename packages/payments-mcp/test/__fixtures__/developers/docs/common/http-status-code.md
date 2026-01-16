# HTTP Status Code

## HTTP Status Code[​](#http-status-code "HTTP Status Code에 대한 직접 링크")

### HTTP Status Code Summary[​](#http-status-code-summary "HTTP Status Code Summary에 대한 직접 링크")

| HTTP Status Code | 설명                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| 200              | OK, 요청이 성공한 경우                                                                             |
| 400              | Bad Request, 요청을 처리할 수 없는 경우                                                            |
| 401              | Unauthorized, 인증키가 잘못된 경우                                                                 |
| 404              | Not Found, 요청 resource 가 존재하지 않는 경우                                                     |
| 409              | Conflict, 중복된 요청인 경우 ([API 멱등성 참조](http://localhost:3001/developers/docs/common/idempotency.md)) |
| 503              | Service Unavailable, 서비스 점검중인 경우                                                          |
| 5xx              | Server Errors, 네이버페이 서버에 오류가 있는 경우 ( 매우 드물게 발생 )                             |
