module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/palette-picker',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
