import mongoose from "mongoose";
import { connectDatabaseTest, testConnection } from "../../database/db";

describe("MongoDB Integration", () => {
  beforeAll(async () => {
    await connectDatabaseTest();
    
  }, 10000); // Increase timeout for connection

  afterAll(async () => {
    if (testConnection && testConnection.readyState === 1) {
      await testConnection.dropDatabase();
      await testConnection.close();
    }
  }, 10000); // Increase timeout for cleanup

  test("should connect to test DB successfully", async () => {
    expect(testConnection.readyState).toBe(1);
  });

  test("should fail if invalid DB_URL", async () => {
    const invalidConnection = mongoose.createConnection("invalid_url");
    
    await expect(invalidConnection.asPromise()).rejects.toThrow();
    
    // Clean up
    if (invalidConnection.readyState !== 0) {
      await invalidConnection.close();
    }
  });
});