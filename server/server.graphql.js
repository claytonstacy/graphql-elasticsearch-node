const {ElasticSearchClient} = require('./server.elasticsearch');
const elasticSearchSchema = require('./server.es.schema');
const {makeExecutableSchema} = require('graphql-tools');
const {GraphQLScalarType} = require('graphql');

// Construct a schema, using GraphQL schema language
const typeDefs = ` 
  type Notif {
    elkIndex: String
    baseline: String
    casenote: String
    dataType: String
    digraph: String
    fileType: String
    mission: String
    notiftype: String
    status: String
    file: File
    time: Date
    nifiPickupTime: Date
  }
  type File {
    creationTime: Date
    extension: String
    group: String
    owner: String
    permissions: String
    size: String
  }
  type Query {
    notifs: [Notif]
    notifsByType(notiftype: String, mission: String): [Notif]
    unique: [Notif]
  }
  scalar Date
`;

// The root provides a resolver function for each API endpoint
const resolvers = {
  Query: {
    notifs: () => new Promise((resolve, reject) => {
      ElasticSearchClient({...elasticSearchSchema})
        .then(r => {
          let _source = r['hits']['hits'];
              _source.map((item, i) => _source[i] = item._source);

          resolve(_source);
        });
    }),
    notifsByType: () => new Promise((resolve, reject) => {
      ElasticSearchClient({...elasticSearchSchema})
        .then(r => {
          console.log('this is r', r);
          let _source = r['hits']['hits'];
              _source.map((item, i) => _source[i] = item._source);

          resolve(_source);
        });
    })
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    }
  })
};

module.exports = makeExecutableSchema({
  "typeDefs": [typeDefs],
  "resolvers": resolvers
});
