export default () => ({
  SERVER_PORT: parseInt(process.env.PORT, 10) || 3000,
});
