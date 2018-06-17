<template>
  <div id="app">
    <github-corner/>
    <p>Has Vue passed React yet?</p>
    <template v-if="repos">
      <h1 v-if="!tie">{{ vueHasPassedReact ? 'YES' : 'NO' }}</h1>
      <h1 :class="{ pad : tie }" v-else>TIE!</h1>
      <p>
        <small v-if="!vueHasPassedReact && !tie" class="away">
          Only {{ reactStars - vueStars | formatNumber }} {{ reactStars - vueStars === 1 ? 'star' : 'stars'}} away!
        </small>
        <small v-else-if="vueHasPassedReact && !tie" class="ahead">
          Ahead by {{ vueStars - reactStars | formatNumber }} {{ vueStars - reactStars === 1 ? 'star' : 'stars'}}!
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
      <span class="reload" @click="reload">
        <svg :class="{ reloading }" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#333333" d="M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 0 1-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </span>
    </template>
    <template v-else-if="error">
      <h1 class="error">Error</h1>
      <p>
        Couldn't retrieve any data.
        The API rate limits might have kicked in. Just wait a bit and try again.
      </p>
    </template>
    <p v-else>Loading...</p>
  </div>
</template>

<script>
import axios from 'axios'
import GithubCorner from './components/GithubCorner'
import { VueIcon, ReactIcon, StarIcon } from './components/icons'

const FUNCTIONS_ENDPOINT = 'https://wt-13e53fa81a1f88b8fd161c9e57aeaac4-0.sandbox.auth0-extend.com/fetchGithubStars'

export default {
  name: 'App',

  data() {
    return {
      repos: null,
      error: false,
      reloading: false
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
    if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
      document.body.classList.remove('no-touch')
    }
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
    },

    tie() {
      return this.vueStars === this.reactStars
    },

    pad() {
      return !this.vueHasPassedReact || this.tie
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
        const { data: res } = await axios.get(FUNCTIONS_ENDPOINT)
        if (res.errors && res.errors.length) {
          this.error = true
          this.repos = null
          // eslint-disable-next-line
          console.log(res.errors)
        } else {
          this.error = true
          this.repos = res.data
        }
      } catch (err) {
        // eslint-disable-next-line
        console.log(err)
      }
    },

    async reload() {
      if (this.reloading) return
      this.reloading = true
      await this.fetchRepos()
      setTimeout(() => {
        this.reloading = false
      }, 900)
    }
  }
}
</script>

<style>

* {
  box-sizing: border-box;
}

::selection {
  background: rgba(0,0,0,0);
}
::-moz-selection {
  background: rgba(0,0,0,0);
}

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
  background: #efefef;
}

#app {
  width: 300px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07);
  overflow: hidden;
  position: relative;
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
  width: 50%;
}

li a {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #dddddd;
  padding: 10px;
  text-decoration: none;
  color: #333;
}

.no-touch li:hover {
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
  border-left: 1px solid #dddddd;
}

h1.error {
  font-size: 2em;
}

h1.pad {
  margin-bottom: 30px;
}

p {
  padding: 0 1em;
}

.away, .ahead {
  display: block;
  margin-bottom: 40px;
}

.reload {
  position: absolute;
  left: 50%;
  margin-left: -20px;
  bottom: 30px;
  background: #ffffff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dddddd;
  border-radius: 50%;
}

.reload svg {
  transform-origin: center center;
}

.no-touch .reload:hover {
  cursor: pointer;
  background: #eeeeee;
}

.reloading {
  animation: rotate 1s infinite ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to { 
    transform: rotate(-360deg);
  }
}

</style>
