const http = require("http");

require("dotenv").config();

const { mongoConnect } = require("./services/mongo");
const { loadLaunchesData } = require("./models/launches.model");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 3001;

async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    const server = http.createServer(app);
    server.listen(process.env.PORT, () =>
        console.log(`Server running on port: ${PORT}`)
    );
}

startServer();
