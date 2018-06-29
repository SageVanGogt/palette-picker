module.exports = {

  test: {
    client: 'pg',
    connection: 'postgres://localhost/palette-picker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './seeds/test'
    },
    useNullAsDefault: true
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost/palette-picker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './seeds/dev'
    },
    useNullAsDefault: true
  }
};
