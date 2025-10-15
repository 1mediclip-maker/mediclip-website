/**
 * MEDICLIP 마케팅 진단 신청 폼 데이터 수집
 * 구글시트 연동: https://docs.google.com/spreadsheets/d/1nYWl0ssXUK36GYhJXmQ2hNsnHD3taPOiLbg0uLwuxRA/edit
 */

// 한국 시간 계산 함수 (완전 새로운 접근법)
function getKoreaDateTime() {
  try {
    // 방법: JavaScript Intl API 사용 (가장 신뢰성 있음)
    const now = new Date();
    
    // 한국 시간으로 변환된 Date 객체 생성
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const partsObj = {};
    parts.forEach(part => {
      partsObj[part.type] = part.value;
    });
    
    const dateString = `${partsObj.year}-${partsObj.month}-${partsObj.day}`;
    const timeString = `${partsObj.hour}:${partsObj.minute}:${partsObj.second}`;
    
    // 디버깅 로그
    console.log('=== 한국 시간 변환 디버깅 ===');
    console.log('🌍 원본 UTC:', now.toISOString());
    console.log('📅 변환된 날짜:', dateString);
    console.log('⏰ 변환된 시간:', timeString);
    console.log('🎯 Full 문자열:', `${dateString} ${timeString}`);
    console.log('================================');
    
    return {
      dateString: dateString,
      timeString: timeString,
      fullString: `${dateString} ${timeString}`
    };
    
  } catch (error) {
    console.error('한국 시간 변환 오류:', error);
    
    // 폴백: 단순 UTC+9 계산
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    const year = koreaTime.getUTCFullYear();
    const month = String(koreaTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(koreaTime.getUTCDate()).padStart(2, '0');
    const hours = String(koreaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(koreaTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(koreaTime.getUTCSeconds()).padStart(2, '0');
    
    return {
      dateString: `${year}-${month}-${day}`,
      timeString: `${hours}:${minutes}:${seconds}`,
      fullString: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    };
  }
}

function doPost(e) {
  try {
    // 시간대 설정 (한국 시간)
    Session.getScriptTimeZone = function() { return 'Asia/Seoul'; };
    
    // 구글시트 연결
    const SHEET_ID = '1nYWl0ssXUK36GYhJXmQ2hNsnHD3taPOiLbg0uLwuxRA';
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // POST 데이터 파싱
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    // 현재 한국 시간으로 날짜/시간 생성
    const koreaDateTime = getKoreaDateTime();
    const dateString = koreaDateTime.dateString;  // 2024-10-14 형식
    const timeString = koreaDateTime.timeString;  // 23:18:xx 형식
    
    // 디버깅을 위한 로그
    console.log(`한국 현재 시간: ${koreaDateTime.fullString}`);
    
    // 시트가 비어있다면 헤더 추가
    if (sheet.getLastRow() === 0) {
      const headers = [
        '수집된 날짜', 
        '시간', 
        '병원명', 
        '신청자명', 
        '연락처',
        '출처',
        '브라우저 정보',
        '유입 경로'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일링
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#0F1541'); // 메디클립 네이비
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // 새로운 데이터 행 추가
    const newRow = [
      dateString,                    // 수집된 날짜
      timeString,                    // 시간
      data.hospitalName || '',       // 병원명
      data.applicantName || '',      // 신청자명
      data.phone || '',             // 연락처
      data.source || 'MEDICLIP 랜딩페이지',  // 출처
      data.userAgent || '',         // 브라우저 정보
      data.referrer || 'direct'     // 유입 경로
    ];
    
    sheet.appendRow(newRow);
    
    // 자동으로 열 크기 조정
    sheet.autoResizeColumns(1, 8);
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '신청이 성공적으로 접수되었습니다.',
        timestamp: koreaDateTime.fullString
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 에러 로깅
    console.error('Form submission error:', error);
    
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '접수 중 오류가 발생했습니다. 다시 시도해주세요.',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // GET 요청 처리 (테스트용)
  return ContentService
    .createTextOutput('MEDICLIP Form Handler is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 수동 테스트 함수
 */
function testFormSubmission() {
  const testData = {
    hospitalName: '테스트병원',
    applicantName: '김테스트',
    phone: '010-1234-5678',
    source: 'MEDICLIP 랜딩페이지',
    userAgent: 'Mozilla/5.0 (테스트)',
    referrer: 'direct'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}

// 한국 시간 테스트 함수 (강화 버전)
function testKoreaTime() {
  const now = new Date();
  const koreaDateTime = getKoreaDateTime();
  
  console.log('=== 한국 시간 최종 테스트 ===');
  console.log('🌍 현재 UTC 시간:', now.toISOString());
  console.log('🇰🇷 한국 시간 (목표):', now.toLocaleString("ko-KR", {timeZone: "Asia/Seoul"}));
  console.log('📅 저장될 날짜:', koreaDateTime.dateString);
  console.log('⏰ 저장될 시간:', koreaDateTime.timeString);
  console.log('📝 전체:', koreaDateTime.fullString);
  
  // 현재가 2025-10-14 23:18이라면 이 값들이 나와야 함
  console.log('✅ 예상: 2025-10-14 23:18:xx');
  console.log('🎯 실제: ' + koreaDateTime.fullString);
  console.log('==============================');
  
  return koreaDateTime;
}