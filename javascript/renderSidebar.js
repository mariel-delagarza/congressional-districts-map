function getIconSvg(name) {
  const icons = {
    facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.3c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6v1.9H18l-.5 3h-2.9v7A10 10 0 0022 12z"/></svg>`,
    twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.27 4.27 0 001.88-2.36c-.83.5-1.75.85-2.73 1.05a4.26 4.26 0 00-7.3 3.88A12.09 12.09 0 013 5.1a4.27 4.27 0 001.32 5.7A4.24 4.24 0 012.8 10v.05a4.26 4.26 0 003.42 4.18 4.28 4.28 0 01-1.92.07 4.27 4.27 0 003.98 2.96A8.54 8.54 0 013 19.55a12.07 12.07 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.36 8.36 0 0022.46 6z"/></svg>`,
    youtube: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M19.6 3H4.4A1.4 1.4 0 0 0 3 4.4v15.2A1.4 1.4 0 0 0 4.4 21h15.2a1.4 1.4 0 0 0 1.4-1.4V4.4A1.4 1.4 0 0 0 19.6 3zM10 15.5V8.5l6 3.5-6 3.5z"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.8 2 3 3.8 3 6v12c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4H7zm10 2c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>`,
  };
  return icons[name] || "";
}

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

  /* ------------------------ Bars ------------------------ */
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

  /* --------------------- Rep Header --------------------- */
  const photo = document.getElementById("rep-photo");
  const repName = document.querySelector(".rep-name");

  photo.src = props.PHOTOURL || "";
  photo.alt = `Photo of ${name}`;

  repName.href = props.WEBSITEURL || "#";
  repName.textContent = `${name} (${party})`;

  // Add social icons
  const socialLinks = [
    { url: props.FACE_BOOK_URL, icon: "facebook" },
    { url: props.TWITTER_URL, icon: "twitter" },
    { url: props.YOUTUBE_URL, icon: "youtube" },
    { url: props.INSTAGRAM_URL, icon: "instagram" },
  ];

  const socialContainer = document.querySelector(".rep-socials");
  socialContainer.innerHTML = ""; // Clear any existing icons

  socialLinks.forEach(({ url, icon }) => {
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = getIconSvg(icon); // we'll define this next
      socialContainer.appendChild(a);
    }
  });
  /* ---- Show sidebar details after click on district ---- */
  document.getElementById("rep-details").style.display = "block";
  document.getElementById("rep-instructions").style.display = "none";
  document.getElementById("select-district").style.display = "none";
  document.getElementById("district-name").textContent = `${district}`;
}
