import {readJson} from "./fileReader";
import {daysBetween, arrayOfDatedObjects, getDateWithOffset} from "./dateUtils";

const path = "../resources/generatedSessions.json";
const daysToDisplay = 90;

// Read data
const [data, error] = await readJson(path);
let sessions = data.sessions;

// Prepare data for chart
sessions.map((s) => s.date = new Date(s.date));
sessions.sort((a, b) => a.date - b.date);

/**
 *
 * @param days in the past to start the array at
 * @returns An array without date gaps that contains the session objects between a specified amount of days in the past and today {[]}
 */
function previousXDaysSessions(days) {
    const today = new Date().setUTCHours(0, 0, 0, 0);
    const dateDaysAgo = getDateWithOffset(today, - (days - 1));

    // Create sessions array without date gaps
    const filledSessions = arrayOfDatedObjects(dateDaysAgo, days);

    // Map Session objects to correct date in array without date gaps
    for (let i = 0; i < sessions.length; i++) {
        const date = sessions[i].date;

        if (date.getTime() >= dateDaysAgo.getTime()) {
            const days = daysBetween(dateDaysAgo, date);
            filledSessions[days] = sessions[i];
        }
    }

    return filledSessions;
}

const filledSessions = previousXDaysSessions(daysToDisplay);

// Draw chart
const app = document.querySelector("#app");
const canvas = document.getElementById("chart-canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

let max = filledSessions.pop().durationMinutes;
for (const s of filledSessions) {
    if (s.durationMinutes > max) {
        max = s.durationMinutes;
    }
}

const rectWidth = width / filledSessions.length;

// Rectangle height should be calculated relative to the height of the canvas so that everything fits nicely
const relHeightPx = height * 0.8 / max; // The tallest rectangle will be 4/5 the height of the canvas
function rectHeight(value) {
    return relHeightPx * value;
}

// Returns x, y, width, height
function getRectArgs(index) {
    const value = filledSessions[index].durationMinutes;
    const relHeight = rectHeight(value);
    const x = index * rectWidth;
    const y = height - relHeight;

    return {x, y, w: rectWidth, h: relHeight};
}

// Draw rectangle for each date
for (let i = 0; i < filledSessions.length; i++) {
    const {x, y, w, h} = getRectArgs(i);
    ctx.fillRect(x, y, w, h);
}