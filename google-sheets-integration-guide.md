# MEDICLIP 구글시트 연동 설정 가이드

## 🎯 목표
MEDICLIP 마케팅 진단 신청 폼에서 수집되는 데이터를 자동으로 구글시트에 저장

**구글시트 URL:** https://docs.google.com/spreadsheets/d/1nYWl0ssXUK36GYhJXmQ2hNsnHD3taPOiLbg0uLwuxRA/edit

## 📋 수집되는 데이터 구조
| 순서 | 필드명 | 폼 필드 | 설명 |
|------|--------|---------|------|
| 1 | 수집된 날짜 | 자동생성 | yyyy-MM-dd 형식 |
| 2 | 시간 | 자동생성 | HH:mm:ss 형식 (한국시간) |
| 3 | 병원명 | hospitalName | 필수 입력 |
| 4 | 신청자명 | applicantName | 필수 입력 |
| 5 | 연락처 | phone | 필수 입력 |
| 6 | 출처 | source | 자동생성 (MEDICLIP 랜딩페이지) |
| 7 | 브라우저 정보 | userAgent | 자동수집 (Chrome, Safari 등) |
| 8 | 유입 경로 | referrer | 자동수집 (Google, 직접 유입 등) |

## 🔧 Google Apps Script 설정 단계

### Step 1: Google Apps Script 프로젝트 생성
1. https://script.google.com 접속
2. "새 프로젝트" 클릭
3. 프로젝트명을 "MEDICLIP-Form-Handler"로 변경
4. `google-apps-script.js` 파일의 코드를 복사하여 붙여넣기

### Step 2: 스크립트 권한 설정
1. 코드 붙여넣기 후 "저장" (Ctrl+S)
2. "실행" 버튼 클릭하여 권한 요청
3. "권한 검토" → "고급" → "MEDICLIP-Form-Handler(안전하지 않음)로 이동"
4. "허용" 클릭

### Step 3: 웹 앱으로 배포
1. "배포" → "새 배포" 클릭
2. 설정 값:
   - **유형:** 웹 앱
   - **실행 권한:** 나
   - **액세스 권한:** 모든 사용자
3. "배포" 클릭
4. **웹 앱 URL 복사** (예: https://script.google.com/macros/s/AKfycbx.../exec)

### Step 4: 웹사이트에 URL 적용
1. `js/main.js` 파일 열기
2. 328번째 줄 찾기:
```javascript
const response = await fetch('https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_URL_HERE/exec', {
```
3. `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` 부분을 Step 3에서 복사한 실제 URL로 교체

## 🧪 테스트 방법

### 1. Google Apps Script에서 테스트
```javascript
// Apps Script 편집기에서 실행
function testFormSubmission() {
  const testData = {
    hospitalName: '테스트병원',
    applicantName: '김테스트',
    phone: '010-1234-5678',
    position: '원장'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
```

### 2. 웹사이트에서 실제 테스트
1. 진단 신청 폼 작성
2. 제출 버튼 클릭
3. 구글시트에서 데이터 확인

## 🚨 문제 해결

### 일반적인 오류들:

**1. CORS 오류**
- 해결방법: `mode: 'no-cors'` 옵션이 설정되어 있는지 확인
- Google Apps Script는 CORS를 지원하지 않으므로 no-cors 모드 필수

**2. 권한 오류**
- 해결방법: Apps Script 실행 권한을 "나"로, 액세스 권한을 "모든 사용자"로 설정

**3. 데이터가 저장되지 않음**
- 해결방법: 
  - 구글시트 ID가 정확한지 확인
  - 폼 필드명이 일치하는지 확인 (hospitalName, applicantName, phone, position)

**4. 한국 시간이 아닌 경우**
- 해결방법: 스크립트에서 'Asia/Seoul' 시간대 설정 확인

## 📊 구글시트 자동 포맷팅

스크립트가 자동으로 다음과 같이 설정합니다:
- 헤더 행: 메디클립 네이비 배경 (#0F1541), 흰색 글자
- 자동 열 크기 조정
- 중앙 정렬

## 🔄 업데이트 방법

새로운 필드를 추가하려면:
1. HTML 폼에 input 필드 추가
2. `js/main.js`의 data 객체에 필드 추가
3. `google-apps-script.js`의 newRow 배열에 필드 추가
4. Apps Script 재배포

## 📈 데이터 분석

구글시트에서 다음과 같은 분석이 가능합니다:
- 일별/월별 신청 현황
- 피크 시간대 분석
- 컨버전 추적
- 신청자 유형 분석

---

**🎯 완료 후 확인사항:**
- [ ] Google Apps Script 배포 완료
- [ ] 웹 앱 URL을 js/main.js에 적용
- [ ] 테스트 제출로 데이터 수집 확인
- [ ] 구글시트에서 실시간 데이터 확인