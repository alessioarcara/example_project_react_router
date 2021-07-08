const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema  } = require('graphql')
const mongoose = require('mongoose');
const cors = require('cors')

const Quote = require('./models/quote')
const Comment = require('./models/comment')
const server = express()
server.use(cors())

server.use(
    '/api', graphqlHTTP({
        schema: buildSchema(`
            type Quote {
                _id: ID!
                author: String!
                text: String!
                comments: [Comment!]
            }
            
            type Comment {
                _id: ID!
                quote_id: ID!
                text: String!
            }
            
            input QuoteInput {
                author: String!
                text: String!
            }
            
            input CommentInput {
                quote_id: ID!
                text: String!
            }
            
            type RootQuery {
                quotes: [Quote!]!
                comments(_id: ID!): Quote!
                quote(id: ID!): Quote!
            }
            
            type RootMutation {
                createQuote(inputQuote: QuoteInput!): Boolean!
                createComment(inputComment: CommentInput!): Boolean!
            }
            
            schema {
                query: RootQuery
                mutation: RootMutation
            }
                      
        `),
        rootValue: {
            quote: async args => {
              try {
                  const quote = await Quote.findById(args.id).populate('comments')
                  return { ...quote._doc }
              } catch (err) {
                  throw new Error(`Can't find quote: ${err}`)
              }
            },
            quotes: async () => {
                try {
                    const quotes = await Quote.find()
                    return quotes.map(quote => quote._doc)
                } catch (err) {
                    throw new Error(`Can't retrieve quotes: ${err}`)
                }
            },
            createQuote: async args => {
                try {
                    const quote = new Quote({...args.inputQuote})
                    await quote.save()
                    return true
                } catch (err) {
                    throw new Error(`Can't create quote: ${err}`)
                }
            },
            createComment: async args => {
                const {quote_id, text} = args.inputComment
                const comment = new Comment({quoteId: quote_id, text })
                try {
                    await comment.save()
                    quote = await Quote.findById(quote_id)

                    if (!quote) {
                        throw new Error('User not found.')
                    }

                    quote.comments.push({...comment._doc});
                    await quote.save();

                    return true
                } catch (err) {
                    throw new Error(`Can't create comment ${err}`)
                }
            }
        },
        graphiql: true
    }))

mongoose.connect(
    `mongodb://localhost:27017/${process.env.MONGO_DB}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        server.listen(3001);
    })
    .catch(err => {
        console.log(err)
    })
