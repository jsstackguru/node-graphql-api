// DateTime type for GraphQL

import { GraphQLScalarType } from 'graphql'

const parseISO8601 = (value) => {
  return value
}

const serializeISO8601 = (value) => {
  return value
}

const parseLiteralISO8601 = (ast) => {
  return ast.value
}

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'An ISO-8601 encoded UTC date string.',
  serialize: serializeISO8601,
  parseValue: parseISO8601,
  parseLiteral: parseLiteralISO8601,
})

export default DateTime
