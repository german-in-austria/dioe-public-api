import request from "supertest";
import { Express } from "express-serve-static-core";
import server from "../server";
import { Server } from "http";
import { after, endsWith } from "lodash";
import { tagDto } from "src/controller/tagController";

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

describe("GET /api/tags/ort", () => {
  it("Fetch Single Tag using multiple endpoint, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [3],
      erhArt: [-1],
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
        expect(first.numTag).toBe("419");
        done();
      });
  });

  it("Fetch Single Tag using multiple endpoint with ErhebungsArt, Get results", (done) => {
    const tagBody: tagDto = {
      ids: [3],
      erhArt: [1],
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
        console.log(first);
        expect(first.numTag).toBe("30");
        done();
      });
  });
});
