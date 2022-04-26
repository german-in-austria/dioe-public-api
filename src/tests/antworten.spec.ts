import request from "supertest";
import { Express } from "express-serve-static-core";
import server from "../server";
import { Server } from "http";
import { after, endsWith } from "lodash";
import { tagDto } from "src/controller/tagController";
import { filters } from "src/service/validate";
import { antwortenDto } from "src/controller/antwortenController";
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

describe("POST /api/antworten/tags", () => {
  it("Fetch antworten Audiotags without any filters, Should be more than 1", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
    } as antwortenDto;
    request(app)
      .post("/api/antworten/tags")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const body = res.body;
        expect(body.length).toBeGreaterThanOrEqual(34);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data[0].tagName).toBe("Standarddeutsch Entsprechung");
        done();
      });
  });

  it("Fetch antworten Audiotags with Age filter, Get only tags where Age < 35", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
      ageLower: 18,
      ageUpper: 35,
    } as antwortenDto;
    request(app)
      .post("/api/antworten/tags")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const body = res.body;
        body.forEach((el: any) => {
          const str: string = el.gruppeBez;
          expect(str.includes("18")).toBeTruthy;
          expect(str.includes("35")).toBeTruthy;
        });
        expect(body.length).toBeGreaterThanOrEqual(24);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data[0].tagName).toBe("Standarddeutsch Entsprechung");
        done();
      });
  });

  it("Fetch antworten Audiotags with Age filter, Get only tags where Age > 60", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
      ageLower: 60,
    } as antwortenDto;
    request(app)
      .post("/api/antworten/tags")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const body = res.body;
        body.forEach((el: any) => {
          const str: string = el.gruppeBez;
          expect(str.includes("Alt (65+)")).toBeTruthy;
        });
        expect(body.length).toBeGreaterThanOrEqual(10);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data[0].tagName).toBe("Standarddeutsch Entsprechung");
        done();
      });
  });

  it("Fetch antworten Audiotags with Ausbildungsfilter, Get only tags where Ausbildung = pflicht", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
      ausbildung: Ausbildungsgrade.pflicht,
    } as antwortenDto;
    request(app)
      .post("/api/antworten/tags")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const body = res.body;
        expect(body.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data[0].tagName).toBe("Standarddeutsch Entsprechung");
        done();
      });
  });

  it("Fetch antworten Audiotags with Genderfilter, Get only male", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
      weiblich: false,
    } as antwortenDto;
    request(app)
      .post("/api/antworten/tags")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const body = res.body;
        body.forEach((el: any) => {
          const str: string = el.audiofile;
          expect(str.includes("_f_INT")).toBeTruthy;
          expect(str.includes("_m_INT")).toBeFalsy;
        });
        expect(body.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data[0].tagName).toBe("Standarddeutsch Entsprechung");
        done();
      });
  });

  it("Fetch antworten Audiotags with all filters, Get only females, with job 11, pflicht ausbildung and age > 50", (done) => {
    const filters: antwortenDto = {
      ids: [4],
      osmId: 109524,
      weiblich: true,
      beruf_id: 11,
      ausbildung: Ausbildungsgrade.beruf,
      ageUpper: 50,
    } as antwortenDto;
    request(app)
      .post("/api/antworten/tags")
      .send(filters)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const body = res.body;
        body.forEach((el: any) => {
          const str: string = el.audiofile;
          const age: string = el.gruppeBez;

          expect(str.includes("_f_INT")).toBeTruthy;
          expect(str.includes("_f_INT")).toBeFalsy;

          expect(age.includes("65")).toBeFalsy;
          expect(str.includes("35")).toBeTruthy;
        });
        expect(body.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data.length).toBeGreaterThanOrEqual(1);
        expect(body[0].data[0].tagName).toBe("Standarddeutsch Entsprechung");
        done();
      });
  });
});
