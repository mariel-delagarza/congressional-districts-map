const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-98, 39],
  zoom: 3,
});

let tooltipInstance; // reference to the active Tippy tooltip

map.on("load", () => {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFgq1MCT6dByjhWn0SjcnjgdHfCDGUQVylEvfy3DVlrWfbnvRS_48gEz2J8t6Z3HYaTj-tEBKO7W8G/pub?gid=1195194271&single=true&output=csv";

  Promise.all([
    d3.json("data/congressional_districts_119.geojson"),
    d3.csv(sheetURL),
  ]).then(([geojson, csv]) => {
    // build a lookup table from OBJECTID
    const csvById = Object.fromEntries(
      csv.map((d) => {
        const prefix = d.PREFIX?.trim() || "";
        const first = d.FIRSTNAME?.trim() || "";
        const middle = d.MIDDLENAME?.trim() || "";
        const last = d.LASTNAME?.trim() || "";

        const fullName = [prefix, first, middle, last]
          .filter((part) => part.length)
          .join(" ");

        return [d.OBJECTID, { ...d, fullName }];
      })
    );

    // merge CSV data into each GeoJSON feature
    geojson.features.forEach((feature) => {
      const id = feature.properties.OBJECTID;
      if (csvById[id]) {
        feature.properties = {
          ...feature.properties,
          ...csvById[id],
        };
      }
    });

    // Wait until the source is fully loaded before replacing its data
    if (map.getSource("districts")) {
      map.getSource("districts").setData(geojson);
    } else {
      map.once("sourcedata", (e) => {
        if (e.sourceId === "districts" && map.getSource("districts")) {
          map.getSource("districts").setData(geojson);
        }
      });
    }
  });

  map.addSource("districts", {
    type: "geojson",
    data: "data/congressional_districts_119.geojson",
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

  map.on("mousemove", "districts-fill", (e) => {
    map.getCanvas().style.cursor = "pointer";

    const feature = e.features?.[0];
    if (!feature) return;

    const name = feature.properties.fullName || "Unknown";
    const district = feature.properties.NAMELSAD || "District";

    const content = `<strong>${district}</strong><br>${name}`;

    // Remove any existing tooltip
    if (tooltipInstance) tooltipInstance.destroy();

    // Virtual element at mouse position
    const virtualElement = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: e.originalEvent.clientY,
        left: e.originalEvent.clientX,
        right: e.originalEvent.clientX,
        bottom: e.originalEvent.clientY,
      }),
    };

    tooltipInstance = tippy(document.body, {
      content,
      placement: "right",
      trigger: "manual",
      hideOnClick: false,
      interactive: false,
      theme: "light-border",
      getReferenceClientRect: virtualElement.getBoundingClientRect,
    });

    tooltipInstance.show();
  });

  map.on("mouseleave", "districts-fill", () => {
    map.getCanvas().style.cursor = "";
    if (tooltipInstance) {
      tooltipInstance.destroy();
      tooltipInstance = null;
    }
  });
});
