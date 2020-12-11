const { ApolloServer } = require('apollo-server');
const { resolvers, typeDefs, server } = require('./src/schema')


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});