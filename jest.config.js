module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'tsx'],
    testMatch: ['**/test/**/*.test.ts'],
    cache: true,
    cacheDirectory: '.jest',
}; 