import { renderSidebar } from "./renderSidebar.js";

const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-98, 39],
  zoom: 3,
});

let csvById = {}; // Store spreadsheet data by OBJECTID

map.on("load", () => {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFgq1MCT6dByjhWn0SjcnjgdHfCDGUQVylEvfy3DVlrWfbnvRS_48gEz2J8t6Z3HYaTj-tEBKO7W8G/pub?gid=1195194271&single=true&output=csv";

  Promise.all([
    d3.json("data/congressional_districts_cleaned.json"),
    d3.csv(sheetURL),
  ]).then(([topology, csv]) => {
    const geojson = topojson.feature(topology, topology.objects[Object.keys(topology.objects)[0]]);
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

    // Add the source and render the map immediately
    map.addSource("districts", {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: "districts-fill",
      type: "fill",
      source: "districts",
      paint: {
        "fill-color": "#1d4ed8",
        "fill-opacity": 0.3,
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

    // Click handler — now looks up props from csvById, not GeoJSON
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
