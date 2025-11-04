const path = "../resources/session.json";

async function readJsonFile(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("Failed to fetch file.");
        }

        return response.json();
    } catch (error) {
        return error;
    }
}

const data = await readJsonFile(path);

