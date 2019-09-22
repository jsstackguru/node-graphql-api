import gq from '../graphQueriesVars'


export const pageQueries = {
  // Page by ID
  '/v1/pages/:id': ({id}) => {
    return `
      query {
        page(id: "${id}") {
          ${gq.page.basic}
          content
        }
      }`
  }

}
