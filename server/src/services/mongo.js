const mongoose = require("mongoose");

MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
    console.log("Mongo db connection ready");
});
mongoose.connection.on("error", (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};
