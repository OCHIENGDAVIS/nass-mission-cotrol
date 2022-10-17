const axios = require("axios");

const launchesModel = require("./launches.mongo");
const planets = require("./planets.mongo");

let DEFAULT_FLFIGHT_NUMBER = 100;
const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function getAllLaunches(skip, limit) {
    return await launchesModel
        .find({}, { __v: 0, _id: 0 })
        .skip(skip)
        .limit(limit);
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error("No matching planet was found");
    }
    let newFlightNumber = await getLatestFlightNumber();
    const newLaunch = { ...launch, flightNumber: newFlightNumber++ };
    return await saveLauch(newLaunch);
}

async function existLaunchWithId(id) {
    return await findLaunch({ flightNumber: id });
}

async function abortLaunchByid(id) {
    const aborted = await findLaunch({ flightNumber: id });
    if (!aborted) {
        throw new Error("Launch with Id does not exist");
    }
    aborted.upcomming = false;
    aborted.sucess = false;
    return aborted;
}

async function loadLaunchesData() {
    const res = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });
    if (res) {
        console.log("data already loaded!");
        return;
    }
    console.log("Loading data from the space X API");
    const response = await axios.post(SPACE_X_API_URL, {
        query: {},
        pagination: false,
        options: {
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1,
                    },
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    });
    if (!response.status === 200) {
        console.log("problem loading data");
        throw new Error("Launcg data download failed ");
    }
    const launchDocs = response.data.docs;
    for (let launchDoc of launchDocs) {
        const payloads = launchDoc["payloads"];
        const customers = payloads.flatMap((payload) => {
            return payload["customers"];
        });
        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            customers,
        };
        await saveLauch(launch);
    }
}

async function findLaunch(filter) {
    return await launchesModel.findOne(filter);
}

async function saveLauch(launch) {
    await launchesModel.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        },
        launch,
        { upsert: true }
    );
}
async function getLatestFlightNumber() {
    const latestLaunch = await launchesModel.findOne().sort("-flightNumber");
    if (!latestLaunch) {
        return DEFAULT_FLFIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

module.exports = {
    getAllLaunches,
    existLaunchWithId,
    abortLaunchByid,
    scheduleNewLaunch,
    loadLaunchesData,
};
