# SeShat – CLI 기반 PDF 매뉴얼 Q&A 파이프라인 (RAG + OCR + Vision)

> **로컬 PowerShell에서 전처리 → 인덱싱 → 질의응답을 순차 실행하는 버전**
> 환경: Windows 11 · Python 3.11 · CUDA 11.8 (GPU 권장)

---

## 🎯 프로젝트 개요

**SeShat**은 복잡한 제품 매뉴얼(PDF)을 입력받아 다음 과정을 수행하는 **AI 문서 이해 파이프라인**입니다.

1. **PDF 텍스트/OCR/이미지 캡션 추출**
2. **의미 단위 청크화 및 벡터 인덱싱(FAISS)**
3. **LangChain 기반 RAG 질의응답**

이 모든 단계가 **CLI(Command Line Interface)** 상에서 수행되며,
웹 서버(FastAPI, Streamlit) 없이도 **로컬 단일 환경에서 완전한 AI Q&A**를 구현합니다.

---

## 🧠 전체 구조 다이어그램

```
원본 PDF
  │
  ├── (1) 페이지 구조 분석 → pdf_classifier.py
  ├── (2) 텍스트 추출 → pdf_text_extractor.py
  ├── (3) 이미지 추출 → image_extractor.py
  ├── (4) OCR 인식 → ocr_extractor.py
  ├── (5) OCR 정제 → ocr_cleaner.py
  ├── (6) 이미지 캡션 (BLIP) → image_captioner_blip.py
  ├── (7) 하이브리드 캡션 (Donut+BLIP+OCR) → image_captioner_hybrid.py
  ├── (8) 문서 병합 및 청크 분할 → document_pr.py
  ├── (9) FAISS 인덱싱 (제품별) → vector_db_manager.py
  └── (10) RAG 기반 질의응답 → qa_service_chat.py
```

---

## ⚙️ 환경 설정

```powershell
# 가상환경 생성 및 활성화
python -m venv venv
venv\Scripts\activate

# PyTorch(CUDA 11.8)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# 프로젝트 의존성
pip install -r requirements.txt
```

**Tesseract OCR (Windows)**

```powershell
setx TESSDATA_PREFIX "C:\Program Files\Tesseract-OCR\tessdata"
setx PATH "$env:PATH;C:\Program Files\Tesseract-OCR"
```

---

## 📂 폴더 구조

```
Backend/
  core/config.py
  module/
    document_processor/
      pdf_classifier.py
      pdf_text_extractor.py
      image_extractor.py
      ocr_extractor.py
      ocr_cleaner.py
      image_captioner_blip.py
      image_captioner_hybrid.py
      document_pr.py
      vector_db_manager.py
    qa_service_chat.py

data/
  image_store/           # 이미지 추출물
  ocr_texts/             # OCR 결과
  ocr_texts_cleaned/     # OCR 정제본
  image_captions/        # BLIP/Donut 캡션
  chunk_store/           # 병합/청크 결과
  faiss_index/           # 제품별 인덱스
```

---

## 🧩 실행 순서 (CLI 중심)

### 1️⃣ PDF 구조 분석

```powershell
python -m Backend.module.document_processor.pdf_classifier
```

### 2️⃣ 텍스트 추출

```powershell
python -m Backend.module.document_processor.pdf_text_extractor
```

### 3️⃣ 이미지 추출

```powershell
python -m Backend.module.document_processor.image_extractor
```

### 4️⃣ OCR 처리

```powershell
python -m Backend.module.document_processor.ocr_extractor
```

### 5️⃣ OCR 정제

```powershell
python -m Backend.module.document_processor.ocr_cleaner
```

### 6️⃣ 이미지 캡션 (BLIP)

```powershell
python -m Backend.module.document_processor.image_captioner_blip
```

### 7️⃣ 하이브리드 캡션 (Donut + BLIP + OCR)

```powershell
python -m Backend.module.document_processor.image_captioner_hybrid
```

### 8️⃣ 문서 병합 및 청크 분할

```powershell
python -m Backend.module.document_processor.document_pr
```

### 9️⃣ 벡터 인덱싱 (제품별 FAISS 저장)

```powershell
python -m Backend.module.document_processor.vector_db_manager
```

### 🔟 질의응답 (제품 선택형 콘솔)

```powershell
python -m Backend.module.qa_service_chat
```

---

## 📁 주요 산출물 경로

