# 🔧 MEDICLIP 구글시트 연동 문제 해결 가이드

## 🚨 현재 상황
- ❌ Google Apps Script URL이 설정되지 않음
- ⚠️ 폼은 작동하지만 데이터가 구글시트에 저장되지 않음

## ✅ 해결 방법 (단계별)

### 1️⃣ Google Apps Script 설정 (정확한 방법)

**A. 스크립트 생성**
```
1. https://script.google.com 접속
2. "새 프로젝트" 클릭
3. 프로젝트명: "MEDICLIP-Form-Handler"
4. 기본 코드를 모두 삭제
5. google-apps-script.js 파일 내용을 복사하여 붙여넣기
6. Ctrl+S 저장
```

**B. 권한 설정 (중요!)**
```
1. "실행" 버튼 클릭
2. "승인이 필요합니다" → "권한 검토" 클릭
3. Google 계정 선택
4. "고급" 클릭
5. "MEDICLIP-Form-Handler(안전하지 않음)로 이동" 클릭
6. "허용" 클릭
```

**C. 웹 앱 배포 (정확한 설정)**
```
1. 우측 상단 "배포" → "새 배포" 클릭
2. 설정:
   - 유형: "웹 앱" 선택
   - 설명: "MEDICLIP Form Handler"
   - 실행 권한: "나"
   - 액세스 권한: "모든 사용자"
3. "배포" 클릭
4. 웹 앱 URL 복사 (형식: https://script.google.com/macros/s/AKfyc.../exec)
```

### 2️⃣ 웹사이트에 URL 적용

복사한 URL을 사용하여 `js/main.js` 파일 수정:

**찾을 위치 (454번째 줄 근처):**
```javascript
// TODO: 실제 Google Apps Script URL로 교체하세요
// const response = await fetch('https://script.google.com/macros/s/실제_URL_여기에/exec', {
```

**다음과 같이 수정:**
```javascript
// Google Apps Script 연동 활성화
const response = await fetch('복사한_실제_URL', {
```

**그리고 주석 해제:**
```javascript
const response = await fetch('복사한_실제_URL', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'no-cors'
});
```

### 3️⃣ 테스트 방법

**A. 브라우저 콘솔 확인**
```
1. F12 개발자도구 열기
2. Console 탭 클릭
3. 진단 신청 폼 작성하여 제출
4. 콘솔에서 오류 메시지 확인
```

**B. Google Apps Script에서 테스트**
```
1. Apps Script 편집기에서 testFormSubmission() 함수 실행
2. 실행 로그 확인
3. 구글시트에 테스트 데이터가 추가되는지 확인
```

## 🔍 일반적인 문제들

### 문제 1: "접근 권한이 없습니다"
**해결방법:**
- Google Apps Script에서 "실행" 권한 재설정
- 배포 시 "액세스 권한"을 "모든 사용자"로 변경

### 문제 2: CORS 오류
**해결방법:**
- `mode: 'no-cors'` 옵션 확인
- Google Apps Script는 CORS를 지원하지 않으므로 필수

### 문제 3: 데이터가 들어가지 않음
**확인사항:**
- 구글시트 ID: `1nYWl0ssXUK36GYhJXmQ2hNsnHD3taPOiLbg0uLwuxRA`
- 필드명 일치: hospitalName, applicantName, phone
- JSON 형식 확인

### 문제 4: 시간이 이상함
**정상 동작:**
- 한국 시간(UTC+9) 자동 적용
- 서버 시간과 다를 수 있음

## 🎯 완료 확인 방법

### ✅ 성공적인 연동 확인:
1. 폼 제출 시 오류 없음
2. 구글시트에 새로운 행 추가됨
3. 날짜/시간이 한국 기준으로 정확함
4. 브라우저 콘솔에 "✅ 폼 데이터 준비 완료!" 메시지

### 📊 예상 구글시트 결과:
| 수집된 날짜 | 시간 | 병원명 | 신청자명 | 연락처 | 출처 | 브라우저 정보 | 유입 경로 |
|------------|------|--------|----------|--------|------|------------|----------|
| 2024-10-14 | 15:30:25 | 테스트병원 | 김원장 | 010-1234-5678 | MEDICLIP 랜딩페이지 | Chrome | direct |

---

## 🚀 지금 해야 할 일

1. **Google Apps Script 설정** (위 가이드 따라하기)
2. **웹 앱 URL 복사**
3. **js/main.js 파일에 URL 적용**
4. **테스트 진행**

혹시 어느 단계에서 막히시면 구체적으로 알려주세요! 🙋‍♂️

**구글시트 링크**: https://docs.google.com/spreadsheets/d/1nYWl0ssXUK36GYhJXmQ2hNsnHD3taPOiLbg0uLwuxRA/edit