import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardCheck,
  BarChart3,
  Lightbulb,
  ClipboardList,
  Timer,
  Globe,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { OutlineWorldMap } from "@/components/shared/OutlineWorldMap";
import { Layout } from "@/components/layout/Layout";
import { scoreByCountry } from "@/data/mockSubmissions";
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

// Slike (proveri putanje u svom projektu)
import logoFull from "@/assets/logo-sumos.png";
import heroIllustration from "@/assets/hero-illustration.png";
import logoFoi from "@/assets/logo-foi.png";
import logoEsiea from "@/assets/logo-esiea.png";
import logoZilina from "@/assets/logo-zilina.png";
import logoMaribor from "@/assets/logo-maribor.png";
import logoBelgradeFos from "@/assets/logo-fon.png";
import heroBlob from "@/assets/hero-blob.png";
import logoEu from "@/assets/eu-flag.jpg";

const countryFootprintData = scoreByCountry();

const actionCards = [
  {
    step: "STEP 01",
    title: "Take a survey",
    description:
      "It is a survey about students' green awareness and sustainable habits.",
    link: "/survey",
    icon: <ClipboardCheck className="h-10 w-10 text-sumos-blue" />,
    borderColor: "border-sumos-blue/30",
    badgeColor: "bg-sumos-blue",
  },
  {
    step: "STEP 02",
    title: "Launch benchmark",
    description:
      "Compare your results with others based on gender, country, mobility participation, etc.",
    link: "/benchmark",
    icon: <BarChart3 className="h-10 w-10 text-sumos-green" />,
    borderColor: "border-sumos-green/30",
    badgeColor: "bg-sumos-green",
  },
  {
    step: "STEP 03",
    title: "Get suggestions",
    description:
      "See tips and recommendations to improve your sustainable habits and awareness.",
    link: "/suggestions",
    icon: <Lightbulb className="h-10 w-10 text-sumos-green" />,
    borderColor: "border-sumos-lime/50",
    badgeColor: "bg-sumos-lime",
  },
];

const awarenessData = [
  { country: "Germany", level: 82 },
  { country: "Poland", level: 65 },
  { country: "France", level: 78 },
  { country: "Netherlands", level: 62 },
  { country: "Spain", level: 72 },
  { country: "Belgium", level: 58 },
  { country: "Italy", level: 65 },
  { country: "Portugal", level: 52 },
];

