// src/__tests__/unit/middlewares/auth.middleware.test.ts

import { authenticate } from "../../middlewares/auth.middleware";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

const mockJwt = jwt as jest.Mocked<typeof jwt>;

const makeRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

const makeReq = (authHeader?: string) =>
  ({
    headers: authHeader ? { authorization: authHeader } : {},
  } as Request);

const mockNext = jest.fn() as NextFunction;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "test_secret";
});

describe("authenticate middleware", () => {
  test("calls next() when token is valid", () => {
    const decoded = { id: "user1", role: "SCHOOL" };
    mockJwt.verify.mockReturnValue(decoded as any);

    const req = makeReq("Bearer valid_token");
    const res = makeRes();

    authenticate(req as any, res, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(); // no error
  });

  test("attaches decoded user to req.user", () => {
    const decoded = { id: "user1", role: "SCHOOL" };
    mockJwt.verify.mockReturnValue(decoded as any);

    const req = makeReq("Bearer valid_token") as any;
    const res = makeRes();

    authenticate(req, res, mockNext);

    expect(req.user).toEqual(decoded);
  });

  test("returns 401 when Authorization header is missing", () => {
    const req = makeReq(); 
    const res = makeRes();

    authenticate(req as any, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Authorization header missing" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("returns 401 when token is missing after 'Bearer'", () => {
    const req = makeReq("Bearer "); 
    const res = makeRes();

    mockJwt.verify.mockImplementation(() => { throw new Error(); });

    authenticate(req as any, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("returns 401 with 'Invalid or expired token' when jwt.verify throws", () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const req = makeReq("Bearer expired_token");
    const res = makeRes();

    authenticate(req as any, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired token" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("returns 401 with 'Token missing' when only 'Bearer' is sent with no value", () => {
    const req = {
      headers: { authorization: "Bearer" },
    } as Request;
    const res = makeRes();

    authenticate(req as any, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token missing" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("does not call next() when token is invalid", () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const req = makeReq("Bearer bad_token");
    const res = makeRes();

    authenticate(req as any, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});