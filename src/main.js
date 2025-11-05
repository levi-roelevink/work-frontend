import { readJson } from "./fileReader";
import { daysBetween, arrayOfDatedObjects } from "./dateUtils";

const path = "../resources/session.json";

// Read data
const [data, error] = await readJson(path);
const sessions = data.sessions;

// Prepare data for chart
sessions.map((s) => s.date = new Date(s.date));
sessions.sort((a, b) => a.date - b.date);

const first = sessions[0].date;
const last = sessions[sessions.length - 1].date;
const days = daysBetween(first, last) + 1;

// Create sessions array without date gaps
const filledSessions = arrayOfDatedObjects(first, days);

// Add duration to gapless array
for (const session of sessions) {
    const index = daysBetween(first, session.date);
    filledSessions[index].durationMinutes = session.durationMinutes;
}

// Draw chart
const app = document.querySelector("#app");
const canvas = document.getElementById("chart-canvas");
const ctx = canvas.getContext("2d");


const width = canvas.width;
const height = canvas.height;

let max = sessions.pop().durationMinutes;
for (const s of sessions) {
    if (s.durationMinutes > max) {
        max = s.durationMinutes;
    }
}

const rectWidth = width / days;

// Rectangle height should be calculated relative to the height of the canvas so that everything fits nicely
const relHeightPx = height * 0.8 / max; // The tallest rectangle will be 4/5 the height of the canvas
function rectHeight(value) {
    return relHeightPx * value;
}

// Returns x, y, widht, height
function getRectArgs(index) {
    const value = filledSessions[index].durationMinutes;
    const relHeight = rectHeight(value);
    const x = index * rectWidth;
    const y = height - relHeight;

    return { x, y, w: rectWidth, h: relHeight };
}

// Draw rectangle for each date
for (let i = 0; i < filledSessions.length; i++) {
    const { x, y, w, h } = getRectArgs(i);
    ctx.fillRect(x, y, w, h);
}