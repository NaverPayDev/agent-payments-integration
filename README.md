# Npay Agent Payments Integration

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/NaverPayDev/agent-payments-integration/blob/main/CONTRIBUTING.md)

AI 에이전트를 위한 네이버페이(Npay) 결제 도메인의 통합 인터페이스를 제공합니다.

## 패키지

### [Npay Payments MCP](./packages/payments-mcp)

MCP(Model Context Protocol)를 통해 AI 에이전트가 네이버페이의 결제 도메인과 상호작용할 수 있도록 지원합니다.

## 스크립트

### [Korean Noun Dictionary](./scripts/korean-noun-dictionary)

문서에서 한국어 명사(복합명사, 단일명사)를 추출하여 검색 인덱싱용 사전을 구축합니다.

- 생성된 명사 사전은 [Npay Payments MCP의 `search_documents` 도구](./packages/payments-mcp#search_documents)에서 사용합니다.

## 개발환경 요구사항

- **Node.js**: 22.11.0 이상
- **pnpm**: 9.12.3 이상
- **Python**: 3.13 이상
- **Java**: 8 이상 (`PyKOMORAN` 사용을 위해 필요)
- [**uv**](https://docs.astral.sh/uv/)
- [**just**](https://github.com/casey/just)

## 시작하기

```bash
# 의존성 설치
pnpm install

# 패키지 빌드
pnpm build

# 테스트 실행
pnpm test

# 개발 모드 실행
pnpm start
```

## 주요 명령어

### 개발 및 빌드

- `pnpm start` - 모든 패키지의 시작 스크립트를 실행합니다.
- `pnpm build` - 모든 패키지를 빌드합니다.
- `pnpm test` - 전체 테스트를 실행합니다.
- `pnpm lint` - 전체 코드에 대해 린트 검사를 수행합니다.
- `pnpm lint:fix` - 전체 코드에 대해 린트 오류를 수정합니다.
- `pnpm prettier` - 전체 코드에 대해 포맷을 확인합니다.
- `pnpm prettier:fix` - 전체 코드에 대해 포맷을 수정합니다.
- `pnpm clean` - 모든 패키지의 작업 공간을 초기화하고 의존성을 재설치합니다.

### 버전 관리

- `pnpm changeset` - 변경사항에 대한 changeset을 작성합니다.
- `pnpm changeset --empty` - 빈 changeset을 작성합니다.

### 패키지별 명령어

특정 패키지에서만 명령어를 실행하려면:

```bash
# payments-mcp 패키지에서만 테스트 실행
pnpm --filter @naverpay/payments-mcp test
```

## 기여하기

버그 리포트나 기능 요청은 [GitHub Issues](https://github.com/NaverPayDev/agent-payments-integration/issues)에 등록해 주세요.

자세한 내용은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참조하세요.

## 라이선스

Apache License v2.0 - 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.
