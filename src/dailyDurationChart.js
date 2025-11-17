import { readJson } from "./fileReader";
import { daysBetween, arrayOfDatedObjects, getDateWithOffset } from "./dateUtils";

const path = "../resources/generatedSessions.json";
const daysToDisplay = 90;

// Read data
const [data, error] = await readJson(path);
let sessions = data.sessions;
// Prepare data for chart
sessions.map((s) => s.date = new Date(s.date));

/**
 *
 * @param days in the past to start the array at
 * @returns An array without date gaps that contains the session objects between a specified amount of days in the past and today {[]}.
 */
function previousXDaysSessions(days, sessions) {
    const today = new Date().setUTCHours(0, 0, 0, 0);
    const dateDaysAgo = getDateWithOffset(today, -(days - 1));

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

export function doShit() {
    const filledSessions = previousXDaysSessions(daysToDisplay, sessions);

    const totalHours = Math.round(filledSessions.reduce((sum, s) => s.durationMinutes ? sum += s.durationMinutes : sum, 0) / 60);

    // Create chart
    const header = document.getElementById("daily-chart-header");
    header.innerText = `${totalHours} hours in the previous ${daysToDisplay} days`;

    const canvas = document.getElementById("daily-chart-canvas");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const rectWidth = width / filledSessions.length;

    // Get maximum duration minutes value from sessions to use for setting the relative height of the rectangles in the chart
    const max = filledSessions.reduce((max, s) => s.durationMinutes > max ? s.durationMinutes : max, 0);

    // Rectangle height should be calculated relative to the height of the canvas so that everything fits nicely
    const relHeightPx = height * 0.8 / max; // The tallest rectangle will be 4/5 the height of the canvas
    function rectHeight(value) {
        return relHeightPx * value;
    }

    /**
     *
     * @param index of session in session array
     * @returns {{x: number, y: number, w: number, h: *}}, x and y positions to draw at, width and height to use for drawing the rectangle.
     */
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
}