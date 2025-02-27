const chai = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const { expect } = chai;
const { protect, authorize } = require("../middlewares/authUsers");

describe("Auth Middleware Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: { authorization: "Bearer valid_token" } };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    next = sinon.stub();
    process.env.JWT_SECRET = "test_secret";
  });

  afterEach(() => {
    sinon.restore();
  });

  //  Test `protect` - Valid Token
  it("should authenticate user with a valid token", async () => {
    sinon.stub(jwt, "verify").returns({ userId: "12345", role: "user" });

    await protect(req, res, next);

    expect(req.user.userId).to.equal("12345");
    expect(next.calledOnce).to.be.true;
  });

  //  Test `protect` - Missing Token
  it("should return 401 if token is missing", async () => {
    req.headers.authorization = null;

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Not authorized, no token" })).to.be.false;
  });

  //  Test `protect` - Invalid Token
  it("should return 401 if token is invalid", async () => {
    sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Invalid or expired token" })).to.be.true;
  });

  //  Test `protect` - Token Without Bearer Prefix
  it("should return 401 if token is missing Bearer prefix", async () => {
    req.headers.authorization = "invalid_token";

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Not authorized, no token" })).to.be.false;
  });

  //  Test `authorize` - Role Allowed
  it("should allow access for authorized roles", async () => {
    req.user = { role: "admin" };
    const middleware = authorize("admin", "superadmin");

    await middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  //  Test `authorize` - Role Denied
  it("should return 403 if user role is not allowed", async () => {
    req.user = { role: "user" };
    const middleware = authorize("admin", "superadmin");

    await middleware(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Access denied. Insufficient permissions" })).to.be.true;
  });
});
