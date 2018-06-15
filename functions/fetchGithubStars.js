// Dependencies
const axios = require('axios')

// GraphQL query for Github API (https://developer.github.com/v4/)
const query = `
  query {
    react: repository(owner: "facebook", name: "react") {
      url
      stargazers {
        totalCount
      }
    }
    vue: repository(owner: "vuejs", name: "vue") {
      url
      stargazers {
        totalCount
      }
    }
  }
`

module.exports = (ctx, cb) => {
  
  // Github access tokens
  const {
    GITHUB_TOKEN_1,
    GITHUB_TOKEN_2,
    GITHUB_TOKEN_3,
    GITHUB_TOKEN_4,
    GITHUB_TOKEN_5
  } = ctx.secrets

  const tokens = [GITHUB_TOKEN_1, GITHUB_TOKEN_2, GITHUB_TOKEN_3, GITHUB_TOKEN_4, GITHUB_TOKEN_5]
  const GITHUB_TOKEN = tokens[Math.floor(Math.random() * tokens.length)]

  // Github GraphQL axios instance
  const github = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`
    }
  })

  // Get Vue & React info
  github.post('graphql', { query }).then(res => {
    cb(null, res.data)
  })
  
}
