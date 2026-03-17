const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Authentication API Test", function () {
  this.timeout(5000); // give the request some time

  it("should login existing user and return JWT token", (done) => {
    chai
      .request("http://localhost:5000")
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send({
        email: "radha@gmail.com",
        password: "radhaa" 
      })
      .end((err, res) => {
        if (err) {
          console.error("Request error:", err.message);
          return done(err);
        }

        expect(res).to.have.property("status");
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");

        done();
      });
  });
});