export async function readJson(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error("Failed to fetch file.");
        }

        const data = await response.json();
        return [data, null];
    } catch (error) {
        console.error(error);
        return [null, error];
    }
}