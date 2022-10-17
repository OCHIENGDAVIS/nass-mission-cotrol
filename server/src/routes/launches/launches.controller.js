const {
    getAllLaunches,
    scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchByid,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    console.log(launch);
    launch.launchDate = new Date(launch.launchDate);
    const newLaunch = await scheduleNewLaunch(launch);
    return res.status(201).json(newLaunch);
}

function httpAbortLaunch(req, res) {
    let { id } = req.params;
    id = Number(id);
    if (!existLaunchWithId(id)) {
        return res
            .status(404)
            .json({ error: `Launch with id ${id} not found` });
    }
    const aborted = abortLaunchByid(id);
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};
