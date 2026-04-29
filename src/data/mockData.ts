export const countries = [
  "Germany", "France", "Spain", "Croatia", "Italy", "Portugal", "Netherlands"
];

export const countryFootprintData = [
  { country: "Germany", score: 3.8, color: "hsl(160, 45%, 45%)" },
  { country: "France", score: 4.1, color: "hsl(160, 45%, 45%)" },
  { country: "Spain", score: 3.5, color: "hsl(160, 45%, 45%)" },
  { country: "Croatia", score: 4.4, color: "hsl(160, 45%, 45%)" },
  { country: "Italy", score: 3.9, color: "hsl(160, 45%, 45%)" },
  { country: "Portugal", score: 3.2, color: "hsl(160, 45%, 45%)" },
  { country: "Netherlands", score: 4.0, color: "hsl(160, 45%, 45%)" },
];

export const awarenessData = [
  { country: "Germany", level: 72 },
  { country: "France", level: 68 },
  { country: "Spain", level: 55 },
  { country: "Croatia", level: 80 },
  { country: "Italy", level: 63 },
  { country: "Portugal", level: 58 },
  { country: "Netherlands", level: 75 },
];

export const behaviourData = [
  { category: "Awareness", score: 4.2 },
  { category: "Attitudes", score: 3.8 },
  { category: "Habits", score: 3.1 },
  { category: "Barriers", score: 2.9 },
];

export const radarData = [
  { category: "Travel", Germany: 3.5, France: 4.0, Spain: 3.2, Croatia: 4.2, fullMark: 5 },
  { category: "Living", Germany: 4.1, France: 3.6, Spain: 3.8, Croatia: 3.9, fullMark: 5 },
  { category: "Food", Germany: 3.8, France: 4.3, Spain: 3.5, Croatia: 3.7, fullMark: 5 },
  { category: "Digital", Germany: 3.2, France: 3.1, Spain: 2.9, Croatia: 3.4, fullMark: 5 },
  { category: "Community", Germany: 3.9, France: 3.5, Spain: 4.0, Croatia: 4.5, fullMark: 5 },
];

export const statsOverview = {
  totalSurveys: 1247,
  avgCompletionTime: "12 min",
  popularBadge: "Eco Explorer",
  globalGreenScore: 3.8,
};

export const surveyCategories = ["Awareness", "Attitudes", "Habits", "Barriers"] as const;

export const habitSubcategories = [
  "Travel",
  "Living & accommodation",
  "Buying & consumption",
  "Digital habits",
  "Community engagement",
] as const;

export interface SurveyQuestion {
  id: string;
  category: typeof surveyCategories[number];
  subcategory?: string;
  text: string;
  scaleLabels: [string, string];
}

