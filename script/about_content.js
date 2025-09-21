
/*-----------------------------About content-------------------------------*/

//history
let about_history = {
    "title": "History",
    "content": [
        "<b>Majiwada</b> is a village situated on Old Agra Road (Off. Ghodbunder Road) and is about 5kms away from Thane Railway Station.",
        "Our Lady of Fatima Church is more than 60 years old. It was built in the year 1954 on 6th June (as per the marble slab placed at the entrance of our Church) by His Eminence Valerian Cardinal Gracias, Archbishop of Bombay. It was then a small Chapel with most of the faithful being the local East Indian community. The Eucharist was celebrated by a Priest from St. John the Baptist Thane, since this Majiwada Chapel was one of its many units. But over a period of time, the village and its surrounding areas started developing and the number of the faithful in the area also started growing gradually. We are happy to learn that Our Lady of Fatima Church celebrated its Silver Jubilee in June, 1979.",
        "Majiwada-Gaon is no longer a village and it was approaching the status of a city. This was the time when the Majiwada Chapel was demerged from St. John the Baptist Church and became an independent Registered Trust in 1992. Today, we have a rebuilt, full-fledged Church blessed on 10th April, 2005. This Church has two mass centres, one at Manpada, Our Lady of Vailankani Chapel, situated along the Ghodbunder Road about 4 kms away from Majiwada which was inaugurated / blessed on 15th October, 1982. The second one at Dhokali, situated along the Kolshet Road, known as Seva Sadan, Convent of Helpers of Mary Sisters.",
        "We Parishioners feel proud to have Our Lady of Fatima Church, a complete Parish, with nearly 1000 families registered, 24 Small Christian Communities and Associations/Cells catering to the needs of our Parishioners.",
        "<b>(Fr. G. H. D'souza)</b><br>Priest-in-Charge",
    ],
};

const history_content = document.getElementById("history-content");

history_content.innerHTML = `<h2>${about_history.title}</h2><br>
                ${about_history.content.map(para => `<p>${para}</p>`).join("")}`;

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
