import { renderSidebar } from "./renderSidebar.js";

const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-98, 39],
  zoom: 3,
});

map.on("load", () => {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFgq1MCT6dByjhWn0SjcnjgdHfCDGUQVylEvfy3DVlrWfbnvRS_48gEz2J8t6Z3HYaTj-tEBKO7W8G/pub?gid=1195194271&single=true&output=csv";

  Promise.all([
    d3.json("data/congressional_districts_cleaned.geojson"),
    d3.csv(sheetURL),
  ]).then(([geojson, csv]) => {
    // Build CSV lookup
    const csvById = Object.fromEntries(
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

    // Enrich GeoJSON with sheet data
    geojson.features.forEach((feature) => {
      const id = feature.properties.OBJECTID;
      if (csvById[id]) {
        feature.properties = {
          ...feature.properties,
          ...csvById[id],
        };
      }
    });

    // Add source and data
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

    // Click handler to update sidebar
    map.on("click", "districts-fill", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      console.log("Clicked feature:", feature);
      const props = feature.properties;
      renderSidebar(props);
    });

    map.on("mouseenter", "districts-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "districts-fill", () => {
      map.getCanvas().style.cursor = "";
    });
  });
});
