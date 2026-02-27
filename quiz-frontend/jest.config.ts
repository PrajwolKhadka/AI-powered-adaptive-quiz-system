import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: { jsx: "react-jsx" }
    }]
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",  // ← must be rootDir/$1, NOT rootDir/src/$1
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
};

export default config;