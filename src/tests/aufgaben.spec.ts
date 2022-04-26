import request from "supertest";
import server from "../server";
import { Server } from "http";
import { after, endsWith } from "lodash";
import { tagDto } from "src/controller/tagController";
import { filters } from "src/service/validate";
import { antwortenDto } from "src/controller/antwortenController";
import { ausbildungGrad } from "src/service/social";
import { Ausbildungsgrade } from "src/enums/enums";

let app: Server;

beforeAll(() => {
  app = server;
  jest.setTimeout(15000);
});

afterAll(async () => {
  await app.close();
  // await new Promise<void>((resolve) => setTimeout(() => resolve(), 5000));
});

describe("POST /api/aufgaben/audio", () => {
  it("Fetch antworten aufgaben Audio without any filters, Should be more than 1", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
    } as antwortenDto;
    request(app)
      .post("/api/aufgaben/audio")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });
});
