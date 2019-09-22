/**
 * @file Create dump authors
 * @author Nikola Miljkovic <mnikson@gmail.com>
 * @version 1.0
 */

// import { Author } from '../../../models/author'

// Fakers
import authorFaker from '../../../../test/fixtures/faker/author/author.faker'

// Insert authors
export const init = async (n = 1) => {
  const authors = await authorFaker({
    n
  })
  console.log('authors', authors)
}

// init(10)