| 항목      | 경로                                 | 비고                            |
| ------- | ---------------------------------- | ----------------------------- |
| OCR 결과  | `Backend/data/ocr_texts/`          | `*_ocr.json`                  |
| OCR 정제본 | `Backend/data/ocr_texts_cleaned/`  | `*_ocr_cleaned.json`          |
| 이미지 캡션  | `Backend/data/image_captions/`     | BLIP/Donut 통합 결과              |
| 병합/청크   | `Backend/data/chunk_store/`        | OCR + Caption 병합 JSON         |
| 벡터 인덱스  | `Backend/data/faiss_index/{제품ID}/` | `index.faiss`, `docstore.pkl` |

---

## ⚠️ 트러블슈팅

| 문제                       | 원인            | 해결 방법                                   |
| ------------------------ | ------------- | --------------------------------------- |
| `protobuf` ImportError   | Donut 변환기 종속성 | `pip install protobuf`                  |
| `Illegal byte sequence`  | 한글 폴더명 인덱스 저장 | 자동 영문 치환 버전 적용됨                         |
| `max 300000 tokens`      | 텍스트 과다        | 문서 청크 단위 축소, 배치 처리 적용                   |
| `TesseractNotFoundError` | 경로 미등록        | Tesseract 설치 및 환경변수 등록                  |
| 모델 다운로드 느림               | HF 캐시 문제      | `pip install "huggingface_hub[hf_xet]"` |

---

## 🧠 기술 스택 요약

| 구분             | 라이브러리 / 모델                   |
| -------------- | ---------------------------- |
| PDF 파싱         | PyMuPDF, pdfplumber          |
| 이미지 처리         | Pillow, OpenCV               |
| OCR            | Tesseract (pytesseract)      |
| Vision Caption | BLIP, Donut (Transformers)   |
| 인덱싱            | LangChain, FAISS             |
| 질의응답           | OpenAI GPT + Retriever Chain |

---

## ✅ 현재 상태

| 모듈                | 상태    | 설명                      |
| ----------------- | ----- | ----------------------- |
| PDF 분석~Vision 전처리 | ✅ 완료  | OCR+BLIP+Donut 통합 완료    |
| 문서 병합 및 청크화       | ✅ 완료  | OCR + Caption 병합 구조 안정화 |
| 제품별 인덱싱           | ✅ 완료  | ASCII 폴더명 자동 변환, 배치 처리  |
| 콘솔형 Q&A           | ✅ 완료  | 모델명 선택형 질의응답 완료         |
| API/Web UI        | 🚧 예정 | FastAPI/Frontend 추후 확장  |

---

## 🧩 License & Credits

* **Team SeShat (P&DF)**
* AI 모델:

  * Salesforce/blip-image-captioning-large
  * naver-clova-ix/donut-base
* Frameworks: LangChain, FAISS, PyTorch, OpenAI API

---

## 파이프라인 다이어그램 (SVG)

> PDF → 전처리 → 캡션/요약 → 청크/임베딩 → 질의응답(RAG)

