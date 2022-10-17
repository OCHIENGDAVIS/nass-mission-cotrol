const request = require("supertest");

const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

const app = require("../../app");

describe("launches API", () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe("Test GET /launches", () => {
        test("it should respsond with 200 ok", async () => {
            await request(app).get("/launches").expect(200);
        });
    });

    describe("Test POST /lacunhes", () => {
        test("it should respond with 201 created", async () => {
            await request(app)
                .post("/launches")
                .send({
                    mission: "KE 1777",
                    rocket: "NT KENYATTA",
                    target: "Kepler-62 f",
                    launchDate: "January 4, 2028",
                })
                .expect(201);
        });

        test("it should catch missing requires properties", () => {});

        test("it shouls catch invalid dates ", () => {});
    });
});
