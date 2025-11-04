import { readJson } from "./fileReader";
import { getDateWithOffset } from "./dateUtils";

const path = "../resources/session.json";
const dayMs = 1000*60*60*24;

const [data, error] = await readJson(path);
const sessions = data.sessions;

// TODO: fill date gaps in sessions
sessions.map((s) => s.date = new Date(s.date));
sessions.sort((a, b) => a.date - b.date);

const first = sessions[0].date;
const last = sessions[sessions.length - 1].date;
const days = (last - first + 1) / dayMs;

const filledSessions = [];

for (let i = 0; i < days; i++) {
    const date = getDateWithOffset(first, i);
    filledSessions.push({date});
}

console.log(filledSessions);








const app = document.querySelector("#app");
app.innerHTML = sessions[0].durationMinutes;

// Draw rectangle for each date
for (let i = 0; i < sessions.length; i++) {

}