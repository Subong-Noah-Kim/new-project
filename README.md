# 스네이크 게임

간단한 클래식 스네이크 게임입니다.

## 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 테스트

```bash
npm test
```

## 조작법

- 이동: 방향키 또는 `WASD`
- 일시정지/재개: `Space`
- 다시 시작: `R`
- 속도: 화면의 `1~5` 버튼

## GitHub Pages 배포 (자동)

이 저장소에는 GitHub Actions 워크플로우가 포함되어 있습니다.

파일: `.github/workflows/deploy-pages.yml`

동작:
- `main` 브랜치에 push하면 테스트 후 자동 배포
- GitHub Actions에서 수동 실행도 가능 (`workflow_dispatch`)

최초 1회 설정:
1. GitHub 저장소 생성 후 코드 push
2. GitHub 저장소 `Settings > Pages`에서 Source를 `GitHub Actions`로 설정
3. `main`에 push하면 배포 URL 생성

배포 URL 형식:
- `https://<github-username>.github.io/<repo-name>/`
