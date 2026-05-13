import { useEffect, useMemo, useState } from "react";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Eye,
  BarChart3,
  Lightbulb,
  Sun,
  MessageSquare,
  Settings,
  Shield,
  User,
  GraduationCap,
  Plane,
  Globe2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/survey";
import { toast } from "sonner";
import ConsentStep from "@/components/survey/ConsentStep";
/** Mapiranje backend kategorija na ikonice (case-insensitive prefiks). */
const CATEGORY_META: {
  match: (c: string) => boolean;
  label: string;
  icon: typeof Sun;
}[] = [
  { match: (c) => c === "Demographic data", label: "Demographics", icon: User },
  {
    match: (c) => c === "Study status data",
    label: "Study",
    icon: GraduationCap,
  },
  {
    match: (c) => c === "Exchange experience data",
    label: "Exchange",
    icon: Plane,
  },
  { match: (c) => c === "AWARENESS", label: "Awareness", icon: Sun },
  {
    match: (c) => c === "ATTITUDES/MOTIVATIONS",
    label: "Attitudes",
    icon: MessageSquare,
  },
  { match: (c) => c.startsWith("HABITS"), label: "Habits", icon: Settings },
  { match: (c) => c.startsWith("BARRIERS"), label: "Barriers", icon: Shield },
  { match: (c) => /MOBILITY/i.test(c), label: "Mobility", icon: Globe2 },
];
// Funkcija za mobility done da se samo ovde izvlaci
export function deriveMobilityDone(exchangeStatusValue: string | undefined): boolean {
  if (!exchangeStatusValue) return false;
  return /^Yes|currently on my semester abroad/i.test(exchangeStatusValue);
}

/** Grupiše pitanja u "step grupe" — jedan tab = jedna meta grupa. */
type StepGroup = {
  key: string; // npr. "AWARENESS", "HABITS", "MOBILITY"
  label: string;
  icon: typeof Sun;
  /** Pod-koraci: po backend `category`. Za većinu grupa imaće samo 1 podkorak. */
  subSteps: { category: string; questions: Question[] }[];
};

function buildStepGroups(
  questions: Question[],
  includeMobility: boolean,
): StepGroup[] {
  const groups: StepGroup[] = [];

  for (const q of questions) {
    const foundMeta = CATEGORY_META.find((m) => m.match(q.category));
    const meta = foundMeta
      ? { key: foundMeta.label.toUpperCase(), label: foundMeta.label, icon: foundMeta.icon }
      : { key: q.category.toUpperCase(), label: q.category, icon: Sun };

    if (!includeMobility && meta.label === "Mobility") continue;

    let currentGroup = groups[groups.length - 1];
    if (!currentGroup || currentGroup.key !== meta.key) {
      currentGroup = {
        key: meta.key,
        label: meta.label,
        icon: meta.icon,
        subSteps: [],
      };
      groups.push(currentGroup);
    }

    let currentSubStep = currentGroup.subSteps[currentGroup.subSteps.length - 1];
    if (!currentSubStep || currentSubStep.category !== q.category) {
      currentSubStep = {
        category: q.category,
        questions: [],
      };
      currentGroup.subSteps.push(currentSubStep);
    }

    currentSubStep.questions.push(q);
  }

  return groups;
}

/** Skraćuje "HABITS - Travel" → "Travel"; ostavlja ostale. */
function shortSubLabel(category: string): string {
  const idx = category.indexOf(" - ");
  return idx === -1 ? category : category.slice(idx + 3);
}

function getQuestionStatus(q: Question, answers: Record<string, any>) {
  const val = answers[q.key];
  if (val === undefined || val === null || val === "") return false;
  if (q.type === "LIKERT-MATRIX") {
    const options = q.options as string[];
    if (typeof val !== "object" || val === null) return false;
    return options.every((opt) => val[opt] !== undefined);
  }
  if (q.type === "RUBRIC") {
    const dimensions = q.options as any[];
    if (typeof val !== "object" || val === null) return false;
    return dimensions.every((d) => val[d.dimension] !== undefined);
  }
  return true;
}

