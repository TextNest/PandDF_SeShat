## 백엔드 구조
```
BackEnd/
│
├─── main.py                # FastAPI 애플리케이션의 메인 실행 파일
├─── requirements.txt       # 프로젝트에 필요한 Python 라이브러리 목록
├─── .env                   # API 키 등 민감한 환경 변수 설정 파일
├─── .gitignore             # Git 버전 관리에서 제외할 파일 및 폴더 목록 (.env,pycache,data,db)
│
├─── core/                  # 프로젝트의 핵심 설정 관리
│    └── config.py          # .env 파일 로드 등 환경 설정 관련 로직
│
├─── data/                  # 데이터 저장 폴더 (임시)
│    ├── docstore.pkl       # 원본 문서 조각(chunk) 저장소
│    ├── image_store.pkl    # 문서에서 추출한 이미지 데이터 저장소
│    └── faiss_index/       # 벡터 검색을 위한 FAISS 인덱스 파일 저장
│
├─── db/                    # 관계형 데이터베이스 관련 설정 
│    └── database.py        # SQLAlchemy 등 DB 연결 및 세션 관리
│
├─── module/                # 애플리케이션의 핵심 비즈니스 로직
│    ├── document_pr.py     # PDF 문서 파싱, 텍스트/이미지 추출 등 전처리 로직(관리자 서비스에 추가 예정)
│    ├── qa_service.py      # 텍스트 기반 RAG Q&A 체인 및 서비스 로직(현재 사용중)
│    ├── qa_service_img.py  # 이미지 기반 RAG Q&A 체인 및 서비스 로직(이미지도 추가로 보낼경우)
│    └── chat_agent.py      # LangGraph 기반의 대화형 에이전트 로직
│
├─── router/                # API 엔드포인트(URL 경로) 정의
│    └── chat.py            # 채팅 관련 API (WebSocket 연결 등) 라우터
│
├─── schemas/               # API 요청/응답 데이터 모델 정의 (Pydantic)
│    ├── document.py        # 문서 관련 데이터 스키마
│    └── qa.py              # Q&A 관련 데이터 스키마
│
└─── templates/             # 프론트엔드 HTML 템플릿 (임시 추후 프론트에서 연결)
     ├── main.html          # 메인 페이지
     └── chat.html          # 채팅 UI 페이지
```

-----

## MVP 상황



### 완료

1. 단순 챗봇기능
2. 청킹 데이터 + 전체 데이터를 통한 멀티벡터 검색기
3. 멀티쿼리(실제 PDF에는 사양이여서 스펙,성능을 찾는다면 못 찾는 경우 발생) -> 해당 문제 임시 해결
4. 앞으로 추가 할 기능이 많다고 판단 단순 RAG 시스템이 아닌 agent기반 LangGraph 구현
5. Websocket을 통한 실시간 소통 구현

###  미완료

1. 이미지데이터
2. Product_id 를 통해 DB에서 PDF, Faiss 파일 검색기능
3. 캐싱을 통해 대규모 서비스 구현
4. 프로픔트 보안 사항


## 기능 추가 예정

1. tools (FAQ,추천,스펙정보,수치)
2. 관리자 기능


### 규칙

