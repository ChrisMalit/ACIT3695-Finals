const { gql, PubSub, ApolloServer } = require('apollo-server')
const crypto = require('crypto');
const posts = require('../db/posts');
const users = require('../db/users');
const comments = require('../db/comments');
const { cpuUsage } = require('process');

const typeDefs = gql`
    type Post {
        post_id: ID
        username: String
        topic: String
        body: String
        comments: String
    }

    type User {
        user_id: ID
        username: String
        name: String
    }

    type Comment {
        post_id: ID!
        comment_id: ID!
        username: String
        body: String!
        responses: String
    }

    type Query {
        posts: [Post]
        users: [User]
        comments: [Comment]
        getPostById(post_id: ID): Post
        getPostByTopic(topic: String): [Post]
    }

    type Mutation {
        addPost(username: String, topic:String, body:String, comments: String): Post!
        addComment(post_id: ID!, username:String, body: String!, responses: String): Comment!
        addReponse(comment_id: ID!, responses: String): Comment!
    }

    type Subscription {
        newPost: Post!
        newComment: Comment!
    }
`;

const NEW_POST = "NEW_POST"
const NEW_COMMENT = "NEW_COMMENT"

const resolvers = {
    Query: {
        posts: () => posts,
        users: () => users,
        comments: () => comments,
        getPostById: (_, { post_id }) => {
            const results = posts.find(b => b.post_id == post_id)
            return results
        },
        getPostByTopic: (_, { topic }) => {
            const results = posts.filter(a => a.topic == topic)
            return results
        },
    },
    Mutation: {
        addPost: (_, { username, topic, body, comments }, { pubsub }) => {
            const post_id = crypto.randomBytes(10).toString('hex');
            const makePost = { post_id, username, topic, body, comments }
            posts.push(makePost)
            pubsub.publish(NEW_POST, { newPost: makePost })
            return makePost
        },
        addComment: (_, { post_id, username, body, responses }, { pubsub }) => {
            const comment_id = crypto.randomBytes(10).toString('hex');
            const makeComment = { post_id, comment_id, username, body, responses }
            comments.push(makeComment)
            pubsub.publish(NEW_COMMENT, { newComment: makeComment })
            return makeComment
        },
        // WORK IN PROGRESS - EDITING COMMENT TO ADD RESPONSE
        addReponse: (_, { comment_id, responses }) => {
            posts.find(b => b.comment_id == comment_id)
            return("Response Added")
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, {pubsub}) => pubsub.asyncIterator(NEW_POST)
        },
        newComment: {
            subscribe: (_, __, {pubsub}) => pubsub.asyncIterator(NEW_COMMENT)
        }
    }
}

// PubSub
const pubsub = new PubSub()

const server = new ApolloServer({ typeDefs, resolvers, context: ({ req, res}) => ({ req, res, pubsub })})

module.exports = {
    resolvers,
    typeDefs,
    server
}