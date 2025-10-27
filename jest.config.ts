import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/app"],
  setupFilesAfterEnv: ["<rootDir>/app/test/setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          verbatimModuleSyntax: false,
        },
      },
    ],
  },
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["app/**/*.{ts,tsx}", "!app/**/*.d.ts", "!app/test/**"],
  coverageProvider: "v8",
  coverageReporters: ["text", "json", "html"],
  verbose: true,
};

export default config;
