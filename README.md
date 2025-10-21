# AR Measure (Next.js)

간단한 WebXR 기반 AR 실내 측정 데모입니다.

주의사항
- WebXR는 모바일 브라우저(예: Chrome for Android)의 HTTPS 환경에서 지원됩니다.
- 데스크톱 브라우저에서는 동작하지 않을 수 있습니다.

설치 및 실행 (Windows PowerShell):

```powershell
npm install
npm run dev
```

브라우저에서 https://localhost:3000 (또는 호스팅한 주소)로 접속한 뒤 모바일에서 접근하세요. 또는 로컬에서 테스트하려면 ngrok 같은 도구로 HTTPS endpoint를 만들어 사용하세요.

다음 단계
- 측정 정밀도 보정
- 가구 3D 모델 배치 UI와 치수 검사
- 단위(미터/센티미터) 선택 및 누적 측정
 
## 모바일에서 접근하기 (로컬 테스트)

WebXR은 보통 HTTPS 환경 또는 신뢰된 모바일 브라우저에서만 동작합니다. 로컬 개발 중 모바일에서 접속하려면 다음 방법 중 하나를 사용하세요.

1) 같은 로컬 네트워크에서 직접 접속
 - 개발 머신(예: 노트북/데스크톱)의 로컬 IP를 확인합니다 (Windows PowerShell):

```powershell
ipconfig
```

 - 프로젝트 폴더에서 다음으로 서버를 호스트합니다(외부 접속 허용):

```powershell
npm run dev:host
```

 - 모바일 브라우저에서 http://<YOUR_PC_LOCAL_IP>:3000 으로 접속합니다.

2) HTTPS가 필요한 경우(권장) — ngrok 사용
 - ngrok으로 로컬 서버를 HTTPS로 노출하면 WebXR(대부분 브라우저)에서 동작합니다.

```powershell
# ngrok 설치 후
ngrok http 3000
```

 - ngrok이 제공하는 https URL을 모바일에서 열면 WebXR 기능을 테스트할 수 있습니다.

참고: 일부 Android 기기/브라우저에서 WebXR 지원이 없을 수 있습니다. Chrome 89+ (Android) 또는 WebXR 지원 브라우저를 사용하세요.

