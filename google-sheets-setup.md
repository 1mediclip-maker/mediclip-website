# Google Sheets 연동 설정 가이드

메디클립 랜딩페이지에서 수집한 고객 데이터를 Google Sheets에 자동으로 저장하는 설정 방법입니다.

## 1. Google Apps Script 설정

### 1-1. Google Drive에서 새 스프레드시트 생성
1. [Google Drive](https://drive.google.com)에 접속
2. `새로 만들기` → `Google 스프레드시트` → `빈 스프레드시트` 선택
3. 스프레드시트 이름을 "메디클립 고객 데이터"로 변경

### 1-2. 헤더 행 설정
첫 번째 행에 다음 헤더들을 입력하세요:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| 신청일시 | 병원명 | 원장님 성함 | 연락처 | 이메일 | 병원유형 | 마케팅 고민 | 소스 | 사용자 에이전트 | 리퍼러 |

### 1-3. Google Apps Script 프로젝트 생성
1. 스프레드시트에서 `확장 프로그램` → `Apps Script` 클릭
2. 기본 `myFunction` 코드를 모두 삭제
3. 아래 코드를 복사하여 붙여넣기:

```javascript
function doPost(e) {
  try {
    // 스프레드시트 ID (URL에서 확인)
    const SHEET_ID = 'YOUR_SHEET_ID_HERE';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 데이터 행 생성
    const row = [
      data.timestamp || new Date().toLocaleString('ko-KR'),
      data.hospitalName || '',
      data.directorName || '',
      data.phone || '',
      data.email || '',
      data.hospitalType || '',
      data.concerns || '',
      data.source || '',
      data.userAgent || '',
      data.referrer || ''
    ];
    
    // 스프레드시트에 데이터 추가
    sheet.appendRow(row);
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: '데이터가 성공적으로 저장되었습니다.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 오류 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'MEDICLIP 데이터 수집 API가 정상 동작 중입니다.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 1-4. 스프레드시트 ID 설정
1. 스프레드시트 URL에서 ID 복사: 
   `https://docs.google.com/spreadsheets/d/[이_부분이_ID]/edit`
2. 코드의 `YOUR_SHEET_ID_HERE`를 실제 ID로 교체

### 1-5. 웹 앱으로 배포
1. Apps Script 편집기에서 `배포` → `새 배포` 클릭
2. 설정:
   - **유형**: 웹 앱
   - **실행**: 나
   - **액세스 권한**: 모든 사용자
3. `배포` 클릭
4. **웹 앱 URL** 복사 (예: `https://script.google.com/macros/s/AKfyc...`)

## 2. 랜딩페이지 연동

### 2-1. JavaScript 파일 수정
`js/main.js` 파일에서 다음 부분을 수정하세요:

```javascript
// 71번째 줄 근처의 URL을 실제 웹 앱 URL로 교체
const response = await fetch('https://script.google.com/macros/s/YOUR_WEB_APP_URL_HERE/exec', {
```

**교체 예시:**
```javascript
const response = await fetch('https://script.google.com/macros/s/AKfycbzXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec', {
```

## 3. 테스트 및 확인

### 3-1. 연동 테스트
1. 랜딩페이지에서 CTA 폼 작성
2. 신청 버튼 클릭
3. Google Sheets에서 데이터 저장 확인

### 3-2. 문제해결
만약 데이터가 저장되지 않는다면:

1. **Apps Script 권한 확인**
   - Google Apps Script에서 권한 승인 완료
   - 스프레드시트 액세스 권한 허용

2. **웹 앱 URL 확인**
   - JavaScript 파일의 URL이 정확한지 확인
   - `/exec`로 끝나는지 확인

3. **스프레드시트 ID 확인**
   - Apps Script 코드의 SHEET_ID가 정확한지 확인

4. **브라우저 개발자 도구에서 네트워크 탭 확인**
   - 폼 제출 시 요청이 전송되는지 확인
   - 오류 메시지가 있는지 확인

## 4. 보안 고려사항

### 4-1. 스프레드시트 보안
- 스프레드시트 공유 설정을 "링크가 있는 모든 사용자"로 **설정하지 마세요**
- 필요한 사람들과만 공유하세요

### 4-2. 데이터 보호
- 개인정보가 포함된 스프레드시트는 정기적으로 백업하세요
- 불필요한 데이터는 정기적으로 정리하세요

## 5. 추가 기능 (선택사항)

### 5-1. 이메일 알림 설정
Apps Script에 다음 함수를 추가하면 새로운 신청이 있을 때 이메일 알림을 받을 수 있습니다:

```javascript
function sendNotification(data) {
  const email = '1mediclip@gmail.com';
  const subject = `[메디클립] 새로운 마케팅 진단 신청 - ${data.hospitalName}`;
  const body = `
새로운 마케팅 진단 신청이 접수되었습니다.

병원명: ${data.hospitalName}
원장님 성함: ${data.directorName}
연락처: ${data.phone}
이메일: ${data.email}
병원 유형: ${data.hospitalType}

마케팅 고민:
${data.concerns}

신청 시간: ${data.timestamp}
  `;
  
  GmailApp.sendEmail(email, subject, body);
}
```

그리고 `doPost` 함수에서 `sheet.appendRow(row);` 다음에 이 줄을 추가:
```javascript
sendNotification(data);
```

### 5-2. 데이터 검증
더 강화된 데이터 검증을 위해 Apps Script에 검증 로직을 추가할 수 있습니다.

## 6. 문의사항

설정 중 문제가 발생하거나 추가 기능이 필요한 경우:
- 이메일: 1mediclip@gmail.com
- 전화: 0507-1427-0398

---

**주의:** Google Apps Script는 무료 할당량이 있습니다. 대량의 데이터 처리가 필요한 경우 Google Workspace 계정을 고려하세요.