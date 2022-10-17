const API_URL = "http://localhost:3001";

async function httpGetPlanets() {
    try {
        const res = await fetch(`${API_URL}/planets`);
        const planets = await res.json();
        console.log(planets);
        return planets;
    } catch (err) {
        console.log(err);
        return err.message;
    }
}

async function httpGetLaunches() {
    // Load launches, sort by flight number, and return as JSON.
    const res = await fetch(`${API_URL}/launches`);
    const launches = await res.json();
    return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
    // Submit given launch data to launch system.
    try {
        const res = await fetch(`${API_URL}/launches`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(launch),
        });
        return res;
    } catch (err) {
        return {
            ok: false,
        };
    }
}

async function httpAbortLaunch(id) {
    // Delete launch with given ID.
    try {
        const res = fetch(`${API_URL}/launches/${id}`, {
            method: "delete",
        });
        return res;
    } catch (err) {
        return { ok: false };
    }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
