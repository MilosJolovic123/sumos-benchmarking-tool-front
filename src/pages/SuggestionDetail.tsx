import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { suggestions } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SuggestionDetail() {
  const { category } = useParams<{ category: string }>();
  const decodedCategory = decodeURIComponent(category || "");
  const tips = suggestions[decodedCategory] || [];

  return (
    <Layout>
      <PageHeader title="Recommendations" subtitle="Students' Green Awareness and Sustainable Habits" />

      <div className="container py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/suggestions"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Suggestions</Link>
          </Button>

          <h2 className="text-2xl font-bold text-foreground">{decodedCategory}</h2>
          <p className="text-sm text-muted-foreground">Practical ways to reduce your carbon footprint and improve sustainability.</p>

          {tips.length === 0 && (
            <p className="text-muted-foreground">No recommendations available for this category yet.</p>
          )}

          {tips.map(section => (
            <Card key={section.title} className="border shadow-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-base font-bold text-primary">{section.title}</h3>
                <ul className="space-y-3">
                  {section.tips.map(tip => (
                    <li key={tip} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
