import { useState, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const defaultData: Record<string, number> = {
  // Europe
  "276": 85, // Germany
  "250": 78, // France
  "724": 72, // Spain
  "380": 68, // Italy
  "620": 52, // Portugal
  "191": 80, // Croatia
  "528": 75, // Netherlands
  "056": 58, // Belgium
  "040": 70, // Austria
  "616": 65, // Poland
  "752": 82, // Sweden
  "578": 88, // Norway
  "246": 76, // Finland
  "826": 74, // UK
  "372": 60, // Ireland
  "203": 66, // Czech Republic
  "642": 55, // Romania
  "300": 62, // Greece
  "100": 50, // Bulgaria
  "208": 70, // Denmark
  // World
  "840": 71, // USA
  "124": 79, // Canada
  "076": 58, // Brazil
  "032": 54, // Argentina
  "392": 83, // Japan
  "410": 77, // South Korea
  "156": 45, // China
  "356": 42, // India
  "036": 73, // Australia
  "554": 80, // New Zealand
  "710": 48, // South Africa
  "818": 40, // Egypt
  "504": 53, // Morocco
  "404": 38, // Kenya
};

const nameOverrides: Record<string, string> = {
  "840": "United States",
  "826": "United Kingdom",
  "410": "South Korea",
  "554": "New Zealand",
  "710": "South Africa",
  "203": "Czech Republic",
};

function getColor(value: number): string {
  if (value >= 80) return "hsl(145, 63%, 35%)";
  if (value >= 70) return "hsl(145, 55%, 45%)";
  if (value >= 60) return "hsl(145, 45%, 55%)";
  if (value >= 50) return "hsl(145, 35%, 65%)";
  return "hsl(145, 25%, 75%)";
}

interface WorldMapProps {
  data?: Record<string, number>;
}

export const WorldMap = memo(function WorldMap({ data = defaultData }: WorldMapProps) {
  const [hoveredGeo, setHoveredGeo] = useState<{ name: string; value: number | null } | null>(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <TooltipProvider delayDuration={0}>
        <ComposableMap
          projectionConfig={{ scale: 147, center: [10, 5] }}
          className="w-full h-full max-h-[360px]"
          style={{ background: "hsl(210, 40%, 96%)", borderRadius: 8 }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const id = geo.id as string;
                  const value = data[id] ?? null;
                  const name = nameOverrides[id] || geo.properties.name;
                  return (
                    <Tooltip key={geo.rsmKey}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          fill={value !== null ? getColor(value) : "hsl(210, 20%, 88%)"}
                          stroke="white"
                          strokeWidth={0.4}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", opacity: 0.8, cursor: "pointer" },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={() => setHoveredGeo({ name, value })}
                          onMouseLeave={() => setHoveredGeo(null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="font-semibold">{name}</span>
                        {value !== null ? `: ${value}%` : " — No data"}
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </TooltipProvider>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] text-muted-foreground">
        <span>Low</span>
        {[75, 65, 55, 45, 35].map((l, i) => (
          <div key={i} className="h-3 w-5 rounded-sm" style={{ backgroundColor: `hsl(145, ${25 + i * 10}%, ${l}%)` }} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
});
