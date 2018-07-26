import mssql from '../database/mssql';

const getUser = async ctx => {
  const { id } = ctx.params;

  const user = await mssql.selectUser(id);

  return (ctx.body = { user });
};

export default {
  getUser,
};
