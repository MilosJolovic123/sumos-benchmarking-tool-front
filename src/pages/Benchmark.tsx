import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { GaugeChart } from "@/components/shared/GaugeChart";
import { Filter, X, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Legend,
} from "recharts";

// Assets
import logoFull from "@/assets/logo-sumos.png";
import logoEu from "@/assets/eu-flag.jpg";

// Mock podaci usklađeni sa dizajnom
const barData = [
  { country: "Croatia", score: 2.5 },
  { country: "France", score: 2.5 },
  { country: "Serbia", score: 0.9 },
  { country: "Slovakia", score: 2.0 },
  { country: "Finn Baker (you)", score: 4.3 },
  { country: "Belgium", score: 2.5 },
];

const radarData = [
  { subject: "sustainable arrival", A: 120, B: 110 },
  { subject: "living and accomodation", A: 98, B: 130 },
  { subject: "food and consumption", A: 86, B: 130 },
  { subject: "digital habits", A: 99, B: 100 },
];

const Benchmark = () => {
  return (
    <Layout>
      <div className="bg-sumos-gray-50 min-h-screen font-sans">
        {/* Header Section */}
        <div className="container py-8">
          <div className="flex items-center justify-between border-b border-sumos-gray-100 pb-6">
            <h1 className="text-4xl lg:text-5xl font-normal text-sumos-blue-300">
              Benchmark
            </h1>
            <img src={logoFull} alt="SuMoS" className="h-12 w-auto" />
          </div>
        </div>

        {/* View Detailed Results */}
        <section className="container mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-medium text-sumos-blue-300 mb-3">
                View detailed results
              </h2>
              <p className="text-sumos-blue-200 text-sm leading-relaxed">
                Compare your results with others via a unique code, sent by you
                through email.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-sumos-gray-300">
                Your single-code:
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your code"
                  className="bg-white border-sumos-gray-100 w-[260px] h-11"
                />
                <Button className="bg-sumos-green-300 hover:bg-sumos-green-400 text-white px-8 h-11 transition-colors">
                  Show results
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Row */}
        <section className="container mb-8">
          <div className="flex items-center gap-3 py-4 border-t border-b border-sumos-gray-100">
            <div className="flex items-center gap-2 text-sumos-blue-200 font-bold text-sm mr-4">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </div>
            <Badge className="bg-white border border-sumos-gray-100 text-sumos-blue-200 hover:bg-white px-3 py-1 font-normal flex gap-2">
              Female{" "}
              <X className="h-3 w-3 cursor-pointer text-sumos-gray-200" />
            </Badge>
            <Badge className="bg-white border border-sumos-gray-100 text-sumos-blue-200 hover:bg-white px-3 py-1 font-normal flex gap-2">
              Croatia{" "}
              <X className="h-3 w-3 cursor-pointer text-sumos-gray-200" />
            </Badge>
            <Badge className="bg-white border border-sumos-gray-100 text-sumos-blue-200 hover:bg-white px-3 py-1 font-normal flex gap-2">
              Student mobility{" "}
              <X className="h-3 w-3 cursor-pointer text-sumos-gray-200" />
            </Badge>
          </div>
        </section>

        {/* First Results Row */}
        <section className="container grid gap-6 lg:grid-cols-4 mb-16">
          {/* Sidebar Filters */}
          <div className="rounded-2xl border border-sumos-gray-100 bg-white p-7 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-sumos-blue-200 uppercase tracking-wider">
                  Mobility status
                </Label>
                <select className="w-full rounded-md border border-sumos-gray-100 bg-white px-3 py-2 text-sm text-sumos-blue-300">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-sumos-blue-200 uppercase tracking-wider">
                  Country
                </Label>
                <select className="w-full rounded-md border border-sumos-gray-100 bg-white px-3 py-2 text-sm text-sumos-gray-200">
                  <option>Select country by name</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-sumos-blue-200 uppercase tracking-wider">
                  Institution
                </Label>
                <select className="w-full rounded-md border border-sumos-gray-100 bg-white px-3 py-2 text-sm text-sumos-gray-200">
                  <option>Select institution by name</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label className="text-xs font-bold text-sumos-blue-200 leading-tight">
                  Participation in student mobility
                </Label>
                <Switch
                  className="data-[state=checked]:bg-sumos-green-300"
                  defaultChecked
                />
              </div>
              <div className="pt-4 space-y-3">
                <Button className="w-full bg-sumos-green-300 hover:bg-sumos-green-400 text-white h-11">
                  Apply
                </Button>
                <Button
                  variant="link"
                  className="w-full text-sumos-gray-300 text-xs font-normal"
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          </div>

          {/* Footprint Bar Chart */}
          <div className="rounded-2xl border border-sumos-gray-100 bg-white p-8 lg:col-span-2 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-bold text-sumos-blue-300">
                Students ecological footprint by country
              </h3>
              <Info className="h-4 w-4 text-sumos-gray-200" />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6"
                />
                <XAxis
                  dataKey="country"
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={35}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.country.includes("(you)") ? "#518EFA" : "#E5E7EB"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Single Radar Chart */}
          <div className="rounded-2xl border border-sumos-gray-100 bg-white p-8 shadow-sm text-center">
            <h3 className="font-bold text-sumos-blue-300 mb-6 text-left">
              Student mobility
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 9, fill: "#455369" }}
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#64A550"
                  fill="#64A550"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 1 to 1 Benchmark Section */}
        <section className="container mb-8">
          <h2 className="text-2xl font-medium text-sumos-blue-300 mb-2">
            Benchmark with a friend or yourself
          </h2>
          <p className="text-sumos-blue-200 text-sm">
            This option allows user to{" "}
            <strong className="text-sumos-blue-300">
              make 1 to 1 benchmark
            </strong>{" "}
            with other respondents, using their code.
          </p>
        </section>

        {/* Second Results Row */}
        <section className="container grid gap-6 lg:grid-cols-4 pb-20">
          {/* Comparison Inputs */}
          <div className="rounded-2xl border border-sumos-gray-100 bg-white p-7 space-y-6 shadow-sm">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-sumos-blue-200 uppercase tracking-wider">
                Your code
              </Label>
              <Input
                placeholder="Enter your code"
                className="bg-sumos-gray-50 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-sumos-blue-200 uppercase tracking-wider">
                Another code
              </Label>
              <Input
                placeholder="Enter another code"
                className="bg-sumos-gray-50 border-none h-11"
              />
            </div>
            <Button className="w-full bg-sumos-green-300 hover:bg-sumos-green-400 text-white h-11 mt-4">
              Compare
            </Button>
          </div>

          {/* Double Gauge Comparison */}
          <div className="rounded-2xl border border-sumos-gray-100 bg-white p-8 lg:col-span-2 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-bold text-sumos-blue-300">
                Students ecological footprint
              </h3>
              <Info className="h-4 w-4 text-sumos-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-sm font-bold text-sumos-green-300 mb-1">
                  Your green score
                </p>
                <p className="text-[10px] text-sumos-gray-300 mb-6 font-medium uppercase">
                  Overall
                </p>
                <GaugeChart value={4.8} maxValue={6} size={150} />
                <p className="mt-4 text-2xl font-bold text-sumos-blue-300">
                  4,8
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-sumos-blue-100 mb-1">
                  Another green score
                </p>
                <p className="text-[10px] text-sumos-gray-300 mb-6 font-medium uppercase">
                  Overall
                </p>
                <GaugeChart value={3.6} maxValue={6} size={150} />
                <p className="mt-4 text-2xl font-bold text-sumos-blue-300">
                  3,6
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Radar */}
          <div className="rounded-2xl border border-sumos-gray-100 bg-white p-8 shadow-sm">
            <h3 className="font-bold text-sumos-blue-300 mb-4">
              Student mobility
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 8, fill: "#455369" }}
                />
                <Radar
                  name="Me"
                  dataKey="A"
                  stroke="#233662"
                  fill="#233662"
                  fillOpacity={0.4}
                />
                <Radar
                  name="My colleague"
                  dataKey="B"
                  stroke="#64A550"
                  fill="#64A550"
                  fillOpacity={0.4}
                />
                <Legend
                  iconType="square"
                  verticalAlign="bottom"
                  wrapperStyle={{
                    fontSize: "10px",
                    paddingTop: "20px",
                    fontWeight: "bold",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Benchmark;
