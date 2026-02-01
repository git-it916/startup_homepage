# K-Destiny (K-운명)

> **K-Culture와 전통 사주의 만남** - 당신의 운명과 연결된 K-Star를 찾아보세요

## 프로젝트 소개

K-Destiny는 한국 전통 사주(四柱) 점술을 K-Culture(K-Pop/K-Drama)와 융합한 혁신적인 문화 관광 서비스입니다. 복잡한 동양 철학을 글로벌 관광객이 쉽게 이해하고 공감할 수 있는 엔터테인먼트 경험으로 재탄생시켰습니다.

### 핵심 가치

- **언어 장벽 해소**: 복잡한 한자 용어 없이 직관적인 시각적 경험 제공
- **표준화된 해석 시스템**: 일관된 품질의 서비스 제공
- **K-Entity 매칭**: 사용자의 사주와 K-Pop 아이돌/K-Drama 캐릭터 연결
- **SNS 최적화**: Instagram Stories에 최적화된 디지털 리포트

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Font**: Geist Sans, Noto Sans KR

## 주요 기능

### 1. 랜딩 페이지 (Hero Section)
- "Cosmic Ink" 컨셉의 몰입형 배경 애니메이션
- 별자리와 먹물이 퍼지는 듯한 시각 효과
- 마그네틱 효과가 적용된 CTA 버튼

### 2. 의식(Ritual) 입력 플로우
생년월일 입력을 단순한 폼이 아닌 **"디지털 의식"**으로 설계했습니다.

#### Step 1: 이름 입력
- 타이핑 시 파티클 효과 발생
- 자동 포커스 및 글로우 효과

#### Step 2: 생년월일 선택
- iOS 스타일 커스텀 휠 피커 (기본 브라우저 날짜 선택기 미사용)
- 3D 원근감 회전 효과
- 드래그 및 스크롤 지원

#### Step 3: 태어난 시간 선택
- 전통 시진(時辰) 표시 (子時, 丑時 등)
- 12지신 동물 표시

#### Step 4: 음양 선택
- Yin(음)/Yang(양) 카드형 선택 UI
- 달/태양 아이콘과 리플 효과

### 3. 결과 화면
- 입력된 운명 프로필 요약
- K-Entity 매칭 티저 (Coming Soon)
- "Get Full Report" CTA

## 시작하기

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

### 환경 요구사항

- Node.js 18.17 이상
- npm 9.0 이상

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 페이지 (상태 관리)
│   ├── layout.tsx        # 루트 레이아웃 (메타데이터)
│   └── globals.css       # 전역 스타일
│
└── components/
    ├── ui/
    │   ├── CosmicBackground.tsx  # 우주적 배경 애니메이션
    │   └── HeroSection.tsx       # 랜딩 히어로 섹션
    │
    └── ritual/
        ├── InputWizard.tsx       # 다단계 입력 컨테이너
        └── steps/
            ├── NameInput.tsx         # 이름 입력
            ├── DateWheelPicker.tsx   # 생년월일 휠 피커
            ├── TimeWheelPicker.tsx   # 시간 휠 피커
            └── GenderSelection.tsx   # 음양 선택
```

## 디자인 철학

### "Digital Ritual" (디지털 의식)

생년월일을 입력하는 행위는 단순한 데이터 입력이 아닌, **운명을 열어가는 디지털 의식**입니다. 모든 클릭과 스크롤에는 부드러운 마이크로 인터랙션과 시각적 피드백이 동반됩니다.

### 색상 팔레트

| 색상 | Hex | 용도 |
|------|-----|------|
| Background | `#050510` | 깊은 우주 배경 |
| Foreground | `#e8e8f0` | 기본 텍스트 |
| Gold | `#d4af37` | 강조, Yang 에너지 |
| Purple | `#7c3aed` | 보조 강조, Yin 에너지 |

## 비즈니스 모델

### B2C (직접 판매)
- 현장 체험 티켓
- 프리미엄 모바일 리포트

### B2B (시스템 라이선싱)
- 여행사 및 투어 운영자에게 "K-Destiny Script System & Manual" 공급
- OTA(Online Travel Agency) 파트너십

## 타겟 시장

### Primary
- 한국을 방문하는 글로벌 Gen-Z K-Culture 팬 (18-30세)
- K-Pop 아이돌과의 깊은 개인적 연결을 원하는 팬층

### Secondary
- 독특하고 인스타그래머블한 한국 문화 활동을 찾는 체험형 여행자

## 비전

> K-Spirituality의 표준 운영 시스템(OS)이 되어, 한국의 점술 경험을 단순한 관광을 넘어 글로벌 디지털 콘텐츠 포맷으로 수출한다.

## 라이선스

MIT License

---

**K-Destiny** - *Discover the K-Star aligned with your soul.*
