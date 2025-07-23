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

  document.getElementById("total-population").textContent =
    props["Total population"] || "—";
  document.getElementById("median-income").textContent =
    "$" + props["Median Household Income"] || "—";

  document.getElementById("median-home-value").textContent =
    "$" + props["Median home value (dollars)"] || "—";
  document.getElementById("with-mortgage").textContent =
    "$" + props["Housing units with a mortgage Median (dollars)"] || "—";
  document.getElementById("without-mortgage").textContent =
    "$" + props["Housing units without a mortgage Median (dollars)"] || "—";
  document.getElementById("median-rent").textContent =
    "$" + props["Median rent (dollars)"] || "—";

  /* ------------------------ Bars ------------------------ */

  const barColor = "#60a5fa"; // Default color for bars
  const barDefs = [
    { key: "Under 18 years", id: "under-18" },
    { key: "65 and over", id: "over-65" },
    { key: "White", id: "white" },
    { key: "Black", id: "black" },
    { key: "Hispanic", id: "hispanic" },
    { key: "Indigenous (total)", id: "indigenous" },
    { key: "Asian", id: "asian" },
    { key: "Some other race", id: "some-other-race" },
    { key: "Cuban", id: "cuban" },
    { key: "Mexican", id: "mexican" },
    { key: "Puerto Rican", id: "puerto-rican" },
    { key: "Other Hispanic or Latino", id: "other-hispanic-latino" },
    { key: "American", id: "american" },
    { key: "Arab", id: "arab" },
    { key: "Czech", id: "czech" },
    { key: "Danish", id: "danish" },
    { key: "Dutch", id: "dutch" },
    { key: "English", id: "english" },
    { key: "French (except Basque)", id: "french-basque" },
    { key: "French Canadian", id: "french-canadian" },
    { key: "German", id: "german" },
    { key: "Greek", id: "greek" },
    { key: "Hungarian", id: "hungarian" },
    { key: "Irish", id: "irish" },
    { key: "Italian", id: "italian" },
    { key: "Lithuanian", id: "lithuanian" },
    { key: "Norwegian", id: "norwegian" },
    { key: "Polish", id: "polish" },
    { key: "Portuguese", id: "portuguese" },
    { key: "Russian", id: "russian" },
    { key: "Scotch-Irish", id: "scotch-irish" },
    { key: "Scottish", id: "scottish" },
    { key: "Slovak", id: "slovak" },
    { key: "Subsaharan African", id: "subsaharan-african" },
    { key: "Swedish", id: "swedish" },
    { key: "Swiss", id: "swiss" },
    { key: "Ukrainian", id: "ukrainian" },
    { key: "Welsh", id: "welsh" },
    { key: "West Indian", id: "west-indian" },
    { key: "Foreign-born", id: "foreign-born" },
    { key: "Native", id: "native" },
    { key: "Under 18 With a disability", id: "disabled-under-18" },
    { key: "18 to 64 With a disability", id: "disabled-18-64" },
    { key: "65 and over With a disability", id: "disabled-65-and-over" },
    { key: "Private wage and salary workers", id: "private-wage" },
    { key: "Government workers", id: "government-workers" },
    { key: "Self-employed", id: "self-employed" },
    { key: "Unpaid family workers", id: "unpaid-family" },
    {
      key: "Agriculture, forestry, fishing and hunting, and mining",
      id: "agriculture",
    },
    { key: "Construction", id: "construction" },
    { key: "Manufacturing", id: "manufacturing" },
    { key: "Wholesale trade", id: "wholesale-trade" },
    { key: "Retail trade", id: "retail-trade" },
    {
      key: "Transportation and warehousing, and utilities",
      id: "transportation",
    },
    { key: "Information", id: "information" },
    {
      key: "Finance and insurance, and real estate and rental and leasing",
      id: "finance",
    },
    {
      key: "Professional, scientific, and management, and administrative and waste management services",
      id: "professional-scientific",
    },
    {
      key: "Educational services, and health care and social assistance",
      id: "educational-health",
    },
    {
      key: "Arts, entertainment, and recreation, and accommodation and food services",
      id: "arts-entertainment",
    },
    {
      key: "Other services, except public administration",
      id: "other-services",
    },
    { key: "Public administration", id: "public-administration" },
    { key: "Households making under $50,000", id: "under-50k" },
    { key: "Poverty Rate", id: "poverty-rate" },
    { key: "Unemployment Rate", id: "unemployment" },
    { key: "Without health insurance", id: "without-health-insurance" },
    { key: "Under 19 without insurance", id: "under-19-without-health-insurance" },
    { key: "With private insurance", id: "with-private-insurance" },
    { key: "With public insurance coverage", id: "with-public-insurance" },
    { key: "No HS Diploma", id: "no-hs-diploma" },
    { key: "Percent high school graduate or higher", id: "hs-or-higher" },
    { key: "Percent bachelor's degree or higher", id: "bachelors-degree" }, 
  ];

  barDefs.forEach(({ key, id }) => {
    const value = parseFloat(props[key]);
    const valueSpan = document.getElementById(`value-${id}`);
    const barDiv = document.getElementById(`bar-${id}`);

    if (!isNaN(value)) {
      valueSpan.textContent = `${value.toFixed(1)}%`;
      barDiv.style.backgroundColor = barColor;
      requestAnimationFrame(() => {
        barDiv.style.width = `${value}%`;
      });
    } else {
      valueSpan.textContent = "—";
      barDiv.style.width = "0%";
    }
  });

  /* ------------------------------------------------------ */
  /*                       Rep Header                       */
  /* ------------------------------------------------------ */
  const photo = document.getElementById("rep-photo");
  const repName = document.querySelector(".rep-name");

  photo.src = props.PHOTOURL || "";
  photo.alt = `Photo of ${name}`;

  if (photo.src === "") {
    photo.style.display = "none";
  }

  repName.href = props.WEBSITEURL || "#";
  repName.textContent = `${name} (${party})`;

  /* --------------------- Contact Links ------------------- */
  // Update official links
  const website = document.getElementById("rep-website");
  const contactForm = document.getElementById("rep-contact-form");

  if (props.WEBSITEURL) {
    website.href = props.WEBSITEURL;
    website.style.display = "inline";
  } else {
    website.style.display = "none";
  }

  if (props.CONTACTFORMURL) {
    contactForm.href = props.CONTACTFORMURL;
    contactForm.style.display = "inline";
  } else {
    contactForm.style.display = "none";
  }

  /* ----------------------- Socials ---------------------- */
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
  document.getElementById("rep-instructions-desktop").style.display = "none";
  document.getElementById("rep-instructions-mobile").style.display = "none";
  document.getElementById("select-district").style.display = "none";
  document.getElementById("district-name").textContent = `${district}`;
}
