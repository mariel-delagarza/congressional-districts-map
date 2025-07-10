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
    </div>
  `;
}
