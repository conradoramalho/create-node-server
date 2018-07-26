import { TYPES } from 'tedious';
import { promisify } from 'util';

const RETRIES_QUANTITY = 10;
const RETRY_TIMEOUT_IN_SECONDS = 10;

const selectUser = mssql => async (userId, retries = RETRIES_QUANTITY) => {
  try {
    return await (userId |> query |> mssql); 
  } catch (error) {
    return retries ? setTimeout[promisify.custom](RETRY_TIMEOUT_IN_SECONDS * 1000).then(() => selectUser(mssql)(userId, --retries)) : Promise.reject(error);
  }
};

const query = userId => Request => callback => {
  const request = new Request(
    `
        SELECT *
          FROM tb_users 
         WHERE id = @userId
    `,
    callback
  );

  request.addParameter('userId', TYPES.Int, userId);

  return request;
};

export default selectUser;
