import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { habitSubcategories } from "@/data/mockData";
import { ArrowRight } from "lucide-react";
import logoFoi from "@/assets/logo-foi.png";
import logoEsiea from "@/assets/logo-esiea.png";
import logoZilina from "@/assets/logo-zilina.png";
import logoMaribor from "@/assets/logo-maribor.png";
import logoFon from "@/assets/logo-fon.png";

const institutionLogos = [
  { name: "Faculty of Organization and Informatics (FOI)", logo: logoFoi },
  { name: "ESIEA", logo: logoEsiea },
  { name: "University of Žilina", logo: logoZilina },
  { name: "University of Maribor", logo: logoMaribor },
  { name: "Faculty of Organizational Sciences (FON)", logo: logoFon },
];

const categoryScores: Record<string, number> = {
  Travel: 3.2,
  "Living & accommodation": 2.1,
  "Buying & consumption": 3.2,
  "Digital habits": 4.6,
  "Community engagement": 3.8,
};

const categoryLabels: Record<string, string> = {
  Travel: "Travel",
  "Living & accommodation": "Living and accommodation",
  "Buying & consumption": "Buying",
  "Digital habits": "Digital habits",
  "Community engagement": "Community engagement",
};

// Add Consumption as a 6th card to match prototype 3x2 grid
const allCategories = [
  ...habitSubcategories.map(sub => ({ key: sub, label: categoryLabels[sub] || sub, score: categoryScores[sub] || 3 })),
  { key: "consumption", label: "Consumption", score: 3.4 },
];

export default function Suggestions() {
  return (
    <Layout>
      <PageHeader title="Suggestions" />

      <div className="container py-8">
        {/* What should you do next */}
        <div className="rounded-lg bg-sumos-gray px-6 py-10">
          <h2 className="mb-3 text-center text-2xl font-bold text-foreground">What should you do next?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted-foreground leading-relaxed">
            In this section, you can explore practical <strong>recommendations</strong> for incorporating
            <strong> eco-friendly behaviors</strong> into your routine. These small changes can make a big
            difference in supporting a healthier planet.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allCategories.map(cat => (
              <div key={cat.key} className="rounded-xl border bg-card p-6 text-center">
                <h3 className="mb-4 text-sm font-bold text-foreground">{cat.label}</h3>
                <GaugeChart value={cat.score} size={150} />
                <Link
                  to={`/suggestions/${encodeURIComponent(cat.key === "consumption" ? "Buying & consumption" : cat.key)}`}
                  className="mt-4 inline-flex items-center text-xs font-medium text-secondary hover:underline"
                >
                  View recommendations <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Institutions */}
        <div className="mt-10">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground">Explore Green practices by institutions</h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {institutionLogos.map(inst => (
              <div key={inst.name} className="flex flex-col items-center justify-center rounded-lg border bg-card p-5 hover:shadow-sm transition-shadow min-h-[160px]">
                <img src={inst.logo} alt={inst.name} className="max-h-20 w-auto object-contain mb-3" />
                <p className="text-center text-xs font-medium text-muted-foreground">{inst.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
