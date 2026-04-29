import { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { BadgeDisplay } from "@/components/shared/BadgeDisplay";
import { QuestionRenderer } from "@/components/survey/QuestionRenderer";
import { useSurvey } from "@/contexts/SurveyContext";
import { getBadge, countryFootprintData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  ArrowRight, Eye, BarChart3, Lightbulb,
  Sun, MessageSquare, Settings, Shield, User, GraduationCap, Plane, Globe2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/survey";

/** Mapiranje backend kategorija na ikonice (case-insensitive prefiks). */
const CATEGORY_META: { match: (c: string) => boolean; label: string; icon: typeof Sun }[] = [
  { match: (c) => c === "Demographic data", label: "Demographics", icon: User },
  { match: (c) => c === "Study status data", label: "Study", icon: GraduationCap },
  { match: (c) => c === "Exchange experience data", label: "Exchange", icon: Plane },
  { match: (c) => c === "AWARENESS", label: "Awareness", icon: Sun },
  { match: (c) => c === "ATTITUDES/MOTIVATIONS", label: "Attitudes", icon: MessageSquare },
  { match: (c) => c.startsWith("HABITS"), label: "Habits", icon: Settings },
  { match: (c) => c.startsWith("BARRIERS"), label: "Barriers", icon: Shield },
  { match: (c) => /MOBILITY/i.test(c), label: "Mobility", icon: Globe2 },
];

/** Grupiše pitanja u "step grupe" — jedan tab = jedna meta grupa. */
type StepGroup = {
  key: string;             // npr. "AWARENESS", "HABITS", "MOBILITY"
  label: string;
  icon: typeof Sun;
  /** Pod-koraci: po backend `category`. Za većinu grupa imaće samo 1 podkorak. */
  subSteps: { category: string; questions: Question[] }[];
};

function buildStepGroups(questions: Question[], includeMobility: boolean): StepGroup[] {
  const groups: StepGroup[] = [];

  for (const meta of CATEGORY_META) {
    const matched = questions.filter((q) => meta.match(q.category));
    if (matched.length === 0) continue;
    if (meta.label === "Mobility" && !includeMobility) continue;

    // Ako se pitanja prostiru kroz više kategorija (npr. HABITS - Travel/Living/...),
    // pravimo pod-step po jedinstvenoj kategoriji, redosledom prvog pojavljivanja.
    const seen: string[] = [];
    for (const q of matched) if (!seen.includes(q.category)) seen.push(q.category);

    groups.push({
      key: meta.label.toUpperCase(),
      label: meta.label,
      icon: meta.icon,
      subSteps: seen.map((cat) => ({
        category: cat,
        questions: matched.filter((q) => q.category === cat),
      })),
    });
  }

  return groups;
}

/** Skraćuje "HABITS - Travel" → "Travel"; ostavlja ostale. */
function shortSubLabel(category: string): string {
  const idx = category.indexOf(" - ");
  return idx === -1 ? category : category.slice(idx + 3);
}

export default function SurveyPage() {
  const {
    state, questions, questionsLoading,
    setAnswer, setGeneralInfo, setIsRealAttempt, setEmail,
    completeSurvey, getScore, getProgress, mobilityDone,
  } = useSurvey();

  const [currentStep, setCurrentStep] = useState(0);
  const [groupIdx, setGroupIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBeforeFinish, setShowBeforeFinish] = useState(false);

  const groups = useMemo(
    () => buildStepGroups(questions, mobilityDone),
    [questions, mobilityDone],
  );

  const currentGroup = groups[groupIdx];
  const currentSub = currentGroup?.subSteps[subIdx];
  const currentQuestions = currentSub?.questions ?? [];

  const isLastSub = currentGroup ? subIdx === currentGroup.subSteps.length - 1 : true;
  const isLastGroup = groupIdx === groups.length - 1;

  const goNext = () => {
    if (currentGroup && !isLastSub) {
      setSubIdx(subIdx + 1);
      return;
    }
    if (!isLastGroup) {
      setGroupIdx(groupIdx + 1);
      setSubIdx(0);
      return;
    }
    // Kraj — pitamo Real vs Pilot.
    setShowBeforeFinish(true);
  };

  const goBack = () => {
    if (subIdx > 0) {
      setSubIdx(subIdx - 1);
    } else if (groupIdx > 0) {
      const prev = groups[groupIdx - 1];
      setGroupIdx(groupIdx - 1);
      setSubIdx(prev.subSteps.length - 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handleAttemptChoice = (isReal: boolean) => {
    setIsRealAttempt(isReal);
    setShowBeforeFinish(false);
    if (isReal) {
      setShowEmailModal(true);
    } else {
      completeSurvey();
      setCurrentStep(2);
    }
  };

  const handleEmailSubmit = () => {
    setShowEmailModal(false);
    completeSurvey();
    setCurrentStep(2);
  };

  const score = getScore();
  const badge = getBadge(score);
  const progress = getProgress();

  const comparisonData = [
    ...countryFootprintData.slice(0, 5).map(d => ({ ...d, isYou: false })),
    { country: "You", score, color: "hsl(210, 70%, 55%)", isYou: true },
  ];

  const headerTitle = currentStep === 2 ? "Export data & Download results" : "Complete the Survey";

  return (
    <Layout>
      <PageHeader title={headerTitle} subtitle="Students' Green Awareness and Sustainable Habits" />

      <div className="container py-8">
        <div className="mx-auto max-w-3xl">
          {/* ─────────── Step 0: General Info (back-compat sa Benchmark filterima) ─────────── */}
          {currentStep === 0 && (
            <div className="rounded-lg border bg-card p-8">
              <h2 className="mb-6 text-xl font-bold text-foreground">General Information</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Brzi pregled — detaljna pitanja (uzrast, univerzitet, oblast studija, razmena…) slediju u upitniku.
              </p>
              <div className="space-y-5">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender</Label>
                  <Select value={state.generalInfo.gender} onValueChange={v => setGeneralInfo({ ...state.generalInfo, gender: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country</Label>
                  <Select value={state.generalInfo.country} onValueChange={v => setGeneralInfo({ ...state.generalInfo, country: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {["Croatia", "France", "Slovakia", "Slovenia", "Serbia", "Germany", "Italy"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Institution</Label>
                  <Input className="mt-1" placeholder="Your university" value={state.generalInfo.institution} onChange={e => setGeneralInfo({ ...state.generalInfo, institution: e.target.value })} />
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={state.generalInfo.mobility} onCheckedChange={v => setGeneralInfo({ ...state.generalInfo, mobility: v })} />
                  <Label>I have participated in student mobility</Label>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setCurrentStep(1)} className="rounded-full bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ─────────── Step 1: Dinamička pitanja ─────────── */}
          {currentStep === 1 && !showBeforeFinish && (
            <div className="space-y-6">
              {questionsLoading || groups.length === 0 ? (
                <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
                  Loading questions…
                </div>
              ) : (
                <>
                  {/* Glavni tab-ovi (grupe) */}
                  <div className="flex gap-2 justify-center flex-wrap">
                    {groups.map((g, i) => {
                      const Icon = g.icon;
                      const isActive = i === groupIdx;
                      const isPassed = i < groupIdx;
                      return (
                        <button
                          key={g.key}
                          onClick={() => { setGroupIdx(i); setSubIdx(0); }}
                          className={cn(
                            "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-wider transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : isPassed
                                ? "bg-secondary text-secondary-foreground"
                                : "border bg-card text-muted-foreground hover:bg-muted",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {g.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pod-koraci (samo ako grupa ima više sub-step-ova, npr. HABITS) */}
                  {currentGroup && currentGroup.subSteps.length > 1 && (
                    <div className="flex items-center justify-center gap-0 py-2 flex-wrap">
                      {currentGroup.subSteps.map((sub, i) => (
                        <div key={sub.category} className="flex items-center">
                          <button
                            onClick={() => setSubIdx(i)}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                              subIdx === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                            )}>
                              {String(i + 1).padStart(2, "0")}
                            </div>
                            <span className="max-w-[90px] text-center text-[10px] text-muted-foreground leading-tight">
                              {shortSubLabel(sub.category)}
                            </span>
                          </button>
                          {i < currentGroup.subSteps.length - 1 && <div className="mx-2 h-px w-10 bg-border" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pitanja */}
                  <div className="rounded-lg border bg-card p-6 space-y-2">
                    {currentSub && (
                      <div className="mb-2 border-b border-border pb-3">
                        <h3 className="text-sm font-bold text-foreground">{currentSub.category}</h3>
                      </div>
                    )}
                    {currentQuestions.map((q) => (
                      <QuestionRenderer
                        key={q.key}
                        question={q}
                        value={state.answers[q.key]}
                        onChange={(v) => setAnswer(q.key, v)}
                      />
                    ))}
                  </div>

                  {/* Bottom nav */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" className="rounded-full px-6" onClick={goBack}>
                        Back
                      </Button>
                      <span className="text-sm font-bold text-foreground">{progress}%</span>
                      <Button
                        className="rounded-full bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90"
                        onClick={goNext}
                      >
                        {isLastGroup && isLastSub ? "Finish" : "Next"}
                      </Button>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─────────── Real attempt vs Pilot ─────────── */}
          {currentStep === 1 && showBeforeFinish && (
            <div className="space-y-6">
              <div className="flex gap-2 justify-center flex-wrap">
                {groups.map((g) => {
                  const Icon = g.icon;
                  return (
                    <div
                      key={g.key}
                      className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-wider bg-secondary text-secondary-foreground"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {g.label}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg bg-sumos-gray p-10">
                <div className="grid gap-8 lg:grid-cols-2 items-center">
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-primary">Before finishing the survey....</h2>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Please tell us whether you actually completed the survey for real or were just trying it out.
                    </p>
                    <div className="space-y-3 max-w-xs">
                      <Button
                        className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-3"
                        onClick={() => handleAttemptChoice(true)}
                      >
                        Real attempt
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full rounded-full py-3"
                        onClick={() => handleAttemptChoice(false)}
                      >
                        Just trying it out (pilot attempt)
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="relative">
                      <div className="h-48 w-32 rounded-t-full bg-secondary/15" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-8 w-20 rounded bg-secondary/10" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Button variant="outline" className="rounded-full px-6" onClick={() => setShowBeforeFinish(false)}>
                    Back
                  </Button>
                  <span className="text-sm font-bold text-foreground">99%</span>
                  <Button className="rounded-full bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90" onClick={() => handleAttemptChoice(true)}>
                    Finish
                  </Button>
                </div>
                <Progress value={99} className="h-2" />
              </div>
            </div>
          )}

          {/* ─────────── Step 2: Results ─────────── */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="rounded-lg bg-sumos-gray py-10 text-center">
                <h2 className="mb-2 text-3xl font-extrabold text-secondary">Congratulations!</h2>
                <p className="mb-6 text-sm text-muted-foreground">You've earned the {badge.name} badge!</p>

                <div className="mx-auto mb-6 inline-block rounded-lg border-2 border-secondary bg-card p-8">
                  <p className="mb-3 text-base font-bold text-foreground">My Green Profile</p>
                  <BadgeDisplay name={badge.name} description="" size="sm" />
                </div>

                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">Your result is:</p>
                  <p className="text-5xl font-bold text-secondary mt-1">{score.toFixed(1).replace(".", ",")}</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground max-w-md mx-auto">
                  <strong>{badge.name}:</strong> {badge.description}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border bg-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Students ecological footprint</h3>
                    <span className="text-muted-foreground text-sm">ⓘ</span>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" />
                      <XAxis dataKey="country" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                        {comparisonData.map((entry, i) => (
                          <Cell key={i} fill={(entry as { isYou: boolean }).isYou ? "hsl(210, 70%, 55%)" : "hsl(210, 50%, 75%)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-3 border-t pt-3">
                    <p className="text-xs font-semibold text-secondary">Overview:</p>
                    <p className="text-xs text-muted-foreground">Your results are similar to 70% of students from your country!</p>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <p className="mb-1 text-center text-xl font-extrabold text-primary">SuMoS</p>
                  <h3 className="mb-4 text-center text-lg font-bold text-foreground">Get results</h3>
                  <p className="mb-5 text-center text-xs text-muted-foreground">Enter your e-mail to receive the full results directly in your inbox.</p>
                  <Label className="text-xs font-semibold text-muted-foreground">E-mail</Label>
                  <Input type="email" placeholder="example@email.com" className="mb-4 mt-1" />
                  <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Send results <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">Next steps...</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  {[
                    { step: "STEP 01", title: "View detail results", icon: Eye, link: "/survey/results" },
                    { step: "STEP 02", title: "Compare with others", icon: BarChart3, link: "/benchmark" },
                    { step: "STEP 03", title: "Get suggestions", icon: Lightbulb, link: "/suggestions" },
                  ].map(card => (
                    <Link
                      key={card.step}
                      to={card.link}
                      className="group relative rounded-lg border bg-card p-6 pt-8 transition-shadow hover:shadow-md"
                    >
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-[10px] font-bold text-secondary-foreground">
                        {card.step}
                      </span>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <card.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-secondary">{card.title}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-md">
          <div className="flex justify-center mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <svg className="h-8 w-8 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary text-center">Before You Continue</DialogTitle>
            <DialogDescription className="text-sm text-center">
              Make sure to enter your email now so we can generate and send your benchmark code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold text-foreground">E-mail address</Label>
              <Input type="email" placeholder="marko@example.com" className="mt-1" value={state.email} onChange={e => setEmail(e.target.value)} />
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              If you leave this page without requesting the results, you won't be able to return to your completed survey.
            </p>
            <Button onClick={handleEmailSubmit} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              Get my Benchmark Code
            </Button>
            <button
              className="w-full text-center text-sm text-muted-foreground hover:underline"
              onClick={() => { setShowEmailModal(false); completeSurvey(); setCurrentStep(2); }}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