const institutions = [
  { name: "FOI", logo: logoFoi },
  { name: "ESIEA", logo: logoEsiea },
  { name: "University of Žilina", logo: logoZilina },
  { name: "University of Belgrade FOS", logo: logoBelgradeFos },
  { name: "University of Maribor", logo: logoMaribor },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] w-full overflow-hidden bg-[#FFFFFF] py-16 lg:py-20">
  
  {/* Pozadinski Blob - Fiksiran za levi ugao, responzivan */}
  <img 
    src={heroBlob} 
    alt="" 
    className="
      absolute left-0 top-0 
      h-[110%] w-full            
      md:w-[85%] lg:w-[70%]      
      xl:w-[60%] 2xl:w-[55%]     
      object-cover               
      object-left-top            
      z-0 
      pointer-events-none        
      select-none
    "
  />

  <div className="container relative z-10">
    <div className="grid items-center gap-12 lg:grid-cols-2">
      
      {/* Leva strana: Tekst - ostaje u kontejneru koji je centriran */}
      <div className="flex flex-col items-start gap-6 lg:max-w-lg">
        <img src={logoFull} alt="SuMoS" className="h-14 w-auto" />
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight lg:text-6xl">
          Benchmarking tool
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          The benchmarking tool is part of the Erasmus+ European Commission
          co-funded Education project "<strong className="text-primary font-semibold">Strengthening the Ecosystem for
          Sustainable Modern Industry</strong>" (SuMoS).
        </p>
        <Button asChild className="rounded-md bg-sumos-blue px-8 h-12 text-white font-medium hover:bg-sumos-blue/90 shadow-sm">
          <Link to="/survey">
            Take a survey <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      {/* Desna strana: Ilustracija */}
      <div className="relative flex justify-center lg:justify-end">
        <img
          src={heroIllustration}
          alt="Student illustration"
          className="w-full max-w-[500px] xl:max-w-[580px] object-contain"
        />
      </div>
    </div>
  </div>
</section>

      {/* Action Cards Section */}
      <section className="container -mt-10 relative z-20 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {actionCards.map((card) => (
            <Link
              key={card.step}
              to={card.link}
              className={`group relative flex flex-col items-start rounded-xl border bg-white p-8 pt-12 transition-all hover:shadow-lg ${card.borderColor}`}
            >
              <span
                className={`absolute top-4 right-4 rounded px-2 py-0.5 text-[10px] font-bold text-white tracking-wider ${card.badgeColor}`}
              >
                {card.step}
              </span>
              <div className="mb-6">{card.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-sumos-blue">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Statistics Section */}
      <section className="bg-[#F8F9FA] py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-4xl font-bold text-primary">
              Explore statistics
            </h2>
            <Link
              to="/statistics"
              className="flex items-center text-sm font-semibold text-sumos-blue hover:underline"
            >
              Go to statistics <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Bar Chart Card */}
            <div className="rounded-2xl border bg-white p-8 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">
                  Students ecological footprint
                </h3>
                <span className="text-muted-foreground cursor-help">ⓘ</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryFootprintData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F0F0F0"
                  />
                  <XAxis
                    dataKey="country"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 5]}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: "#F9FAFB" }} />
                  <Bar dataKey="score" barSize={40} radius={[4, 4, 0, 0]}>
                    {countryFootprintData.map((_, idx) => (
                      <Cell key={idx} fill="hsl(var(--sumos-blue))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gauge Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-white p-8">
              <h3 className="mb-6 text-lg font-bold text-sumos-green">
                Eco score
              </h3>
              <GaugeChart value={4.7} maxValue={5} size={220} />
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  The overall eco score is:
                </p>
                <p className="text-lg font-bold text-primary uppercase tracking-tight">
                  Excellent
                </p>
              </div>
            </div>
          </div>

          {/* Stats Summary Bar */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Number of filled surveys",
                value: "520",
                icon: <ClipboardList className="h-6 w-6 text-sumos-blue" />,
                bg: "bg-white",
              },
              {
                label: "Average completion time",
                value: "10m 42s",
                icon: <Timer className="h-6 w-6 text-sumos-green" />,
                bg: "bg-white",
              },
              {
                label: "Top eco profile",
                value: "Eco Explorer",
                icon: <Globe className="h-6 w-6 text-sumos-green" />,
                bg: "bg-white",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex items-center gap-5 rounded-xl border p-6 ${stat.bg}`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p
                    className={`text-2xl font-bold ${i === 0 ? "text-sumos-blue" : "text-sumos-green"}`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Green Awareness Section */}
      <section className="container py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-primary">Green awareness</h2>
          <Link
            to="/statistics"
            className="flex items-center text-sm font-semibold text-sumos-blue hover:underline"
          >
            See full statistics <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="mb-12 flex justify-center opacity-80">
          <OutlineWorldMap />
        </div>

        <div className="rounded-2xl border bg-white p-10">
          <h3 className="mb-8 text-xl font-bold text-primary">
            Level of awareness by country
          </h3>
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-2">
            {awarenessData.map((item) => (
              <div key={item.country}>
                <div className="mb-2 flex items-center justify-between text-sm font-medium">
                  <span className="text-muted-foreground">{item.country}</span>
                  <span className="text-primary">{item.level}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-sumos-green transition-all duration-1000"
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="container pb-24 text-center">
        <h2 className="mb-12 text-3xl font-bold text-primary">
          Explore Green practices by institution
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {institutions.map((inst) => (
            <div
              key={inst.name}
              className="flex h-32 items-center justify-center rounded-xl border bg-white p-6 transition-all hover:shadow-md"
            >
              <img
                src={inst.logo}
                alt={inst.name}
                className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
