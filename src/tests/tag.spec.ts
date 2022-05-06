import request from "supertest";
import { Express } from "express-serve-static-core";
import server from "../server";
import { Server } from "http";
import { after, endsWith } from "lodash";
import { tagDto } from "src/controller/tagController";
enum Ausbildungsgrade {
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

describe("GET /api/tags", () => {
  it("Fetch TagTree and return current tree, Should be 99", (done) => {
    request(app)
      .get("/api/tags")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(first.tagGene).toBe(0);
        expect(first).toHaveProperty("children");
        expect(first).toHaveProperty("tagAbbrev");
        expect(res.body.length).toBe(99);
        done();
      });
  });
});

describe("GET /api/tags/ort/{tagId}", () => {
  it("Fetch Tag using single endpoint, Get same results as multiple endpoint", (done) => {
    const id = 3;
    request(app)
      .get(`/api/tags/ort/${id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThan(1);
        expect(+first.numTag).toBeGreaterThanOrEqual(458);
        done();
      });
  });
});

describe("POST /api/tags/ort", () => {
  it("Fetch Single Tag using multiple endpoint, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [3],
    } as tagDto;
    request(app)
      .post("/api/tags/ort")
      .send(tagBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThan(1);
        expect(+first.numTag).toBeGreaterThanOrEqual(458);
        done();
      });
  });

  it("Fetch Single Tag using multiple endpoint with ErhebungsArt, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [4],
      erhArt: [1],
      ausbildung: Ausbildungsgrade.pflicht,
      beruf_id: 16,
      weiblich: true,
    } as tagDto;
    request(app)
      .post("/api/tags/ort")
      .send(tagBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(+first.numTag).toBeGreaterThanOrEqual(122);
        expect(first.tagName).toBe("SDent");
        expect(first.tagId).toBe(4);
        done();
      });
  });

  it("Fetch Single Tag using multiple endpoint with non existent erhArt, Should be treated as -1", (done) => {
    const tagBody: tagDto = {
      ids: [3],
      erhArt: [35],
    } as tagDto;
    request(app)
      .post("/api/tags/ort")
      .send(tagBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThan(1);
        expect(Number(first.numTag)).toBeGreaterThanOrEqual(458);
        done();
      });
  });

  it("Fetch Single Tag using multiple endpoint with all filters enabled, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [4],
      erhArt: [1],
      ausbildung: Ausbildungsgrade.pflicht,
      beruf_id: 16,
      weiblich: true,
      project: 2,
    } as tagDto;
    request(app)
      .post("/api/tags/ort")
      .send(tagBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(+first.numTag).toBeGreaterThanOrEqual(122);
        expect(first.tagName).toBe("SDent");
        expect(first.tagId).toBe(4);
        done();
      });
  });

  it("Fetch Single Tag using multiple endpoint with all filters besides project, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [4],
      erhArt: [1],
      ausbildung: Ausbildungsgrade.pflicht,
      beruf_id: 16,
      weiblich: true,
      project: -1,
    } as tagDto;
    request(app)
      .post("/api/tags/ort")
      .send(tagBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(+first.numTag).toBeGreaterThanOrEqual(122);
        expect(first.tagName).toBe("SDent");
        expect(first.tagId).toBe(4);
        done();
      });
  });

  it("Fetch Single Tag using multiple endpoint with taggroup filter disabled, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [4],
      erhArt: [-1],
      group: false,
    } as tagDto;
    request(app)
      .post("/api/tags/ort")
      .send(tagBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(+first.numTag).toBeGreaterThanOrEqual(122);
        expect(first.tagName).toBe("SDent");
        expect(first.tagId).toBe(4);
        done();
      });
  });

  it("Fetch Single Tag using multiple endpoint with taggroup filter enabled, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [5, 4, 11],
      erhArt: [-1],
      group: true,
    } as tagDto;
    request(app)
      .post("/api/tags/ort")
      .send(tagBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        const first = res.body[0];
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(+first.numTag).toBeGreaterThanOrEqual(122);
        expect(first.tagName).toBe("Suff");
        expect(first.tagId).toBe(11);
        res.body.forEach((el: any) => {
          expect([5, 4, 11]).toContain(el.tagId);
        });
        done();
      });
  });
});