function getSubStatus(sub: { questions: Question[] }, answers: Record<string, any>) {
  let totalMandatory = 0;
  let answeredMandatory = 0;
  let hasAnyAnswer = false;
  for (const q of sub.questions) {
    const answered = getQuestionStatus(q, answers);
    if (answered) hasAnyAnswer = true;
    if (!q.optional) {
      totalMandatory++;
      if (answered) answeredMandatory++;
    }
  }
  if (totalMandatory === 0) return hasAnyAnswer ? "completed" : "empty";
  if (answeredMandatory === totalMandatory) return "completed";
  if (hasAnyAnswer || answeredMandatory > 0) return "partial";
  return "empty";
}

function getGroupStatus(g: StepGroup, answers: Record<string, any>) {
  let allCompleted = true;
  let hasAnyAnswer = false;
  for (const sub of g.subSteps) {
    const s = getSubStatus(sub, answers);
    if (s !== "completed") allCompleted = false;
    if (s !== "empty") hasAnyAnswer = true;
  }
  if (allCompleted) return "completed";
  if (hasAnyAnswer) return "partial";
  return "empty";
}

export default function SurveyPage() {
  const {
    state,
    questions,
    questionsLoading,
    setAnswer,
   // setGeneralInfo,
    setIsRealAttempt,
    setEmail,
    completeSurvey,
    getScore,
    getProgress,
    // mobilityDone,
    hasConsented,
    setHasConsented,
  } = useSurvey();

  const [currentStep, setCurrentStep] = useState(0);
  const [groupIdx, setGroupIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBeforeFinish, setShowBeforeFinish] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  //const [mobilityDone, setMobilityDone] = useState(false);
  const navigate = useNavigate();

  const mobilityDone = useMemo(() => {
    const v = state.answers["exchange_status"];
    return (
      deriveMobilityDone(typeof v === "string" ? v : undefined) 
      
    );
  }, [state.answers]);

  const handleDisagree = () => {
    // Toast sa trajanjem (duration) od 3000ms (3 sekunde)
    toast.error("The survey is interrupted", {
      description: "You did not provide consent. Redirecting to home...",
      duration: 3000, // Ovo rešava tvoje pitanje o ograničenju toasta
    });

    // Pauza od 3 sekunde pre navigacije
    setTimeout(() => {
      setHasConsented(false);
      navigate("/");
    }, 3000);
  };

  const groups = useMemo(
    () => buildStepGroups(questions, mobilityDone),
    [questions, mobilityDone],
  );

  const allQuestionsNav = useMemo(() => {
    let globalNum = 1;
    const nav: { num: number; q: Question; gIdx: number; sIdx: number; isAnswered: boolean }[] = [];
    groups.forEach((g, gIdx) => {
      g.subSteps.forEach((s, sIdx) => {
        s.questions.forEach((q) => {
          nav.push({
            num: globalNum++,
            q,
            gIdx,
            sIdx,
            isAnswered: getQuestionStatus(q, state.answers),
          });
        });
      });
    });
    return nav;
  }, [groups, state.answers]);

  const currentGroup = groups[groupIdx];
  const currentSub = currentGroup?.subSteps[subIdx];
  const currentQuestions = currentSub?.questions ?? [];

  const isLastSub = currentGroup
    ? subIdx === currentGroup.subSteps.length - 1
    : true;
  const isLastGroup = groupIdx === groups.length - 1;

  const globalValidate = () => {
    for (let gIdx = 0; gIdx < groups.length; gIdx++) {
      const group = groups[gIdx];
      for (let sIdx = 0; sIdx < group.subSteps.length; sIdx++) {
        const sub = group.subSteps[sIdx];
        for (const q of sub.questions) {
          if (!q.optional && !getQuestionStatus(q, state.answers)) {
            return { gIdx, sIdx, key: q.key };
          }
        }
      }
    }
    return null;
  };

//uvek na top
  useEffect(() => {
  if (!errorKey) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}, [groupIdx, subIdx, errorKey]);

  const goNext = () => {
    if (isLastGroup && isLastSub) {
      const errorLoc = globalValidate();
      if (errorLoc) {
        toast.error("Missing answers", {
          description: "Please answer all mandatory questions. We've highlighted the missing one.",
          duration: 4000,
        });
        setGroupIdx(errorLoc.gIdx);
        setSubIdx(errorLoc.sIdx);
        setErrorKey(errorLoc.key);
        setTimeout(() => {
          document.getElementById(`question-${errorLoc.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
        return;
      }
      
      setErrorKey(null);
      setCurrentStep(1);
      setShowBeforeFinish(true);
      return;
    }

    setErrorKey(null);
    if (currentGroup && !isLastSub) {
      setSubIdx(subIdx + 1);
      return;
    }
    if (!isLastGroup) {
      setGroupIdx(groupIdx + 1);
      setSubIdx(0);
      return;
    }
    ;
  };

  const goBack = () => {
    setErrorKey(null);
    if (subIdx > 0) {
      setSubIdx(subIdx - 1);
    } else if (groupIdx > 0) {
      const prev = groups[groupIdx - 1];
      setGroupIdx(groupIdx - 1);
      setSubIdx(prev.subSteps.length - 1);
    } else {
      setHasConsented(false);
    }

  };

  const handleAttemptChoice = async (isReal: boolean) => {
    setIsRealAttempt(isReal);
    setShowBeforeFinish(false);
    if (isReal) {
      setShowEmailModal(true);
    } else {
      try {
        await completeSurvey({ isRealAttempt: false });
        setCurrentStep(2);
      } catch (error) {
        toast.error("Failed to submit to backend. Check console for details.");
      }
    }
  };

  const handleEmailSubmit = async () => {
    setShowEmailModal(false);
    try {
      await completeSurvey({ isRealAttempt: true, email: state.email });
      setCurrentStep(2);
    } catch (error) {
      toast.error("Failed to submit to backend. Check console for details.");
    }
  };
  //Ovde treba hendlovati logiku odgovora i bedz koji je dobio - tu treba prosiriti model dodatno moramo da vidimo kako ce se vracati rezultati
  //I gde ce se zapravo cuvati bedz - da li ima smisla perzistirati ga ili ga racunati svaki put naknadno
  const score = getScore();
  const badge = getBadge(score);
  const progress = getProgress();

  const comparisonData = [
    ...countryFootprintData.slice(0, 5).map((d) => ({ ...d, isYou: false })),
    { country: "You", score, color: "hsl(210, 70%, 55%)", isYou: true },
  ];

  const headerTitle =
    currentStep === 2
      ? "Export data & Download results"
      : "Complete the Survey";

  return (
    <Layout>
      <PageHeader
        title={headerTitle}
        subtitle="Students' Green Awareness and Sustainable Habits"
      />

      <div className="container py-8">
        <div className={cn("mx-auto flex flex-col md:flex-row items-start justify-center", hasConsented && currentStep === 0 && !showBeforeFinish ? "gap-8 xl:gap-12 max-w-[1400px]" : "max-w-3xl")}>
          
          {/* Left Sidebar (Question Navigator) */}
          {hasConsented && currentStep === 0 && !showBeforeFinish && (
            <div className="hidden lg:block w-64 xl:w-80 shrink-0">
              <div className="sticky top-8 max-h-[85vh] overflow-y-auto rounded-lg border bg-card p-4 shadow-sm scrollbar-thin">
                <h3 className="text-sm font-bold mb-4 text-foreground text-center">Question Navigator</h3>
                <div className="grid grid-cols-10 gap-1">
                  {allQuestionsNav.map((item) => (
                    <button
                      key={item.q.key}
                      onClick={() => {
                        setErrorKey(null);
                        setGroupIdx(item.gIdx);
                        setSubIdx(item.sIdx);
                        setTimeout(() => {
                          document.getElementById(`question-${item.q.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 100);
                      }}
                      title={item.q.text}
                      className={cn(
                        "aspect-square rounded text-[9px] sm:text-[10px] font-bold transition-all flex items-center justify-center border",
                        item.isAnswered 
                          ? "bg-green-500 text-white border-green-600 shadow-sm" 
                          : "bg-yellow-400 text-yellow-950 border-yellow-500 shadow-sm",
                        item.gIdx === groupIdx && item.sIdx === subIdx && "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      {item.num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 w-full max-w-3xl mx-auto">
          {!hasConsented ? (
            <ConsentStep
              onAgree={() => setHasConsented(true)}
              onDisagree={handleDisagree}
            />
          ) : (
            <>
              {/* ─────────── Step 0 & 1: Dinamička pitanja ─────────── */}
              {currentStep === 0 && !showBeforeFinish && (
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
                          const status = getGroupStatus(g, state.answers);
                          const isActive = i === groupIdx;
                          let btnClass = "border bg-card text-muted-foreground hover:bg-muted";
                          
                          if (isActive) btnClass = "bg-primary text-primary-foreground";
                          else if (status === "completed") btnClass = "bg-secondary text-secondary-foreground";
                          else if (status === "partial") btnClass = "bg-primary text-primary-foreground opacity-80";

                          return (
                            <button
                              key={g.key}
                              onClick={() => {
                                setErrorKey(null);
                                setGroupIdx(i);
                                setSubIdx(0);
                              }}
                              className={cn(
                                "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold tracking-wider transition-colors",
                                btnClass,
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
                            <div
                              key={sub.category}
                              className="flex items-center"
                            >
                              <button
                                onClick={() => {
                                  setErrorKey(null);
                                  setSubIdx(i);
                                }}
                                className="flex flex-col items-center gap-1.5"
                              >
                                <div
                                  className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                                    subIdx === i
                                      ? "bg-primary text-primary-foreground"
                                      : getSubStatus(sub, state.answers) === "completed"
                                        ? "bg-secondary text-secondary-foreground"
                                        : getSubStatus(sub, state.answers) === "partial"
                                          ? "bg-primary text-primary-foreground opacity-80"
                                          : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </div>
                                <span className="max-w-[90px] text-center text-[10px] text-muted-foreground leading-tight">
                                  {shortSubLabel(sub.category)}
                                </span>
                              </button>
                              {i < currentGroup.subSteps.length - 1 && (
                                <div className="mx-2 h-px w-10 bg-border" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pitanja */}
                      <div className="rounded-lg border bg-card p-6 space-y-2">
                        {currentSub && (
                          <div className="mb-2 border-b border-border pb-3">
                            <h3 className="text-sm font-bold text-foreground">
                              {currentSub.category}
                            </h3>
                          </div>
                        )}
                        {currentQuestions.map((q) => (
                          <div
                            key={q.key}
                            id={`question-${q.key}`}
                            className={cn(
                              "transition-all duration-300",
                              errorKey === q.key ? "ring-2 ring-destructive ring-offset-2 p-3 bg-destructive/5 rounded-xl" : ""
                            )}
                          >
                            <QuestionRenderer
                              question={q}
                              value={state.answers[q.key]}
                              onChange={(v) => {
                                if (errorKey === q.key) setErrorKey(null);
                                setAnswer(q.key, v);
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Bottom nav */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            className="rounded-full px-6"
                            onClick={goBack}
                          >
                            Back
                          </Button>
                          <span className="text-sm font-bold text-foreground">
                            {progress}%
                          </span>
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
                        <h2 className="mb-4 text-2xl font-bold text-primary">
                          Before finishing the survey....
                        </h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                          Please tell us whether you actually completed the
                          survey for real or were just trying it out.
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
                      <Button
                        variant="outline"
                        className="rounded-full px-6"
                        onClick={() => {
                          setShowBeforeFinish(false);
                          setCurrentStep(0);
                        }}
                      >
                        Back
                      </Button>
                      <span className="text-sm font-bold text-foreground">
                        99%
                      </span>
                      <Button
                        className="rounded-full bg-secondary px-8 text-secondary-foreground hover:bg-secondary/90"
                        onClick={() => handleAttemptChoice(true)}
                      >
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
                    <h2 className="mb-2 text-3xl font-extrabold text-secondary">
                      Congratulations!
                    </h2>
                    <p className="mb-6 text-sm text-muted-foreground">
                      You've earned the {badge.name} badge!
                    </p>

                    <div className="mx-auto mb-6 inline-block rounded-lg border-2 border-secondary bg-card p-8">
                      <p className="mb-3 text-base font-bold text-foreground">
                        My Green Profile
                      </p>
                      <BadgeDisplay
                        name={badge.name}
                        description=""
                        size="sm"
                      />
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">
                        Your result is:
                      </p>
                      <p className="text-5xl font-bold text-secondary mt-1">
                        {score.toFixed(1).replace(".", ",")}
                      </p>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground max-w-md mx-auto">
                      <strong>{badge.name}:</strong> {badge.description}
                    </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg border bg-card p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                          Students ecological footprint
                        </h3>
                        <span className="text-muted-foreground text-sm">ⓘ</span>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={comparisonData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(210, 20%, 92%)"
                          />
                          <XAxis dataKey="country" tick={{ fontSize: 10 }} />
                          <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                            {comparisonData.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={
                                  (entry as { isYou: boolean }).isYou
                                    ? "hsl(210, 70%, 55%)"
                                    : "hsl(210, 50%, 75%)"
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-3 border-t pt-3">
                        <p className="text-xs font-semibold text-secondary">
                          Overview:
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your results are similar to 70% of students from your
                          country!
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                      <p className="mb-1 text-center text-xl font-extrabold text-primary">
                        SuMoS
                      </p>
                      <h3 className="mb-4 text-center text-lg font-bold text-foreground">
                        Get results
                      </h3>
                      <p className="mb-5 text-center text-xs text-muted-foreground">
                        Enter your e-mail to receive the full results directly
                        in your inbox.
                      </p>
                      <Label className="text-xs font-semibold text-muted-foreground">
                        E-mail
                      </Label>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        className="mb-4 mt-1"
                      />
                      <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        Send results <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-foreground">
                      Next steps...
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-3">
                      {[
                        {
                          step: "STEP 01",
                          title: "View detail results",
                          icon: Eye,
                          link: "/survey/results",
                        },
                        {
                          step: "STEP 02",
                          title: "Compare with others",
                          icon: BarChart3,
                          link: "/benchmark",
                        },
                        {
                          step: "STEP 03",
                          title: "Get suggestions",
                          icon: Lightbulb,
                          link: "/suggestions",
                        },
                      ].map((card) => (
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
                          <h3 className="text-sm font-bold text-secondary">
                            {card.title}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          </div>

          {/* Right Dummy Element (Balances the Left Sidebar to keep the main form perfectly centered) */}
          {hasConsented && currentStep === 0 && !showBeforeFinish && (
            <div className="hidden lg:block w-64 xl:w-80 shrink-0" />
          )}
        </div>
      </div>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-md">
          <div className="flex justify-center mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <svg
                className="h-8 w-8 text-secondary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary text-center">
              Before You Continue
            </DialogTitle>
            <DialogDescription className="text-sm text-center">
              Make sure to enter your email now so we can generate and send your
              benchmark code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-semibold text-foreground">
                E-mail address
              </Label>
              <Input
                type="email"
                placeholder="marko@example.com"
                className="mt-1"
                value={state.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              If you leave this page without requesting the results, you won't
              be able to return to your completed survey.
            </p>
            <Button
              onClick={handleEmailSubmit}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get my Benchmark Code
            </Button>
            <button
              className="w-full text-center text-sm text-muted-foreground hover:underline"
              onClick={() => {
                setShowEmailModal(false);
                completeSurvey();
                setCurrentStep(2);
              }}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