<div style="overflow:auto;border:1px solid #e5e7eb;border-radius:8px;padding:10px;background:#fff">
<svg width="1200" height="360" viewBox="0 0 1200 360" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Segoe UI, Arial" font-size="13">
  <defs>
    <style>
      .box{fill:#f9fafb;stroke:#9ca3af;stroke-width:1.2;rx:10;ry:10}
      .title{font-weight:bold;fill:#111827}
      .sub{fill:#4b5563}
      .arrow{stroke:#6b7280;stroke-width:1.6;marker-end:url(#arrow)}
    </style>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
    </marker>
  </defs>

  <!-- Row 1 -->

  <rect x="20" y="30" width="150" height="70" class="box"/>
  <text x="95" y="60" text-anchor="middle" class="title">PDF 입력</text>
  <text x="95" y="80" text-anchor="middle" class="sub">원본 매뉴얼</text>

  <line x1="170" y1="65" x2="220" y2="65" class="arrow"/>

  <rect x="220" y="15" width="200" height="100" class="box"/>
  <text x="320" y="45" text-anchor="middle" class="title">pdf_classifier.py</text>
  <text x="320" y="70" text-anchor="middle" class="sub">페이지 구조: text / image / mixed</text>

  <line x1="320" y1="115" x2="320" y2="155" class="arrow"/>

  <!-- Row 2 (parallel) -->

  <rect x="80" y="155" width="220" height="90" class="box"/>
  <text x="190" y="185" text-anchor="middle" class="title">pdf_text_extractor.py</text>
  <text x="190" y="205" text-anchor="middle" class="sub">텍스트 계층 직접 추출</text>

  <rect x="340" y="155" width="220" height="90" class="box"/>
  <text x="450" y="185" text-anchor="middle" class="title">image_extractor.py</text>
  <text x="450" y="205" text-anchor="middle" class="sub">이미지/벡터 추출</text>

  <line x1="560" y1="200" x2="610" y2="200" class="arrow"/>

  <rect x="610" y="155" width="210" height="90" class="box"/>
  <text x="715" y="185" text-anchor="middle" class="title">ocr_extractor.py</text>
  <text x="715" y="205" text-anchor="middle" class="sub">Tesseract OCR</text>

  <line x1="815" y1="200" x2="865" y2="200" class="arrow"/>

  <rect x="865" y="155" width="200" height="90" class="box"/>
  <text x="965" y="185" text-anchor="middle" class="title">ocr_cleaner.py</text>
  <text x="965" y="205" text-anchor="middle" class="sub">클린업/정규화</text>

  <!-- Vision branch from image_extractor -->

  <line x1="450" y1="245" x2="450" y2="290" class="arrow"/>
  <rect x="340" y="290" width="220" height="60" class="box"/>
  <text x="450" y="315" text-anchor="middle" class="title">image_captioner_blip.py</text>

  <line x1="715" y1="245" x2="715" y2="290" class="arrow"/>
  <rect x="610" y="290" width="220" height="60" class="box"/>
  <text x="720" y="315" text-anchor="middle" class="title">image_captioner_hybrid.py</text>

  <!-- Merge to doc prep -->

  <line x1="965" y1="200" x2="1015" y2="200" class="arrow"/>
  <line x1="450" y1="320" x2="540" y2="320" class="arrow"/>
  <line x1="720" y1="320" x2="810" y2="320" class="arrow"/>
  <line x1="810" y1="320" x2="1015" y2="200" class="arrow"/>

  <rect x="1015" y="140" width="165" height="120" class="box"/>
  <text x="1097" y="170" text-anchor="middle" class="title">document_pr.py</text>
  <text x="1097" y="192" text-anchor="middle" class="sub">OCR/캡션 병합·청크</text>

  <line x1="1097" y1="260" x2="1097" y2="300" class="arrow"/>
  <rect x="990" y="300" width="210" height="50" class="box"/>
  <text x="1095" y="330" text-anchor="middle" class="title">vector_db_manager.py</text>

  <line x1="895" y1="325" x2="990" y2="325" class="arrow"/>
  <text x="895" y="322" text-anchor="end" class="sub">FAISS 인덱스</text>
</svg>
</div>

---

## 한눈에 보는 실행 순서 (명령어 요약)

| 단계 | 목적                     | PowerShell 명령                                                                                                                             | 주요 출력                                             |
| -- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 0  | 가상환경 + CUDA PyTorch 설치 | `python -m venv venv; venv\Scripts\activate; pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118` | -                                                 |
| 1  | 의존성 설치                 | `pip install -r requirements.txt`                                                                                                         | -                                                 |
| 2  | PDF 구조 분석              | `python -m Backend.module.document_processor.pdf_classifier`                                                                              | `/data/page_meta/*.json`                          |
| 3  | 텍스트 추출                 | `python -m Backend.module.document_processor.pdf_text_extractor`                                                                          | `/data/text_json/*_text.json`                     |
| 4  | 이미지/벡터 추출              | `python -m Backend.module.document_processor.image_extractor`                                                                             | `/data/image_store/*.png`                         |
| 5  | OCR 추출                 | `python -m Backend.module.document_processor.ocr_extractor`                                                                               | `/data/ocr_texts/*_ocr.json`                      |
| 6  | OCR 정제                 | `python -m Backend.module.document_processor.ocr_cleaner`                                                                                 | `/data/ocr_texts_cleaned/*_ocr_cleaned.json`      |
| 7  | BLIP 캡션                | `python -m Backend.module.document_processor.image_captioner_blip`                                                                        | `/data/image_captions/image_captions_blip.json`   |
| 8  | 하이브리드 캡션               | `python -m Backend.module.document_processor.image_captioner_hybrid`                                                                      | `/data/image_captions/image_captions_hybrid.json` |
| 9  | 문서 병합/청크               | `python -m Backend.module.document_processor.document_pr`                                                                                 | `/data/chunk_store/<모델>/*.jsonl`                  |
| 10 | 제품별 인덱스 생성             | `python -m Backend.module.document_processor.vector_db_manager`                                                                           | `/data/faiss_index/<모델>/index.faiss`              |
| 11 | 콘솔 챗 (제품 선택)           | `python -m Backend.module.qa_service_chat`                                                                                                | 콘솔 응답 + 근거                                        |

> 메모: Windows에서 경로/권한 오류가 나면 PowerShell을 관리자 권한으로 실행하고, 한글 폴더명은 `slug`(ASCII)로 자동 변환되어 저장됩니다.
