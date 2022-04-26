import request from "supertest";
import { Express } from "express-serve-static-core";
import server from "../server";
import { Server } from "http";
import { after, endsWith } from "lodash";
import { tagDto } from "src/controller/tagController";
// import { Ausbildungsgrad } from "src/enums/enums";

enum Ausbildungsgrad {
  pflicht = "pflichtschule",
  reife = "hochschulreife",
  abschluss = "hochschulabschluss",
  beruf = "berufsausbildung",
  empty = "",
}

let app: Server;

beforeAll(() => {
  app = server;
  jest.setTimeout(10000);
});

afterAll(async () => {
  await app.close();
  // await new Promise<void>((resolve) => setTimeout(() => resolve(), 5000));
});

describe("GET /api/social/berufe", () => {
  it("Fetch ausbildungsgrade, Should be 4", (done) => {
    request(app)
      .get("/api/social/berufe")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(res.body.length).toBe(4);
        done();
      });
  });
});
