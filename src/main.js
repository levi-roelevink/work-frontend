import { readJson } from "./fileReader";
import { getDateWithOffset, daysBetween } from "./dateUtils";

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

const filledSessions = [];

// Create sessions array without date gaps
for (let i = 0; i < days; i++) {
    const date = getDateWithOffset(first, i);
    filledSessions.push({ date });
}

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
const relHeightPx = height * 0.75 / max;
function rectHeight(value) {
    return relHeightPx * value;
}

// TODO: rectangle height should be calculated relative to the height of the canvas so that everything fits nicely
// The maximum tallest rectangle should be up to about 3/4 of the canvas

// Returns x, y, widht, height
function getRectArgs(index) {
    const value = filledSessions[index].durationMinutes;
    const x = index * rectWidth;
    const y = height - value;

    // Left off here trying to figure out how to make the height relative so all rectangles are fully visible and some space is left up top
    const relHeight = rectHeight(value);
    console.log(value, relHeight);

    return {x, y, w: rectWidth, h: value};
}

// Draw rectangle for each date
for (let i = 0; i < filledSessions.length; i++) {
    const {x, y, w, h} = getRectArgs(i);
    ctx.fillRect(x, y, w, h);
}