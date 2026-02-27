import {
  schoolOnly,
  studentOnly,
  requireSuperAdmin,
} from "../../middlewares/role.middleware";
import { Response, NextFunction } from "express";

const makeRes = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response);

const makeNext = () => jest.fn() as NextFunction;

const makeReq = (role?: string) =>
  ({ user: role ? { role } : undefined } as any);

// ─────────────────────────────────────────────
// schoolOnly
// ─────────────────────────────────────────────
describe("schoolOnly middleware", () => {
  test("calls next() when role is SCHOOL", () => {
    const req = makeReq("SCHOOL");
    const res = makeRes();
    const next = makeNext();

    schoolOnly(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("returns 403 when role is STUDENT", () => {
    const req = makeReq("STUDENT");
    const res = makeRes();
    const next = makeNext();

    schoolOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "School access only" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when role is SUPERADMIN", () => {
    const req = makeReq("SUPERADMIN");
    const res = makeRes();
    const next = makeNext();

    schoolOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when user is undefined", () => {
    const req = makeReq(); // no user
    const res = makeRes();
    const next = makeNext();

    schoolOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// studentOnly
// ─────────────────────────────────────────────
describe("studentOnly middleware", () => {
  test("calls next() when role is STUDENT", () => {
    const req = makeReq("STUDENT");
    const res = makeRes();
    const next = makeNext();

    studentOnly(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("returns 403 when role is SCHOOL", () => {
    const req = makeReq("SCHOOL");
    const res = makeRes();
    const next = makeNext();

    studentOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Student access only" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when role is SUPERADMIN", () => {
    const req = makeReq("SUPERADMIN");
    const res = makeRes();
    const next = makeNext();

    studentOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when user is undefined", () => {
    const req = makeReq();
    const res = makeRes();
    const next = makeNext();

    studentOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// requireSuperAdmin
// ─────────────────────────────────────────────
describe("requireSuperAdmin middleware", () => {
  test("calls next() when role is SUPERADMIN", () => {
    const req = makeReq("SUPERADMIN");
    const res = makeRes();
    const next = makeNext();

    requireSuperAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test("returns 403 when role is SCHOOL", () => {
    const req = makeReq("SCHOOL");
    const res = makeRes();
    const next = makeNext();

    requireSuperAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "SuperAdmin access required" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when role is STUDENT", () => {
    const req = makeReq("STUDENT");
    const res = makeRes();
    const next = makeNext();

    requireSuperAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when user is undefined", () => {
    const req = makeReq();
    const res = makeRes();
    const next = makeNext();

    requireSuperAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});