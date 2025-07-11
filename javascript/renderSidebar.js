export function renderSidebar(props) {
  const name = props.fullName || "Unknown";
  const party = props.PARTY || "—";
  const phone = props.PHONE
    ? `${props.PHONE.slice(0, 1)}-${props.PHONE.slice(1)}`
    : "—";

  const district =
    props.DISTRICT === "0"
      ? `${props.STATE_FULL}, At-Large`
      : `${props.STATE_FULL}, District ${parseInt(props.DISTRICT, 10)}`;

  document.getElementById("district-name").textContent = `${district}`;

  // Contact links
  const contactLinks = [
    props.PHONE ? `<li>Phone: (202) 22${phone}</li>` : "",
    props.CONTACTFORMURL
      ? `<li><a href="${props.CONTACTFORMURL}" target="_blank">Contact Form</a></li>`
      : "",
    props.FACEBOOK_URL
      ? `<li><a href="${props.FACEBOOK_URL}" target="_blank">Facebook</a></li>`
      : "",
    props.TWITTER_URL
      ? `<li><a href="${props.TWITTER_URL}" target="_blank">Twitter</a></li>`
      : "",
    props.YOUTUBE_URL
      ? `<li><a href="${props.YOUTUBE_URL}" target="_blank">YouTube</a></li>`
      : "",
    props.INSTAGRAM_URL
      ? `<li><a href="${props.INSTAGRAM_URL}" target="_blank">Instagram</a></li>`
      : "",
  ];
  document.getElementById("contact-links").innerHTML = contactLinks.join("");

  // Bar definitions (key = props key, id suffixes match index.html)
  const barDefs = [
    { key: "17 and under", id: "under-17", color: "#60a5fa" },
    { key: "65 and over", id: "over-65", color: "#f472b6" },
    { key: "Poverty Rate", id: "poverty", color: "#38bdf8" },
    { key: "Aged 25+ without HS diploma", id: "no-hs", color: "#6366f1" },
  ];

  barDefs.forEach(({ key, id, color }) => {
    const value = parseFloat(props[key]);
    const valueSpan = document.getElementById(`value-${id}`);
    const barDiv = document.getElementById(`bar-${id}`);

    if (!isNaN(value)) {
      valueSpan.textContent = `${value.toFixed(1)}%`;
      barDiv.style.backgroundColor = color;
      requestAnimationFrame(() => {
        barDiv.style.width = `${value}%`;
      });
    } else {
      valueSpan.textContent = "—";
      barDiv.style.width = "0%";
    }
  });

  // Rep name
  const photo = document.getElementById("rep-photo");
  const repName = document.querySelector(".rep-name");

  photo.src = props.PHOTOURL || "";
  photo.alt = `Photo of ${name}`;

  repName.href = props.WEBSITEURL || "#";
  repName.textContent = `${name} (${party})`;

  // Show the sidebar content
  document.getElementById("rep-details").style.display = "block";
  document.getElementById("rep-instructions").style.display = "none";

}
