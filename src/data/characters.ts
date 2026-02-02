// K-Pop Demon Hunters Characters
export interface Character {
  id: string;
  name: string;
  koreanName: string;
  role: string;
  element: string; // 오행 (Five Elements)
  description: string;
  personality: string;
  color: string; // Theme color for styling
  emoji: string;
  image: string; // Character image path
}

export const characters: Character[] = [
  {
    id: "rumi",
    name: "Rumi",
    koreanName: "루미",
    role: "Leader / Main Vocalist",
    element: "火 (불)",
    description: "사주의 화(火) 기운을 타고난 루미는 열정과 카리스마의 상징입니다. 병오(丙午)일주의 특성처럼 밝고 따뜻한 에너지로 주변을 비추며, 강한 리더십과 결단력으로 팀의 중심에서 모두를 이끕니다. 화의 기운이 강한 당신과 함께할 때, 서로의 열정이 시너지를 이루어 더 큰 빛을 발할 것입니다.",
    personality: "열정적이고 카리스마 넘치며, 강한 리더십으로 팀을 이끕니다",
    color: "#ff6b6b",
    emoji: "🌙",
    image: "/characters/Rumi.png",
  },
  {
    id: "mira",
    name: "Mira",
    koreanName: "미라",
    role: "Main Dancer / Rapper",
    element: "水 (물)",
    description: "사주의 수(水) 기운을 품은 미라는 지혜와 유연함의 화신입니다. 임자(壬子)일주처럼 깊은 통찰력과 적응력을 지녔으며, 흐르는 물처럼 어떤 상황에서도 유연하게 대처합니다. 냉철한 판단력으로 팀의 전략을 세우며, 수의 기운이 흐르는 당신과 만나면 깊은 교감을 나눌 수 있을 것입니다.",
    personality: "냉철하고 분석적이며, 전략적 사고로 팀을 돕습니다",
    color: "#4ecdc4",
    emoji: "💧",
    image: "/characters/Mira.png",
  },
  {
    id: "zoey",
    name: "Zoey",
    koreanName: "조이",
    role: "Lead Vocalist / Visual",
    element: "木 (나무)",
    description: "사주의 목(木) 기운이 넘치는 조이는 성장과 희망의 아이콘입니다. 갑인(甲寅)일주의 특성처럼 곧은 성품과 따뜻한 마음을 지녔으며, 하늘을 향해 뻗어가는 나무처럼 끊임없이 성장합니다. 팀의 화합을 이끄는 조이와 목의 기운을 가진 당신이 만나면, 함께 무한한 가능성을 향해 나아갈 수 있습니다.",
    personality: "따뜻하고 배려심이 깊으며, 팀의 화합을 이끕니다",
    color: "#95e1d3",
    emoji: "🌸",
    image: "/characters/Zoey.png",
  },
  {
    id: "jinwoo",
    name: "Jinwoo",
    koreanName: "진우",
    role: "Main Rapper / Producer",
    element: "金 (쇠)",
    description: "사주의 금(金) 기운을 타고난 진우는 정의와 완벽함의 추구자입니다. 경신(庚申)일주처럼 날카로운 직관력과 결단력을 갖추었으며, 쇠처럼 단단한 의지로 목표를 향해 나아갑니다. 음악에 대한 남다른 열정과 완벽주의적 성향으로 최고의 작품을 만들어내며, 금의 기운을 가진 당신과 함께라면 흔들림 없는 신뢰를 쌓을 수 있습니다.",
    personality: "완벽주의자이며, 음악에 대한 열정이 남다릅니다",
    color: "#dfe6e9",
    emoji: "⚔️",
    image: "/characters/Jinwoo.png",
  },
  {
    id: "abby",
    name: "Abby",
    koreanName: "애비",
    role: "Lead Dancer / Maknae",
    element: "土 (흙)",
    description: "사주의 토(土) 기운을 품은 애비는 안정과 포용의 상징입니다. 무진(戊辰)일주처럼 넓은 마음과 든든한 포용력을 지녔으며, 대지처럼 모든 것을 받아들이는 따뜻함이 있습니다. 팀의 막내이자 분위기 메이커로서 밝은 에너지를 전하며, 토의 기운을 가진 당신과 만나면 서로에게 편안한 안식처가 되어줄 것입니다.",
    personality: "밝고 에너지 넘치며, 팀의 분위기 메이커입니다",
    color: "#ffeaa7",
    emoji: "🌻",
    image: "/characters/Abby.png",
  },
];

