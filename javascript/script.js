import { renderSidebar } from "./renderSidebar.js";

const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-98, 39],
  zoom: 3,
});

const partyColorMap = {
  D: "#2563eb", // blue-600
  R: "#dc2626", // red-600
  I: "#a855f7", // purple-ish for Independent
  "": "#9ca3af", // gray for unknown
};

let csvById = {}; // Store spreadsheet data by OBJECTID

map.on("load", () => {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFgq1MCT6dByjhWn0SjcnjgdHfCDGUQVylEvfy3DVlrWfbnvRS_48gEz2J8t6Z3HYaTj-tEBKO7W8G/pub?gid=1195194271&single=true&output=csv";

  Promise.all([
    d3.json("data/congressional_districts_cleaned.json"),
    d3.csv(sheetURL),
  ]).then(([topology, csv]) => {
    console.time("TopoJSON conversion");
    const geojson = topojson.feature(
      topology,
      topology.objects[Object.keys(topology.objects)[0]]
    );
    console.timeEnd("TopoJSON conversion");

    // Store the spreadsheet data in memory
    csvById = Object.fromEntries(
      csv.map((d) => {
        const prefix = d.PREFIX?.trim() || "";
        const first = d.FIRSTNAME?.trim() || "";
        const middle = d.MIDDLENAME?.trim() || "";
        const last = d.LASTNAME?.trim() || "";
        const suffix = d.SUFFIX?.trim() || "";

        const fullName = [prefix, first, middle, last, suffix]
          .filter((part) => part.length)
          .join(" ");

        return [d.OBJECTID, { ...d, fullName }];
      })
    );

    // ✅ Now that csvById is built, inject PARTY into GeoJSON
    geojson.features.forEach((feature) => {
      const id = feature.properties.OBJECTID;
      const party = csvById[id]?.PARTY || "";
      feature.properties.PARTY = party;
    });
    
    // Add the GeoJSON source
    console.time("Add source");
    map.addSource("districts", {
      type: "geojson",
      data: geojson,
    });
    console.timeEnd("Add source");

    // Add layers
    map.addLayer({
      id: "districts-fill",
      type: "fill",
      source: "districts",
      paint: {
        "fill-color": [
          "match",
          ["get", "PARTY"],
          "D",
          partyColorMap.D,
          "R",
          partyColorMap.R,
          "I",
          partyColorMap.I,
          partyColorMap[""], // fallback
        ],
        "fill-opacity": 0.5,
      },
    });

    map.addLayer({
      id: "districts-outline",
      type: "line",
      source: "districts",
      paint: {
        "line-color": "#1d4ed8",
        "line-width": 1,
      },
    });

    // Remove the loading overlay when the map is fully rendered
    map.once("idle", () => {
      console.log("Map fully rendered");
      const overlay = document.getElementById("loading-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
        setTimeout(() => overlay.remove(), 300);
      }
    });

    // Click handler
    map.on("click", "districts-fill", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const objectId = feature.properties.OBJECTID;
      const props = csvById[objectId];

      console.log("Clicked OBJECTID:", objectId, props);

      if (props) {
        renderSidebar(props);
      } else {
        renderSidebar({
          fullName: "Unknown",
          PARTY: "—",
          VOTE: "—",
          IMPACT: "—",
          NAMELSAD: `District ${objectId}`,
        });
      }
    });

    map.on("mouseenter", "districts-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "districts-fill", () => {
      map.getCanvas().style.cursor = "";
    });
  });
});
