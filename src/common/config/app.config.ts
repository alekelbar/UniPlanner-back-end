export const appConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  skipPerPage: process.env.SKIP_PAGE || 5,
  limitPerPage: process.env.LIMIT_PER_PAGE || 5,
});