// 사주 해석 메시지
export const sajuMessages: string[] = [
  "당신의 사주에서 강한 양의 기운이 느껴집니다. 리더십과 결단력이 돋보이는 운세입니다.",
  "음과 양의 조화가 아름답게 이루어진 사주입니다. 균형 잡힌 삶을 살아갈 운명입니다.",
  "물의 기운이 강하게 흐르는 사주입니다. 지혜롭고 유연한 대처 능력을 지녔습니다.",
  "불의 기운이 타오르는 사주입니다. 열정과 창의성이 넘치는 운명을 타고났습니다.",
  "나무의 기운이 깃든 사주입니다. 성장과 발전의 운세가 함께합니다.",
  "금의 기운이 빛나는 사주입니다. 정의롭고 결단력 있는 성품을 지녔습니다.",
  "흙의 기운이 단단한 사주입니다. 안정적이고 신뢰할 수 있는 성격의 소유자입니다.",
  "천간과 지지의 조화가 특별한 사주입니다. 독특한 매력으로 주변을 사로잡습니다.",
];

// 오늘의 운세 메시지
export const dailyFortuneMessages: string[] = [
  "오늘은 새로운 시작에 좋은 날입니다. 용기를 내어 첫 발을 내딛어 보세요.",
  "주변 사람들과의 관계가 더욱 깊어지는 하루가 될 것입니다.",
  "창의적인 아이디어가 샘솟는 날입니다. 영감을 놓치지 마세요.",
  "오늘 만나는 사람이 인생의 중요한 인연이 될 수 있습니다.",
  "작은 행운이 찾아올 예정입니다. 긍정적인 마음을 유지하세요.",
  "자신을 돌아보기 좋은 날입니다. 내면의 목소리에 귀 기울여 보세요.",
  "오래된 문제가 해결의 실마리를 찾게 됩니다.",
  "예상치 못한 기회가 찾아올 수 있습니다. 열린 마음으로 받아들이세요.",
  "사랑과 관련된 좋은 소식이 있을 수 있습니다.",
  "건강에 특별히 신경 쓰면 좋은 하루입니다. 충분한 휴식을 취하세요.",
];

// 궁합 메시지
export const compatibilityMessages: string[] = [
  "천생연분의 궁합입니다! 서로의 부족한 부분을 완벽하게 채워줄 수 있는 인연입니다.",
  "운명적인 만남의 기운이 강하게 느껴집니다. 함께할 때 시너지가 폭발합니다.",
  "서로를 이해하고 성장시켜주는 좋은 궁합입니다.",
  "비슷한 에너지를 공유하는 궁합입니다. 공감대가 깊게 형성됩니다.",
  "상호 보완적인 관계로, 함께할 때 더 강해지는 인연입니다.",
];

// 럭키 아이템
export const luckyItems: string[] = [
  "은반지",
  "푸른 손수건",
  "별 모양 액세서리",
  "라벤더 향수",
  "달 모양 펜던트",
  "행운의 동전",
  "빨간 리본",
  "크리스탈 팔찌",
  "네잎클로버 책갈피",
  "금색 귀걸이",
];

// 럭키 컬러
export const luckyColors: string[] = [
  "로즈 골드",
  "미드나잇 블루",
  "에메랄드 그린",
  "라벤더 퍼플",
  "선셋 오렌지",
  "실버 화이트",
  "체리 레드",
  "스카이 블루",
];

// 럭키 넘버 생성
export function generateLuckyNumber(): number {
  return Math.floor(Math.random() * 99) + 1;
}

// 랜덤 선택 함수
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// 캐릭터 매칭 함수 (랜덤)
export function matchCharacter(): Character {
  return getRandomItem(characters);
}
