# 🌐 mediclip.kr 도메인 연결 진단 및 해결 가이드

## 📊 현재 상태 확인 (2024-10-14 기준)

### 🔍 도메인 정보 확인 방법
```bash
# CMD 또는 터미널에서 실행
nslookup mediclip.kr
ping mediclip.kr
```

## 🚨 mediclip.kr 연결 문제 해결 단계

### 1단계: 호스팅케이알에서 네임서버 변경

```
🏢 호스팅케이알 관리 페이지
1. https://www.hosting.kr 로그인
2. 마이페이지 → 서비스 관리 → 도메인 관리
3. mediclip.kr 도메인 클릭
4. "네임서버 변경" 선택
5. 현재 설정: ns1.hosting.kr, ns2.hosting.kr
   변경할 설정: Cloudflare 네임서버
```

**⚠️ 중요: Cloudflare에서 제공하는 실제 네임서버를 입력해야 합니다**

### 2단계: Cloudflare 네임서버 확인

```
☁️ Cloudflare 대시보드에서
1. mediclip.kr 사이트 클릭
2. 우측 사이드바에서 네임서버 확인
3. 예시:
   - alice.ns.cloudflare.com
   - bob.ns.cloudflare.com
   (실제로는 다른 이름일 수 있음)
```

### 3단계: DNS 레코드 올바른 설정

```
📝 Cloudflare DNS 설정 (mediclip.kr용)
1. A 레코드:
   - Type: A
   - Name: @
   - IPv4: [실제 서버 IP 또는 GitHub Pages IP]
   - Proxy: Proxied (주황색)

2. CNAME 레코드:
   - Type: CNAME  
   - Name: www
   - Target: mediclip.kr
   - Proxy: Proxied (주황색)
```

## 🎯 정적 사이트용 추천 설정

### Option 1: GitHub Pages 연동 (추천)
```
1. GitHub Repository에 코드 업로드
   - Repository 이름: mediclip-website (또는 아무거나)
   
2. GitHub Pages 설정:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Custom domain: mediclip.kr

3. Cloudflare DNS 설정:
   - A 레코드 @ → 185.199.108.153
   - A 레코드 @ → 185.199.109.153  
   - A 레코드 @ → 185.199.110.153
   - A 레코드 @ → 185.199.111.153
   - CNAME www → mediclip.kr
```

### Option 2: Cloudflare Pages (더 간단)
```
1. Cloudflare Pages에 직접 업로드
   - Workers & Pages → Create application → Pages
   - Upload assets: index.html, css/, js/ 폴더 업로드
   
2. 커스텀 도메인 설정:
   - Custom domains → Add custom domain
   - mediclip.kr 입력
   - 자동으로 DNS 레코드 생성됨
```

## 🔧 현재 상황별 해결법

### ❌ "이 사이트에 연결할 수 없음" 오류

**원인:** 네임서버 미변경 또는 DNS 전파 중
```
✅ 해결:
1. 호스팅케이알에서 네임서버 확인
2. 전파 상태 확인: https://whatsmydns.net
3. 24-48시간 대기
```

### ❌ "SSL 연결 오류" 

**원인:** SSL/TLS 설정 문제
```
✅ 해결:
1. Cloudflare → SSL/TLS → Overview
2. 암호화 모드: "Flexible" 선택 (정적 사이트용)
3. Edge Certificates → "Always Use HTTPS" ON
```

### ❌ "DNS_PROBE_FINISHED_NXDOMAIN"

**원인:** DNS 레코드가 아직 생성되지 않음
```
✅ 해결:
1. DNS 캐시 삭제: cmd → ipconfig /flushdns
2. 다른 DNS 서버로 테스트: 8.8.8.8, 1.1.1.1
3. 시간이 더 필요할 수 있음 (최대 48시간)
```

## 📋 mediclip.kr 전용 체크리스트

### ✅ 호스팅케이알 확인사항
- [ ] mediclip.kr 도메인 만료일 확인 (1년 이상 남았는지)
- [ ] 도메인 잠금 상태 확인 (잠금 해제되어야 함)
- [ ] 네임서버가 Cloudflare로 변경되었는지 확인
- [ ] WHOIS 정보에서 네임서버 업데이트 확인

### ✅ Cloudflare 확인사항  
- [ ] mediclip.kr 사이트가 "Active" 상태인지 확인
- [ ] DNS 레코드 A @ 와 CNAME www 설정됨
- [ ] SSL/TLS 모드가 "Flexible"로 설정됨
- [ ] 페이지 규칙에 리다이렉션 충돌 없음

## 🚀 즉시 실행할 수 있는 테스트

### 1️⃣ 네임서버 전파 확인
```
웹사이트: https://whatsmydns.net
입력: mediclip.kr
타입: NS (네임서버)
결과: 전 세계에서 Cloudflare 네임서버가 보여야 함
```

### 2️⃣ DNS 레코드 확인
```
웹사이트: https://dnschecker.org
입력: mediclip.kr  
타입: A
결과: 설정한 IP 주소가 나와야 함
```

### 3️⃣ SSL 상태 확인
```
웹사이트: https://www.ssllabs.com/ssltest/
입력: mediclip.kr
결과: SSL 인증서 상태 확인
```

## 🎯 현재 확인이 필요한 정보

**Vicky님께서 확인해주세요:**

1. **네임서버 변경 여부**: 호스팅케이알에서 언제 Cloudflare 네임서버로 변경하셨나요?

2. **현재 오류 메시지**: 
   - Chrome에서 mediclip.kr 접속 시 어떤 메시지가 나오나요?
   - "연결할 수 없음" / "SSL 오류" / "DNS 오류" 등

3. **목표 사이트**: 
   - 현재 만든 MEDICLIP 랜딩페이지를 mediclip.kr로 연결하려는 건가요?
   - 서버는 따로 있나요, 아니면 정적 파일 호스팅인가요?

4. **Cloudflare 상태**:
   - Cloudflare 대시보드에서 mediclip.kr이 "Active" 상태인가요?

## 💡 추천 해결 순서

### 🥇 1순위: GitHub Pages + Cloudflare (가장 안정적)
```
1. GitHub에 MEDICLIP 코드 업로드
2. Pages 설정으로 호스팅
3. Cloudflare DNS에서 GitHub Pages IP로 연결
4. 자동 SSL + CDN 적용
```

### 🥈 2순위: Cloudflare Pages (가장 간단)  
```
1. 현재 프로젝트 파일들을 zip으로 압축
2. Cloudflare Pages에 직접 업로드
3. mediclip.kr 커스텀 도메인 설정
```

---

**현재 상황을 알려주시면 정확한 해결책을 제시해드릴게요!** 🛠️✨