import config from '../../config';
import tedious from 'tedious';
import queries from './queries';

const { Connection, Request } = tedious;

const callback = ({ reject, resolve }) => (error, rowsCount, data) => {
  if (error) return reject(error);

  const format = data.map(row =>
    row.reduce((acc, { value, metadata: { colName } }) => {
      acc[colName] = value;
      return acc;
    }, {})
  );

  return resolve(format);
};

const openConnection = query =>
  new Promise((resolve, reject) => {
    const connection = new Connection(config.mssql);

    connection.on('connect', err => {
      if (err) reject(err);
      else {
        const request = { resolve, reject } |> callback |> query(Request);

        request.on('requestCompleted', () => connection.close());

        connection.execSql(request);
      }
    });
  });

export default {
  selectUser: queries.selectUser(openConnection),
};
