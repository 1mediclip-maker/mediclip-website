# 🕐 Google Apps Script 한국 시간 설정 수정 가이드

## 🚨 문제 상황
- 구글시트에 저장되는 날짜/시간이 한국 시간과 맞지 않음
- UTC 시간 또는 다른 시간대로 저장됨

## ✅ 해결 방법

### 1️⃣ 수정된 Google Apps Script 코드 적용

**현재 수정된 파일:** `google-apps-script.js`

**주요 변경사항:**
1. **한국 시간 계산 함수 추가**
2. **명시적 시간대 설정**  
3. **정확한 시간 포맷팅**

### 2️⃣ Apps Script에 코드 업데이트

```
1. https://script.google.com 접속
2. 기존 MEDICLIP-Form-Handler 프로젝트 열기
3. 기존 코드를 모두 삭제
4. 수정된 google-apps-script.js 내용을 복사하여 붙여넣기
5. Ctrl+S로 저장
6. "새 배포" 또는 "배포 관리"에서 새 버전으로 업데이트
```

### 3️⃣ Apps Script 프로젝트 시간대 설정

**프로젝트 설정에서 시간대 확인:**
```
1. Apps Script 편집기에서 톱니바퀴(⚙️) 아이콘 클릭
2. "프로젝트 설정" 선택
3. "시간대" 섹션에서 "아시아/서울" 선택
4. 저장
```

## 🔧 핵심 수정 내용

### A. 한국 시간 계산 함수
```javascript
function getKoreaTime() {
  const now = new Date();
  const koreaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
  return koreaTime;
}
```

### B. 시간대 명시적 설정
```javascript
// 시간대 설정 (한국 시간)
Session.getScriptTimeZone = function() { return 'Asia/Seoul'; };
```

### C. 정확한 시간 포맷팅
```javascript
const koreaTime = getKoreaTime();
const dateString = Utilities.formatDate(koreaTime, 'Asia/Seoul', 'yyyy-MM-dd');
const timeString = Utilities.formatDate(koreaTime, 'Asia/Seoul', 'HH:mm:ss');
```

## 🧪 테스트 방법

### 1. Apps Script에서 직접 테스트
```javascript
// 콘솔에서 실행
function testTime() {
  const koreaTime = getKoreaTime();
  console.log('현재 한국 시간:', Utilities.formatDate(koreaTime, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'));
}
```

### 2. 웹사이트에서 실제 테스트
```
1. 진단 신청 폼 작성
2. 제출 시간 기록
3. 구글시트에서 저장된 시간과 비교
```

## 📊 예상 결과

**올바른 시간 저장 예시:**
```
수집된 날짜: 2024-10-14
시간: 15:30:45
(현재 한국 시간과 일치)
```

## 🚨 추가 문제 해결

### 문제: 여전히 시간이 맞지 않음
**해결방법:**
1. Apps Script 프로젝트 새로고침
2. 새 배포 버전 생성
3. 브라우저 캐시 삭제 후 재테스트

### 문제: 9시간 차이 발생
**원인:** UTC와 KST 시차
**해결방법:** 위 수정 코드 적용으로 자동 해결

### 문제: 서머타임 영향
**해결방법:** `Asia/Seoul` 시간대는 서머타임 없음 (자동 처리)

---

## ✅ 완료 후 확인사항

- [ ] Apps Script 코드 업데이트 완료
- [ ] 프로젝트 시간대 설정 완료 (Asia/Seoul)
- [ ] 새 배포 버전 생성 완료
- [ ] 테스트 제출로 정확한 시간 확인
- [ ] 구글시트에서 한국 시간 저장 확인

**🎯 이제 모든 신청 데이터가 정확한 한국 시간으로 저장됩니다!**