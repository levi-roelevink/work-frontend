import { readJson } from "./fileReader";

const path = "../resources/session.json";

const [data, error] = await readJson(path);
const sessions = data.sessions;

const app = document.querySelector("#app");
app.innerHTML = sessions[0].durationMinutes;