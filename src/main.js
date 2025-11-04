import { readJson } from "./fileReader";
import { getDateWithOffset, daysBetween } from "./dateUtils";

const path = "../resources/session.json";

const [data, error] = await readJson(path);
const sessions = data.sessions;

// TODO: fill date gaps in sessions
sessions.map((s) => s.date = new Date(s.date));
sessions.sort((a, b) => a.date - b.date);

const first = sessions[0].date;
const last = sessions[sessions.length - 1].date;
const days = daysBetween(first, last);

const filledSessions = [];

// Create sessions array without date gaps
for (let i = 0; i <= days; i++) {
    const date = getDateWithOffset(first, i);
    filledSessions.push({date});
}

// Add duration to gapless array
for (const session of sessions) {
    const index = daysBetween(first, session.date);
    filledSessions[index].durationMinutes = session.durationMinutes;
}




const app = document.querySelector("#app");
app.innerHTML = sessions[0].durationMinutes;

// Draw rectangle for each date
for (let i = 0; i < sessions.length; i++) {

}