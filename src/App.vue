<template>
  <div id="app">
    <github-corner/>
    <p>Has Vue passed React yet?</p>
    <template v-if="repos">
      <h1>{{ vueHasPassedReact ? 'YES' : 'NO' }}</h1>
      <p>
        <small
          v-if="!vueHasPassedReact">
            Only {{ reactStars - vueStars | formatNumber }} stars away!
          </small>
      </p>
      <ul>
        <li>
          <a :href="repos.vue.url" target="_blank">
            <vue-icon/>
            <span>{{ vueStars | formatNumber }}</span>
            <star-icon/>
          </a>
        </li>
        <li>
          <a :href="repos.react.url" target="_blank">
            <react-icon/>
            <span>{{ reactStars | formatNumber }}</span>
            <star-icon/>
          </a>
        </li>
      </ul>
    </template>
    <p v-else>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios'
import GithubCorner from './components/GithubCorner'
import { VueIcon, ReactIcon, StarIcon } from './components/icons'

const query = `
  query {
    react: repository(owner: "facebook", name: "react") {
      url
      stargazers(first: 1) {
        totalCount
      }
    }
    vue: repository(owner: "vuejs", name: "vue") {
      url
      stargazers(first:1) {
        totalCount
      }
    }
  }
`

const TOKEN = ['7594db13c793111b2b', 'fa651c318a93de5b8869e1']

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `Bearer ${TOKEN.join('')}`
  }
})

export default {
  name: 'App',

  data() {
    return {
      repos: null
    }
  },

  components: {
    VueIcon,
    ReactIcon,
    StarIcon,
    GithubCorner
  },

  mounted() {
    this.fetchRepos()
  },

  computed: {
    vueHasPassedReact() {
      return this.vueStars > this.reactStars
    },

    vueStars() {
      return this.repos.vue.stargazers.totalCount
    },

    reactStars() {
      return this.repos.react.stargazers.totalCount
    }
  },

  filters: {
    formatNumber(number) {
      return new Intl.NumberFormat().format(number)
    }
  },

  methods: {
    async fetchRepos() {
      try {
        const { data: res } = await github.post('graphql', { query })
        this.repos = res.data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  text-align: center;
  color: #333;
}

#app {
  width: 300px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
}

h1 {
  font-size: 100px;
  margin: 10px 0;
}

ul {
  margin: 0;
  padding: 0;
  display: flex;
}

li {
  list-style-type: none;
  flex: 1;
  
}

li a {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #eeeeee;
  padding: 10px;
  text-decoration: none;
  color: #333;
}

li:hover {
  background: #eeeeee;
}

li a > svg {
  display: block;
  width: 22px;
}

li a > * {
  margin: 5px;
}

li:last-of-type {
  border-left: 1px solid #eeeeee;
}

</style>
