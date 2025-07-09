export function renderSidebar(props) {
  const name = props.fullName || "Unknown";
  const party = props.PARTY || "—";

  const phone = props.PHONE
    ? `${props.PHONE.slice(0, 1)}-${props.PHONE.slice(1)}`
    : "—";

  // const district = props.NAMELSAD || `District ${props.CD119FP}`;
  const district = props.STATE + "-" + props.DISTRICT;

  document.getElementById("district-name").textContent =
    "District: " + district;
  document.getElementById("rep-info").innerHTML = `
    <div class="rep-header">
      <a class="rep-name" href=${props.WEBSITEURL} target="_blank">${name} (${party})</a>
    </div>
    <div class="rep-details">
      <p>Want to let your representative know how you feel? Here's how to reach them. Links will open in a new tab:</p>
      <ul>
        <li>Phone: (202) 22${phone}</li>
        <li><a href=${props.CONTACTFORMURL} target="_blank">Contact Form</a></li>

      </ul>
    </div>
  `;
}
