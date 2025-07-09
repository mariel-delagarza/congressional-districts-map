const fs = require('fs');

// Load your original GeoJSON
const raw = JSON.parse(fs.readFileSync('data/congressional_districts_119.geojson'));

// Step 1: Remove any features with CD119FP === 'ZZ'
raw.features = raw.features.filter(
  (feature) => feature.properties.CD119FP !== 'ZZ'
);

// Step 2: Strip all other properties except OBJECTID and CD119FP
raw.features.forEach((feature) => {
  const { OBJECTID, CD119FP } = feature.properties;
  feature.properties = { OBJECTID, CD119FP };
});

// Step 3: Save cleaned GeoJSON
fs.writeFileSync(
  'congressional_districts_cleaned.geojson',
  JSON.stringify(raw)
);

console.log('✅ Cleaned GeoJSON saved as congressional_districts_cleaned.geojson');
