
/*-----------------------------About content-------------------------------*/

//history
async function loadAboutHistory() {
  try {
    const res = await fetch("https://us-central1-olfatimachurch-b8123.cloudfunctions.net/api/about/about_history");
    const about_history = await res.json();

    const history_content = document.getElementById("history-content");

    history_content.innerHTML = `<h2>${about_history.title}</h2><br>
      ${about_history.content.map(para => `<p>${para}</p>`).join("")}`;
  } catch (err) {
    console.error("Error loading About History:", err);
  }
}

loadAboutHistory();

//mass-timings
let about_timings = {
  "title": "Mass Schedule",
  "table_th": ['Day', 'Time', 'Details'],
  "content": [
    ['Weekdays', '7:00 AM', 'English'],
    ['', '7:00 PM', 'English'],
    ['Sundays', '8:00 AM', 'Marathi'],
    ['', '9:00 AM', 'English'],
    ['', '5:00 PM', 'English'],
    ['Special Masses', '2nd Sunday, 11:00 AM', 'Tamil'],
    ['', '1st & 3rd Saturday, 7:00 PM', 'Konkani'],
  ],
};

const timings_content = document.getElementById("mass");

timings_content.innerHTML = `<h2>${about_timings.title}</h2><br>
        <table class="mass-schedule-table">
          <tbody>
            <tr>
            ${about_timings.table_th.map(head => `<th>${head}</th>`).join("")}
            </tr>
            ${about_timings.content.map(body => `<tr>${body.map(val => `<td>${val}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>`;
