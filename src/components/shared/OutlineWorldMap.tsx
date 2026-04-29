import { memo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Minimalist outline-only world map. Country shapes are thin gray strokes
 * on a transparent background — used on the landing page Green awareness section.
 */
function OutlineWorldMapComponent() {
  return (
    <div className="w-full h-full">
      <ComposableMap
        projectionConfig={{ scale: 155 }}
        width={980}
        height={500}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "transparent",
                    stroke: "hsl(220, 15%, 70%)",
                    strokeWidth: 0.4,
                    outline: "none",
                  },
                  hover: {
                    fill: "transparent",
                    stroke: "hsl(220, 15%, 70%)",
                    strokeWidth: 0.4,
                    outline: "none",
                  },
                  pressed: {
                    fill: "transparent",
                    stroke: "hsl(220, 15%, 70%)",
                    strokeWidth: 0.4,
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export const OutlineWorldMap = memo(OutlineWorldMapComponent);
