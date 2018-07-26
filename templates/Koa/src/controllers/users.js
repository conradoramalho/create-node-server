const getUser = async ctx => {
  const { id } = ctx.params;
 
  return (ctx.body = { user: {id, name: 'Michael', LastName: 'Jackson'} });
};

export default {
  getUser,
};
