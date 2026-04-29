import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { BadgeDisplay } from "@/components/shared/BadgeDisplay";
import { useSurvey } from "@/contexts/SurveyContext";
import { surveyQuestions, getBadge } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SurveyResults() {
  const { state, getScore } = useSurvey();
  const score = getScore();
  const badge = getBadge(score);

  const categories = [
    { name: "Awareness", icon: "☀️", questions: surveyQuestions.filter(q => q.category === "Awareness") },
    { name: "Attitudes", icon: "💭", questions: surveyQuestions.filter(q => q.category === "Attitudes") },
    { name: "Habits", icon: "🔄", questions: surveyQuestions.filter(q => q.category === "Habits") },
    { name: "Barriers", icon: "🚧", questions: surveyQuestions.filter(q => q.category === "Barriers") },
  ];

  return (
    <Layout>
      <PageHeader title="View detailed results" subtitle="Students' Green Awareness and Sustainable Habits" />

      <div className="container py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* My Green Profile */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border-2 border-secondary bg-card p-6 text-center">
              <p className="mb-3 text-base font-bold text-foreground">My Green Profile</p>
              <BadgeDisplay name={badge.name} description="" size="sm" />
              <p className="mt-4 text-sm text-muted-foreground">
                Your result is: <span className="text-xl font-bold text-secondary">{score.toFixed(1).replace(".", ",")}</span>
              </p>
            </div>
            <div className="lg:col-span-2 rounded-lg border bg-card p-6">
              <h3 className="mb-3 text-base font-bold text-foreground">Description</h3>
              <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                Earned by participants who are <strong>moderately engaged</strong> in green and sustainable behavior.
                They <strong>make conscious choices</strong> to reduce their environmental impact — such as using public transport, saving energy and water, and occasionally choosing eco-friendly options.
              </p>
              <Link to="/survey/tips" className="inline-flex items-center text-sm font-medium text-secondary hover:underline">
                View suggestions <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Category breakdowns */}
          {categories.map(cat => {
            const catScore = cat.questions.length > 0
              ? Number((cat.questions.map(q => Number(state.answers[q.id]) || 0).reduce((a, b) => a + b, 0) / cat.questions.length).toFixed(1))
              : 0;
            return (
              <div key={cat.name} className="rounded-lg border bg-card p-6">
                <div className="grid gap-6 lg:grid-cols-4">
                  {/* Gauge */}
                  <div className="flex flex-col items-center justify-center">
                    <GaugeChart value={catScore} size={120} />
                  </div>

                  {/* Questions with score bars */}
                  <div className="lg:col-span-3 space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                      <span>{cat.icon}</span> {cat.name}
                    </h3>
                    {cat.questions.map(q => {
                      const val = Number(state.answers[q.id]) || 0;
                      const pct = (val / 5) * 100;
                      // Color coding matching prototype
                      const barColors = [
                        "bg-destructive/60",     // 1 - red
                        "bg-orange-400",          // 2 - orange  
                        "bg-yellow-400",          // 3 - yellow
                        "bg-secondary/70",        // 4 - light green
                        "bg-secondary",           // 5 - green
                      ];
                      return (
                        <div key={q.id} className="flex items-center gap-4">
                          <span className="min-w-[220px] text-xs text-muted-foreground">• {q.text.length > 50 ? q.text.slice(0, 50) + "..." : q.text}</span>
                          <div className="flex flex-1 items-center gap-1">
                            {[1, 2, 3, 4, 5].map(n => (
                              <div key={n} className="flex flex-col items-center flex-1">
                                <div className={`h-2.5 w-full rounded-full ${n <= val ? barColors[Math.min(val - 1, 4)] : "bg-muted"}`} />
                                <span className="text-[9px] text-muted-foreground mt-0.5">{n}</span>
                              </div>
                            ))}
                          </div>
                          <span className="text-xs w-4">{pct >= 80 ? "🟢" : pct >= 40 ? "🟡" : "🔴"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Send via email */}
          <div className="text-center">
            <Button className="rounded-full bg-secondary px-10 text-secondary-foreground hover:bg-secondary/90">
              Send via email <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
