import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { useSurvey } from "@/contexts/SurveyContext";
import { habitSubcategories, suggestions } from "@/data/mockData";
import { CheckCircle2 } from "lucide-react";

const categoryLabels: Record<string, string> = {
  Travel: "Travel",
  "Living & accommodation": "Living and accommodation",
  "Buying & consumption": "Buying and consumption",
  "Digital habits": "Digital habits",
  "Community engagement": "Community engagement",
};

export default function SurveyTips() {
  const { getSubcategoryScore } = useSurvey();

  const allCategories = habitSubcategories.map(sub => ({
    name: sub,
    label: categoryLabels[sub] || sub,
    score: getSubcategoryScore(sub),
  }));

  const lowScoreCategories = [...allCategories].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <Layout>
      <PageHeader title="View suggestions" subtitle="Students' Green Awareness and Sustainable Habits" />

      <div className="container py-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* All category scores */}
          <div className="rounded-lg bg-sumos-gray py-8 px-6">
            <h2 className="mb-6 text-center text-xl font-bold text-foreground">You have relatively low scores in:</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {allCategories.slice(0, 3).map(cat => (
                <div key={cat.name} className="rounded-xl border bg-card p-6 text-center shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">{cat.label}</h3>
                  <GaugeChart value={cat.score} size={140} />
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
              {allCategories.slice(3).map(cat => (
                <div key={cat.name} className="rounded-xl border bg-card p-6 text-center shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">{cat.label}</h3>
                  <GaugeChart value={cat.score} size={140} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="mb-8 text-2xl font-bold text-foreground">What should you do next?</h2>
            {lowScoreCategories.map(cat => {
              const tips = suggestions[cat.name] || [];
              return tips.map(section => (
                <div key={section.title} className="mb-8 flex gap-6">
                  <div className="hidden h-36 w-44 shrink-0 rounded-lg bg-muted sm:flex items-center justify-center">
                    <div className="text-2xl">🌿</div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-base font-bold text-primary">{section.title}:</h3>
                    <ul className="space-y-2.5">
                      {section.tips.map(tip => (
                        <li key={tip} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ));
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
