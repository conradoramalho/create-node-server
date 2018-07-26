export default {
  port: process.env.PORT | 3000,

  mssql: {
    userName: process.env.MSSQL_USER || 'admin',
    password: process.env.MSSQL_PASSWORD || 'admin',
    server: process.env.MSSQL_HOST || 'localhost',
    options: {
      database: process.env.MSSQL_DATABASE || 'teste',
      rowCollectionOnRequestCompletion: true,
      encrypt: false,
    },
  },
};
