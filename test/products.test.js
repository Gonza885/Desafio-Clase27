import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker/locale/es";

const requester = supertest("http://0.0.0.0:8080/api/products");
const expect = chai.expect;

describe("Testing Products module", () => {
  it("Get products", async () => {
    const { statusCode } = await requester.get("/");
    expect(statusCode).to.equal(200);
  });

  it("Get product by ID", async () => {
    const pid = faker.database.mongodbObjectId();
    const { statusCode } = await requester.get(`/${pid}`);
    expect(statusCode).to.equal(404);
  });
});
