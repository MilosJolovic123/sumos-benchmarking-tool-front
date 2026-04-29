interface EuropeMapProps {
  data?: Record<string, number>;
}

const countries: { id: string; name: string; d: string }[] = [
  { id: "DE", name: "Germany", d: "M95,55 L100,48 L108,50 L112,55 L110,62 L108,68 L102,70 L96,65 L93,60 Z" },
  { id: "FR", name: "France", d: "M72,62 L80,58 L88,60 L96,65 L94,74 L88,80 L78,82 L70,76 L68,68 Z" },
  { id: "ES", name: "Spain", d: "M55,82 L65,78 L78,82 L80,90 L75,98 L62,100 L52,96 L50,88 Z" },
  { id: "IT", name: "Italy", d: "M100,72 L106,70 L112,78 L115,88 L112,96 L108,100 L104,96 L102,88 L98,80 Z" },
  { id: "PT", name: "Portugal", d: "M48,84 L55,82 L52,96 L46,94 L44,88 Z" },
  { id: "HR", name: "Croatia", d: "M112,65 L118,62 L122,66 L120,72 L114,74 L110,70 Z" },
  { id: "NL", name: "Netherlands", d: "M90,46 L96,44 L98,48 L96,52 L90,50 Z" },
  { id: "BE", name: "Belgium", d: "M84,50 L90,48 L92,54 L88,56 L84,54 Z" },
  { id: "AT", name: "Austria", d: "M104,58 L112,55 L118,58 L116,64 L110,65 L104,62 Z" },
  { id: "PL", name: "Poland", d: "M112,42 L124,38 L132,42 L130,52 L122,55 L114,52 Z" },
  { id: "SE", name: "Sweden", d: "M108,15 L114,10 L118,18 L116,32 L112,38 L106,35 L104,25 Z" },
  { id: "NO", name: "Norway", d: "M96,8 L104,5 L108,15 L104,25 L98,28 L92,22 L94,14 Z" },
  { id: "FI", name: "Finland", d: "M122,8 L130,5 L135,12 L132,25 L126,30 L120,22 L118,14 Z" },
  { id: "GB", name: "United Kingdom", d: "M68,35 L76,32 L80,38 L78,48 L72,50 L66,46 L64,40 Z" },
  { id: "IE", name: "Ireland", d: "M56,38 L64,36 L66,44 L62,48 L56,46 L54,42 Z" },
  { id: "CZ", name: "Czech Republic", d: "M104,52 L112,50 L116,54 L112,58 L106,56 Z" },
  { id: "RO", name: "Romania", d: "M126,58 L136,55 L142,60 L140,68 L132,70 L126,66 Z" },
  { id: "GR", name: "Greece", d: "M122,82 L130,78 L136,82 L134,92 L128,96 L122,92 L120,86 Z" },
  { id: "BG", name: "Bulgaria", d: "M132,70 L140,68 L144,74 L140,78 L134,80 L130,76 Z" },
  { id: "DK", name: "Denmark", d: "M96,38 L102,36 L104,40 L100,44 L96,42 Z" },
];

const defaultData: Record<string, number> = {
  DE: 85, FR: 78, ES: 72, IT: 68, PT: 52, HR: 80, NL: 75, BE: 58,
  AT: 70, PL: 65, SE: 82, NO: 88, FI: 76, GB: 74, IE: 60, CZ: 66,
  RO: 55, GR: 62, BG: 50, DK: 70,
};

function getColor(value: number): string {
  if (value >= 80) return "hsl(145, 63%, 35%)";
  if (value >= 70) return "hsl(145, 55%, 45%)";
  if (value >= 60) return "hsl(145, 45%, 55%)";
  if (value >= 50) return "hsl(145, 35%, 65%)";
  return "hsl(145, 25%, 75%)";
}

export function EuropeMap({ data = defaultData }: EuropeMapProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="30 0 130 110" className="w-full h-full max-h-[360px]">
        {/* Water background */}
        <rect x="30" y="0" width="130" height="110" fill="hsl(210, 40%, 96%)" rx="4" />
        
        {countries.map(country => {
          const value = data[country.id] || 50;
          return (
            <g key={country.id}>
              <path
                d={country.d}
                fill={getColor(value)}
                stroke="white"
                strokeWidth="0.5"
                className="transition-colors hover:opacity-80 cursor-pointer"
              >
                <title>{country.name}: {value}%</title>
              </path>
            </g>
          );
        })}
      </svg>
      
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
}