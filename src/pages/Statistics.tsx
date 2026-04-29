import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { StatCard } from "@/components/shared/StatCard";
import { scoreByCountry, behaviourBars, habitsRadarByCountry, statsOverview, MOCK_SUBMISSIONS } from "@/data/mockSubmissions";
import { FileText, Hourglass, Award } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";

export default function Statistics() {
  const countryFootprintData = scoreByCountry();
  const behaviourData = behaviourBars();
  const radarData = habitsRadarByCountry(["Croatia", "France", "Slovenia"]);
  const overview = statsOverview();
  return (
    <Layout>
      <PageHeader title="Statistics" />

      <div className="container py-8 space-y-8">
        {/* Footprint + Gauge */}
        <div className="rounded-lg bg-sumos-gray p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-5 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Students ecological footprint</h3>
                <span className="text-muted-foreground text-sm">ⓘ</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={countryFootprintData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" />
                  <XAxis dataKey="country" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(210, 70%, 55%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-secondary">Green score</h3>
              <GaugeChart value={overview.globalGreenScore} maxValue={5} size={160} sublabel="The overall green score is" />
              <span className="mt-1 text-sm font-bold text-foreground">Excellent</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <StatCard icon={FileText} label="NUMBER OF FILLED SURVEYS" value={String(overview.totalSurveys)} />
            <StatCard icon={Hourglass} label="AVERAGE COMPLETION TIME" value={overview.avgCompletionTime} />
            <StatCard icon={Award} label="POPULAR BADGE" value={overview.popularBadge} />
          </div>
        </div>

        {/* Behaviour + Radar */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 text-base font-semibold text-foreground">Sustainable behaviour</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={behaviourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(210, 70%, 55%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 text-base font-semibold text-foreground">Sustainable habits</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(210, 20%, 88%)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9 }} />
                <Radar name="Croatia" dataKey="Croatia" stroke="hsl(145, 63%, 42%)" fill="hsl(145, 63%, 42%)" fillOpacity={0.15} />
                <Radar name="France" dataKey="France" stroke="hsl(207, 44%, 20%)" fill="hsl(207, 44%, 20%)" fillOpacity={0.15} />
                <Radar name="Slovenia" dataKey="Slovenia" stroke="hsl(210, 70%, 55%)" fill="hsl(210, 70%, 55%)" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
