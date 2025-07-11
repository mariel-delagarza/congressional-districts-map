// 🧩 Helper to create a bar row
const createBarRow = (label, value, color) => {
  const row = document.createElement("div");
  row.className = "bar-row";
  row.innerHTML = `
      <span class="label">${label}</span>
      <span class="value">${value.toFixed(1)}%</span>
      <div class="bar-container">
        <div class="bar" style="background-color: ${color}; width: 0;"></div>
      </div>
    `;
  return { row, value };
};

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

  // 🧩 Helper to create a link item if a value exists
  const linkItem = (url, label, isPhone = false) =>
    url
      ? `<li>${
          isPhone
            ? `Phone: (202) 22${phone}`
            : `<a href="${url}" target="_blank">${label}</a>`
        }</li>`
      : "";

  const contactLinks = [
    linkItem(props.PHONE, "", true),
    linkItem(props.CONTACTFORMURL, "Contact Form"),
    linkItem(props.FACEBOOK_URL, "Facebook"),
    linkItem(props.TWITTER_URL, "Twitter"),
    linkItem(props.YOUTUBE_URL, "YouTube"),
    linkItem(props.INSTAGRAM_URL, "Instagram"),
  ];

  document.getElementById("district-name").textContent = `${district}`;
  document.getElementById("rep-info").innerHTML = `
    <div class="rep-header">
      <a class="rep-name" href="${
        props.WEBSITEURL
      }" target="_blank">${name} (${party})</a>
    </div>
    <div class="rep-details">
      <p>Want to let your representative know how you feel? Here's how to reach them. Links will open in a new tab:</p>
      <ul>
        ${contactLinks.join("")}
      </ul>
      <h3>Demographic Snapshot</h3>
    </div>
  `;
  const container = document.querySelector(".rep-details");

  const barData = [
    { label: "17 and Under", key: "17 and under", color: "#60a5fa" },
    { label: "65 and Over", key: "65 and over", color: "#f472b6" },
    { label: "Below Poverty", key: "Poverty Rate", color: "#38bdf8" },
    {
      label: "No High School Diploma",
      key: "Aged 25+ without HS diploma",
      color: "#6366f1",
    },
    // Add more here as needed
  ];

  barData.forEach(({ label, key, color }) => {
    const value = parseFloat(props[key]);
    if (!isNaN(value)) {
      const { row, value: percent } = createBarRow(label, value, color);
      container.appendChild(row);
      // Animate the bar after it's been added to DOM
      requestAnimationFrame(() => {
        row.querySelector(".bar").style.width = `${percent}%`;
      });
    }
  });
}
