const chai = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const { expect } = chai;
const { validationUser } = require("../middlewares/protected");

describe("Protected Middleware Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: sinon.stub().returns("Bearer valid_token") };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    next = sinon.stub();
    process.env.JWT_SECRET = "test_secret";
  });

  afterEach(() => {
    sinon.restore();
  });

  // ✅ Test `validationUser` - Valid Token
  it("should authenticate user with a valid token", async () => {
    sinon.stub(jwt, "verify").returns({ userId: "12345", role: "user" });

    await validationUser(req, res, next);

    expect(req.user.userId).to.equal("12345");
    expect(next.calledOnce).to.be.true;
  });

  // ✅ Test `validationUser` - Missing Token
  it("should return 401 if token is missing", async () => {
    req.header = sinon.stub().returns(null);

    await validationUser(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ msg: "No token, authorization denied" })).to.be.false;
  });

  // ✅ Test `validationUser` - Invalid Token
  it("should return 401 if token is invalid", async () => {
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    await validationUser(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ msg: "Token is not valid" })).to.be.true;
  });

  // ✅ Test `validationUser` - Token Without Bearer Prefix
  it("should return 401 if token is missing Bearer prefix", async () => {
    req.header = sinon.stub().returns("invalid_token");

    await validationUser(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ msg: "No token, authorization denied" })).to.be.true;
  });
});
