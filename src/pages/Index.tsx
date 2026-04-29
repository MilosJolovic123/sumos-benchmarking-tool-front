import { Link } from "react-router-dom";
import { ArrowRight, FileText, Hourglass, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { OutlineWorldMap } from "@/components/shared/OutlineWorldMap";
import { Layout } from "@/components/layout/Layout";
import { scoreByCountry } from "@/data/mockSubmissions";
const countryFootprintData = scoreByCountry();
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import logoFull from "@/assets/sumos-logo.png";
import heroIllustration from "@/assets/hero-illustration.jpg";
import logoFoi from "@/assets/logo-foi.png";
import logoEsiea from "@/assets/logo-esiea.png";
import logoZilina from "@/assets/logo-zilina.png";
import logoMaribor from "@/assets/logo-maribor.png";
import logoBelgradeFos from "@/assets/logo-fon.png";

type StepColor = "blue" | "green" | "lime";

interface ActionCard {
  step: string;
  title: string;
  description: string;
  link: string;
  color: StepColor;
  icon: JSX.Element;
}

const actionCards: ActionCard[] = [
  {
    step: "STEP 01",
    title: "Take a survey",
    description: "It is a survey about students' green awareness and sustainable habits.",
    link: "/survey",
    color: "blue",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M8 15h5" />
        <path d="M16 14l-2 2 4 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    step: "STEP 02",
    title: "Launch benchmark",
    description: "Compare your results with others based on gender, country, mobility participation, etc.",
    link: "/benchmark",
    color: "green",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 5 5-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    step: "STEP 03",
    title: "Get suggestions",
    description: "See tips and recommendations to improve your sustainable habits and awareness.",
    link: "/suggestions",
    color: "lime",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" />
      </svg>
    ),
  },
];

const stepStyles: Record<StepColor, { badge: string; title: string; border: string; icon: string }> = {
  blue: {
    badge: "bg-sumos-blue text-white",
    title: "text-sumos-blue",
    border: "border-sumos-blue/40 hover:border-sumos-blue",
    icon: "text-sumos-blue",
  },
  green: {
    badge: "bg-sumos-green text-white",
    title: "text-sumos-green",
    border: "border-sumos-green/40 hover:border-sumos-green",
    icon: "text-sumos-green",
  },
  lime: {
    badge: "bg-sumos-lime text-white",
    title: "text-sumos-green",
    border: "border-sumos-lime/50 hover:border-sumos-lime",
    icon: "text-sumos-green",
  },
};

const awarenessDataExtended = [
  { country: "Germany", level: 85 },
  { country: "France", level: 78 },
  { country: "Spain", level: 72 },
  { country: "Italy", level: 68 },
  { country: "Poland", level: 65 },
  { country: "Netherlands", level: 62 },
  { country: "Belgium", level: 58 },
  { country: "Portugal", level: 52 },
];

const institutions = [
  { name: "FOI", logo: logoFoi },
  { name: "ESIEA", logo: logoEsiea },
  { name: "University of Žilina", logo: logoZilina },
  { name: "University of Maribor", logo: logoMaribor },
  { name: "University of Belgrade FOS", logo: logoBelgradeFos },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-12 lg:py-16">
        {/* Decorative blue blob */}
        <div className="pointer-events-none absolute -left-40 -top-20 h-[600px] w-[700px] rounded-full bg-sumos-blue/10 blur-2xl" />
        {/* Subtle clouds top */}
        <div className="pointer-events-none absolute right-20 top-10 h-2 w-2 rounded-full bg-sumos-blue/20" />
        <div className="container relative">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-5">
              <img src={logoFull} alt="SuMoS" className="h-16 w-auto" />
              <h1 className="text-5xl font-bold text-primary tracking-tight lg:text-[56px] lg:leading-[1.05]">
                Benchmarking tool
              </h1>
              <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
                The benchmarking tool is part of the Erasmus+ European Commission
                co-funded Education project "<strong className="text-primary">Strengthening the Ecosystem for
                Sustainable Modern Industry</strong>" (SuMoS).
              </p>
              <Button asChild className="rounded-lg bg-sumos-blue px-7 py-3 text-white font-semibold hover:bg-sumos-blue/90 h-12">
                <Link to="/survey">
                  Take a survey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={heroIllustration}
                alt="Student exploring European cities with laptop"
                className="w-full max-w-xl mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="container py-8 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {actionCards.map(card => {
            const styles = stepStyles[card.color];
            return (
              <Link
                key={card.step}
                to={card.link}
                className={`group relative rounded-xl border-2 bg-card p-6 pt-10 transition-all hover:shadow-md ${styles.border}`}
              >
                <span className={`absolute -top-3 right-6 rounded-md px-3 py-1 text-[10px] font-bold tracking-widest ${styles.badge}`}>
                  {card.step}
                </span>
                <div className={`mb-4 ${styles.icon}`}>
                  {card.icon}
                </div>
                <h3 className={`mb-2 text-lg font-bold ${styles.title}`}>{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Explore Statistics */}
      <section className="bg-sumos-gray py-12">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-primary">Explore statistics</h2>
            <Link to="/statistics" className="flex items-center text-sm font-medium text-sumos-blue hover:underline">
              Go to statistics <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Bar Chart */}
            <div className="rounded-xl border bg-card p-6 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-primary">Students ecological footprint</h3>
                <span className="text-muted-foreground text-sm">ⓘ</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={countryFootprintData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" vertical={false} />
                  <XAxis dataKey="country" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {countryFootprintData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={idx % 2 === 0 ? "hsl(var(--sumos-blue))" : "hsl(var(--sumos-light-blue))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Eco Score Gauge */}
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-6">
              <h3 className="mb-3 text-base font-semibold text-sumos-green">Eco score</h3>
              <GaugeChart
                value={4.7}
                maxValue={5}
                size={180}
              />
              <p className="mt-2 text-sm text-muted-foreground text-center">
                The overall eco score is <span className="font-bold text-primary">Excellent</span>
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sumos-blue/10">
                <FileText className="h-6 w-6 text-sumos-blue" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Number of filled surveys</p>
                <p className="text-2xl font-bold text-sumos-blue">520</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sumos-green/10">
                <Hourglass className="h-6 w-6 text-sumos-green" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Average completion time</p>
                <p className="text-2xl font-bold text-sumos-green">10m 42s</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sumos-green/10">
                <Award className="h-6 w-6 text-sumos-green" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top eco profile</p>
                <p className="text-2xl font-bold text-sumos-green">Eco Explorer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Green Awareness */}
      <section className="container py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-primary">Green awareness</h2>
          <Link to="/statistics" className="flex items-center text-sm font-medium text-sumos-blue hover:underline">
            See full statistics <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Outline world map */}
        <div className="mb-6 rounded-xl bg-background p-2">
          <div className="h-[420px] w-full">
            <OutlineWorldMap />
          </div>
        </div>

        {/* 2-column awareness bars */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-5 text-base font-semibold text-primary">Level of awareness by country</h3>
          <div className="grid gap-x-12 gap-y-4 md:grid-cols-2">
            {awarenessDataExtended.map(item => (
              <div key={item.country}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.country}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{item.level}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sumos-green transition-all"
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Green practices by institution */}
      <section className="container pb-16 pt-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary">
          Explore Green practices by institution
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {institutions.map(inst => (
            <div
              key={inst.name}
              className="flex aspect-square items-center justify-center rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <img
                src={inst.logo}
                alt={`${inst.name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
