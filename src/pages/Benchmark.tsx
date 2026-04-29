import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { FilterChip } from "@/components/shared/FilterChip";
import { scoreByCountry, habitsRadarByCountry, MOCK_SUBMISSION_CODES, submissionScore } from "@/data/mockSubmissions";
import { INSTITUTION_TO_STATE } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";

interface Filters {
  gender: string;
  country: string;
  institution: string;
  mobility: boolean;
}

export default function Benchmark() {
  const [code, setCode] = useState("");
  const [friendCode, setFriendCode] = useState("");
  const [filters, setFilters] = useState<Filters>({ gender: "", country: "", institution: "", mobility: false });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const applyFilters = () => {
    const chips: string[] = [];
    if (filters.gender) chips.push(filters.gender);
    if (filters.country) chips.push(filters.country);
    if (filters.institution) chips.push(filters.institution);
    if (filters.mobility) chips.push("Student mobility");
    setActiveFilters(chips);
  };

  const clearFilters = () => {
    setFilters({ gender: "", country: "", institution: "", mobility: false });
    setActiveFilters([]);
  };

  const countryFootprintData = scoreByCountry();
  const radarData = habitsRadarByCountry(["Croatia", "France", "Slovenia", "Slovakia"]);

  const yourSub = MOCK_SUBMISSION_CODES[code.trim().toUpperCase()];
  const friendSub = MOCK_SUBMISSION_CODES[friendCode.trim().toUpperCase()];
  const yourScore = yourSub ? submissionScore(yourSub) : 4.3;
  const friendScore = friendSub ? submissionScore(friendSub) : 3.6;

  const meVsFriendRadar = habitsRadarByCountry([
    yourSub?.state || "Croatia",
    friendSub?.state || "France",
  ]).map((d) => ({
    category: d.category,
    Me: d[yourSub?.state || "Croatia"] as number,
    "My colleague": d[friendSub?.state || "France"] as number,
    fullMark: 5,
  }));

  const benchmarkData = [
    ...countryFootprintData.slice(0, 5),
    { country: "You", score: yourScore, color: "hsl(210, 70%, 55%)" },
  ];

  return (
    <Layout>
      <PageHeader title="Benchmark" />

      <div className="container py-8 space-y-10">
        {/* Section 1: View detailed results */}
        <div>
          <h2 className="mb-1 text-xl font-bold text-foreground">View detailed results</h2>
          <p className="mb-5 text-sm text-muted-foreground">Compare your results with others via a unique code, sent by you through email.</p>

          <div className="mb-6 flex items-end gap-3 max-w-lg">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Your single-code:</Label>
              <Input placeholder="Enter your code" className="mt-1" value={code} onChange={e => setCode(e.target.value)} />
            </div>
            <Button className="rounded-full bg-secondary px-6 text-secondary-foreground hover:bg-secondary/90">
              Show results
            </Button>
          </div>

          {/* Filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm font-bold text-foreground">≡ Filters</span>
              {activeFilters.map(f => (
                <FilterChip key={f} label={f} onRemove={() => setActiveFilters(activeFilters.filter(a => a !== f))} />
              ))}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Filter sidebar */}
            <div className="space-y-4 rounded-lg border bg-card p-5">
              <div>
                <Label className="text-xs text-muted-foreground">Mobility status</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Yes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Country</Label>
                <Select value={filters.country} onValueChange={v => setFilters({ ...filters, country: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select country by name" /></SelectTrigger>
                  <SelectContent>
                    {Array.from(new Set(Object.values(INSTITUTION_TO_STATE))).filter(c => c !== "Unknown").map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Institution</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select institution by name" /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(INSTITUTION_TO_STATE).filter(i => i !== "Other").map(i => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Participation in student mobility</Label>
                <Switch checked={filters.mobility} onCheckedChange={v => setFilters({ ...filters, mobility: v })} />
              </div>
              <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={applyFilters}>Apply</Button>
              <button className="w-full text-center text-xs text-muted-foreground underline" onClick={clearFilters}>Clear all filters</button>
            </div>

            {/* Bar chart */}
            <div className="rounded-lg border bg-card p-5 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Students ecological footprint by country</h3>
                <span className="text-muted-foreground text-sm">ⓘ</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={benchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 92%)" />
                  <XAxis dataKey="country" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                    {benchmarkData.map((entry, i) => (
                      <Cell key={i} fill={entry.country === "You" ? "hsl(210, 70%, 55%)" : "hsl(210, 50%, 75%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart */}
            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Student mobility</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(210, 20%, 88%)" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 8 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 8 }} />
                  <Radar dataKey="Croatia" stroke="hsl(207, 44%, 20%)" fill="hsl(207, 44%, 20%)" fillOpacity={0.15} />
                  <Radar dataKey="France" stroke="hsl(145, 63%, 42%)" fill="hsl(145, 63%, 42%)" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Section 2: 1-to-1 Benchmark */}
        <div>
          <h2 className="mb-1 text-xl font-bold text-foreground">Benchmark with a friend or yourself</h2>
          <p className="mb-6 text-sm text-muted-foreground">This option allows user to make <strong>1 to 1 benchmark</strong> with other respondents, using their code.</p>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Code inputs */}
            <div className="space-y-4 rounded-lg border bg-card p-5">
              <div>
                <Label className="text-xs font-semibold text-foreground">Your code</Label>
                <Input placeholder="Enter your code" className="mt-1" value={code} onChange={e => setCode(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-foreground">Another code</Label>
                <Input placeholder="Enter another code" className="mt-1" value={friendCode} onChange={e => setFriendCode(e.target.value)} />
              </div>
              <Button className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Compare</Button>
            </div>

            {/* Two gauges */}
            <div className="rounded-lg border bg-card p-5 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Students ecological footprint</h3>
                <span className="text-muted-foreground text-sm">ⓘ</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="mb-1 text-xs font-semibold text-secondary">Your green score</p>
                  <p className="mb-3 text-xs text-muted-foreground">Overall</p>
                  <GaugeChart value={yourScore} size={130} />
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs font-semibold text-secondary">Another green score</p>
                  <p className="mb-3 text-xs text-muted-foreground">Overall</p>
                  <GaugeChart value={friendScore} size={130} />
                </div>
              </div>
            </div>

            {/* Radar */}
            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Student mobility</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={meVsFriendRadar}>
                  <PolarGrid stroke="hsl(210, 20%, 88%)" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 8 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 8 }} />
                  <Radar name="Me" dataKey="Me" stroke="hsl(207, 44%, 20%)" fill="hsl(207, 44%, 20%)" fillOpacity={0.2} />
                  <Radar name="My colleague" dataKey="My colleague" stroke="hsl(145, 63%, 42%)" fill="hsl(145, 63%, 42%)" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
