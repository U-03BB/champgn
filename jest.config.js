module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  moduleFileExtensions: ["ts", "js", "json", "vue"],
  setupFiles: ["./tests/setup.js"],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/tests/unit/styleMock.js"
  },
  transform: {
    "^.+\\.vue$": "vue-jest"
  }
};
