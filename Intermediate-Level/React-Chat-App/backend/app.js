const { GraphQLServer, PubSub } = require('graphql-yoga');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

const options = {
  port: 4000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
};

server.start(options, ({ port }) => console.log(
  `Server is listening on port ${port}...`,
));
