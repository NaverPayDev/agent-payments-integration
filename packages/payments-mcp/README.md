# Npay Payments MCP

Npay Payments MCP(Model Context Protocol)는 AI 에이전트가 네이버페이의 결제 도메인과 상호작용할 수 있도록 지원합니다.

## 주요 기능

- 네이버페이 문서 조회
  - 네이버페이 개발자센터

## MCP Host 설정 예시

```json
{
  "mcpServers": {
    "npay-payments": {
      "command": "npx",
      "args": ["@naverpay/payments-mcp"]
    }
  }
}
```

## 제공 도구

### get_document

네이버페이 문서를 조회합니다.

#### 매개변수

| 매개변수      | 타입    | 필수 | 설명                   | 기본값     |
|---------------|---------|------|------------------------|------------|
| `categoryId`  | string  | ✅   | 문서 카테고리 ID       | -          |
| `path`        | string  | ➖   | 문서 경로              | "overview" |

#### 사용 가능한 카테고리

| 카테고리 ID   | 제목                     | 설명                                   |
|---------------|--------------------------|----------------------------------------|
| `developers`  | 네이버페이 개발자센터    | 네이버페이 연동 가이드 및 API 레퍼런스 |

### search_documents

키워드로 네이버페이 문서를 검색합니다.

- [korean-noun-dictionary](https://github.com/NaverPayDev/agent-payments-integration/tree/main/scripts/korean-noun-dictionary)로 구축한 명사 사전을 활용해 `llms-full.txt` 문서를 인덱싱하여 최적화된 검색 결과를 제공합니다.

#### 매개변수

| 매개변수      | 타입    | 필수 | 설명                                           | 기본값 |
|---------------|---------|------|------------------------------------------------|--------|
| `categoryId`  | string  | ✅   | 문서 카테고리 ID                               | -      |
| `query`       | string  | ✅   | 검색 키워드                                    | -      |
| `limit`       | number  | ➖   | 최대 결과 수                                   | 3      |

#### 사용 가능한 카테고리

| 카테고리 ID   | 제목                     | 설명                                   |
|---------------|--------------------------|----------------------------------------|
| `developers`  | 네이버페이 개발자센터    | 네이버페이 연동 가이드 및 API 레퍼런스 |

## 개발환경 요구사항

- **Node.js**: 22.11.0 이상
- **pnpm**: 9.12.3 이상

## 시작하기

```bash
# 의존성 설치
pnpm install

# 테스트 실행
pnpm test

# 패키지 빌드
pnpm build
```

### 개발 모드

외부 서버를 대신하는 로컬 테스트 서버와 MCP Inspector를 동시에 실행합니다.

```bash
# 개발 모드 실행
pnpm start
```

로컬 테스트 서버는 `http://localhost:3001`로 실행됩니다.

## 기여하기

버그 리포트나 기능 요청은 [GitHub Issues](https://github.com/NaverPayDev/agent-payments-integration/issues)에 등록해 주세요.

자세한 내용은 [CONTRIBUTING.md](https://github.com/NaverPayDev/agent-payments-integration/blob/main/CONTRIBUTING.md)를 참조하세요.

## 라이선스

Apache License v2.0 - 자세한 내용은 [LICENSE](https://github.com/NaverPayDev/agent-payments-integration/blob/main/LICENSE) 파일을 참조하세요.
