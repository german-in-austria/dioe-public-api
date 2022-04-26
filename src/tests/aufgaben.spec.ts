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
        const body = res.body;

        /*
        body.forEach((el: any) => {
          
        });*/
        console.log(body);
        expect(body.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        done();
      });
  });

  it("Fetch antworten aufgaben Audio with upper age filter, Should be more than 1", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
      ageUpper: 50,
    } as antwortenDto;
    request(app)
      .post("/api/aufgaben/audio")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;

        body.forEach((el: any) => {
          const file = el.audiofile;
          const grp = el.gruppeBez;
          expect(grp.includes("jung")).toBeTruthy;
          expect(grp.includes("65")).toBeFalsy;
        });
        expect(body.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        done();
      });
  });

  it("Fetch antworten aufgaben Audio with lower age filter, Should be more than 1", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
      ageLower: 60,
    } as antwortenDto;
    request(app)
      .post("/api/aufgaben/audio")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const body = res.body;

        body.forEach((el: any) => {
          const file = el.audiofile;
          const grp = el.gruppeBez;
          expect(grp.includes("jung")).toBeFalsy;
          expect(grp.includes("65")).toBeTruthy;
        });
        expect(body.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        done();
      });
  });
});