export const surveyQuestions: SurveyQuestion[] = [
  // Awareness
  { id: "a1", category: "Awareness", text: "I am aware of the environmental impact of student mobility.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "a2", category: "Awareness", text: "I know about sustainable transportation options available to me.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "a3", category: "Awareness", text: "I understand the concept of carbon footprint.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "a4", category: "Awareness", text: "I am familiar with my university's sustainability initiatives.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  // Attitudes
  { id: "at1", category: "Attitudes", text: "I believe individual actions can make a difference in sustainability.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "at2", category: "Attitudes", text: "I am willing to pay more for sustainable options.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "at3", category: "Attitudes", text: "Environmental protection should be a priority in student exchange programs.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "at4", category: "Attitudes", text: "I would choose a less convenient option if it was more eco-friendly.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  // Habits - Travel
  { id: "h1", category: "Habits", subcategory: "Travel", text: "I use public transportation for daily commuting.", scaleLabels: ["Never", "Very often"] },
  { id: "h2", category: "Habits", subcategory: "Travel", text: "I choose train over plane for medium-distance travel.", scaleLabels: ["Never", "Very often"] },
  { id: "h3", category: "Habits", subcategory: "Travel", text: "I walk or cycle for short distances.", scaleLabels: ["Never", "Very often"] },
  // Habits - Living
  { id: "h4", category: "Habits", subcategory: "Living & accommodation", text: "I actively reduce energy consumption in my accommodation.", scaleLabels: ["Never", "Very often"] },
  { id: "h5", category: "Habits", subcategory: "Living & accommodation", text: "I sort and recycle waste properly.", scaleLabels: ["Never", "Very often"] },
  // Habits - Buying
  { id: "h6", category: "Habits", subcategory: "Buying & consumption", text: "I buy second-hand or sustainable products.", scaleLabels: ["Never", "Very often"] },
  { id: "h7", category: "Habits", subcategory: "Buying & consumption", text: "I reduce food waste by planning meals.", scaleLabels: ["Never", "Very often"] },
  // Habits - Digital
  { id: "h8", category: "Habits", subcategory: "Digital habits", text: "I minimize unnecessary digital storage and streaming.", scaleLabels: ["Never", "Very often"] },
  { id: "h9", category: "Habits", subcategory: "Digital habits", text: "I use digital tools instead of printing.", scaleLabels: ["Never", "Very often"] },
  // Habits - Community
  { id: "h10", category: "Habits", subcategory: "Community engagement", text: "I participate in environmental activities or groups.", scaleLabels: ["Never", "Very often"] },
  { id: "h11", category: "Habits", subcategory: "Community engagement", text: "I encourage peers to adopt sustainable practices.", scaleLabels: ["Never", "Very often"] },
  // Barriers
  { id: "b1", category: "Barriers", text: "Lack of information prevents me from being more sustainable.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "b2", category: "Barriers", text: "Sustainable options are too expensive for students.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "b3", category: "Barriers", text: "It's inconvenient to be sustainable during student exchanges.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
  { id: "b4", category: "Barriers", text: "There is a lack of sustainable infrastructure in my host city.", scaleLabels: ["Strongly disagree", "Strongly agree"] },
];

export const badges = [
  { name: "Eco Explorer", description: "You're beginning your green journey! Keep exploring sustainable practices.", minScore: 0, maxScore: 2 },
  { name: "Green Advocate", description: "You show a strong commitment to sustainability. Great habits!", minScore: 2, maxScore: 3.5 },
  { name: "Sustainability Champion", description: "You're a role model for sustainable student mobility!", minScore: 3.5, maxScore: 4.5 },
  { name: "Planet Hero", description: "Outstanding! Your ecological footprint is minimal. You inspire everyone!", minScore: 4.5, maxScore: 5 },
];

export const suggestions: Record<string, { title: string; tips: string[] }[]> = {
  Travel: [
    { title: "Daily Commute", tips: ["Use public transport or bike for daily trips", "Consider carpooling with fellow students", "Walk for distances under 2km"] },
    { title: "Long-distance Travel", tips: ["Choose trains over flights when possible", "Use bus services for intercity travel", "Offset your carbon if you must fly"] },
  ],
  "Living & accommodation": [
    { title: "Energy Saving", tips: ["Turn off lights when leaving rooms", "Use energy-efficient appliances", "Keep heating at moderate levels"] },
    { title: "Waste Management", tips: ["Sort your waste properly", "Compost organic waste if possible", "Reduce single-use plastics"] },
  ],
  "Buying & consumption": [
    { title: "Shopping Habits", tips: ["Buy local and seasonal food", "Use reusable bags and containers", "Consider second-hand clothing"] },
    { title: "Food", tips: ["Plan meals to reduce food waste", "Reduce meat consumption", "Support local farmers' markets"] },
  ],
  "Digital habits": [
    { title: "Digital Footprint", tips: ["Clean up old emails and cloud storage", "Reduce video streaming quality when HD isn't needed", "Unsubscribe from unnecessary newsletters"] },
  ],
  "Community engagement": [
    { title: "Getting Involved", tips: ["Join local environmental groups", "Participate in campus sustainability events", "Share your knowledge with peers"] },
  ],
};

export const institutions = [
  { name: "University of Zagreb", country: "Croatia", practices: 12 },
  { name: "TU Berlin", country: "Germany", practices: 15 },
  { name: "Université de Lyon", country: "France", practices: 10 },
  { name: "Universidad de Sevilla", country: "Spain", practices: 8 },
  { name: "Università di Bologna", country: "Italy", practices: 11 },
  { name: "Universidade do Porto", country: "Portugal", practices: 9 },
];

export function getBadge(score: number) {
  return badges.find(b => score >= b.minScore && score < b.maxScore) || badges[badges.length - 1];
}

export function generateBenchmarkCode(): string {
  return `SUM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
