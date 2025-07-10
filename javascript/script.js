import { renderSidebar } from "./renderSidebar.js";

// Create a MapLibre map instance
const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-98, 39],
  zoom: 3,
});

// Color mapping for party affiliation
// D: Democrat, R: Republican, I: Independent, "": Unknown
const partyColorMap = {
  D: "#2563eb", // blue
  R: "#dc2626", // red
  I: "#a855f7", // purple-ish for Independent
  "": "#9ca3af", // gray for unknown
};

let csvById = {}; // Store spreadsheet data by OBJECTID

map.on("load", () => {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFgq1MCT6dByjhWn0SjcnjgdHfCDGUQVylEvfy3DVlrWfbnvRS_48gEz2J8t6Z3HYaTj-tEBKO7W8G/pub?gid=1195194271&single=true&output=csv";

  Promise.all([
    // Load TopoJSON file containing congressional districts
    d3.json("data/congressional_districts_cleaned.json"),

    // Load the Google Sheets CSV data
    d3.csv(sheetURL),
  ]).then(([topology, csv]) => {
    // Convert TopoJSON to GeoJSON
    const geojson = topojson.feature(
      topology,
      topology.objects[Object.keys(topology.objects)[0]]
    );

    // Create a lookup to map CSV data by OBJECTID
    // This allows us to quickly access district properties
    csvById = Object.fromEntries(
      csv.map((d) => {
        // Step 1: Extract and clean name parts
        const prefix = d.PREFIX?.trim() || "";
        const first = d.FIRSTNAME?.trim() || "";
        const middle = d.MIDDLENAME?.trim() || "";
        const last = d.LASTNAME?.trim() || "";
        const suffix = d.SUFFIX?.trim() || "";

        // Step 2: Build a display-friendly full name
        const fullName = [prefix, first, middle, last, suffix]
          .filter((part) => part.length)
          .join(" ");

        // Step 3: Return a key-value pair for Object.fromEntries
        return [d.OBJECTID, { ...d, fullName }];
      })
    );

    // Create GeoJSON features for district labels
    const labelFeatures = csv
      .filter((d) => d.INTPTLAT && d.INTPTLON && d.STATE && d.DISTRICT)
      .map((d) => {
        const coordinates = [parseFloat(d.INTPTLON), parseFloat(d.INTPTLAT)];
        const label = `${d.STATE}-${d.DISTRICT}`;

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates,
          },
          properties: {
            OBJECTID: d.OBJECTID,
            label,
          },
        };
      });

    const labelGeoJSON = {
      type: "FeatureCollection",
      features: labelFeatures,
    };

    // Inject PARTY into GeoJSON - mapLibre can only style features based on properties directly inside each feature
    geojson.features.forEach((feature) => {
      const id = feature.properties.OBJECTID;
      const party = csvById[id]?.PARTY || "";
      feature.properties.PARTY = party;
    });

    // Add the GeoJSON source
    map.addSource("districts", {
      type: "geojson",
      data: geojson,
    });

    map.addSource("district-labels", {
      type: "geojson",
      data: labelGeoJSON,
    });

    /* --------------------- Add Layers --------------------- */

    // Add a fill layer for the districts using the color mapping
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

    // Add an outline layer for the districts
    map.addLayer({
      id: "districts-outline",
      type: "line",
      source: "districts",
      paint: {
        "line-color": "#f2f2f2", // light gray for outline
        "line-width": 0.5,
      },
    });

    // Add a layer for district labels
    map.addLayer({
      id: "district-labels-zoomed-out",
      type: "symbol",
      source: "district-labels",
      layout: {
        "text-field": ["get", "label"],
        // "text-font": ["Open Sans Bold", "Arial Unicode MS Regular"],
        "text-font": ["Roboto Regular"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          10, // at zoom 3 → 10px
          5,
          14, // at zoom 5 → 14px
          7,
          18, // at zoom 7 → 18px
        ],
        "text-anchor": "center",
        "text-allow-overlap": false, // Prevent overlap
        "text-ignore-placement": false, // Allow skipping if no space
        "symbol-placement": "point", // Place label at geometry point
        "symbol-avoid-edges": true, // Avoid placing labels near map edge
      },
      paint: {
        "text-color": "#111",
        "text-halo-color": "white",
        "text-halo-width": 0.1,
        "text-halo-blur": 0.5,
      },
    });

    /* ---------------------- Behavior ---------------------- */

    // Remove the loading overlay (in HTML) when the map is fully rendered
    map.once("idle", () => {
      const overlay = document.getElementById("loading-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
        setTimeout(() => overlay.remove(), 300);
      }
    });

    map.on("zoom", () => {
      console.log("Current zoom level:", map.getZoom());
    });

    // Click handler - when a district is clicked, update the sidebar with representative info
    map.on("click", "districts-fill", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const objectId = feature.properties.OBJECTID;
      const props = csvById[objectId];

      console.log("Clicked OBJECTID:", objectId, props); // Debugging line

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

    // Hover effect - change cursor style when hovering over districts
    map.on("mouseenter", "districts-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Reset cursor style when leaving the district layer
    map.on("mouseleave", "districts-fill", () => {
      map.getCanvas().style.cursor = "";
    });
  });
});
