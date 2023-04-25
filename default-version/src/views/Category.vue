<template>
<div class="section">
  <div class="container">
    <tawk-breadcrumb :items="breadcrumbItems" :style="breadcrumbStyle" />

    <div class="grid-view">
      <div class="grid-container-fix">
        <div class="grid-item">
          <tawk-category-card
            v-if="!isEmpty(category)"
            :item="category"
            :type="'expanded'"
          />
        </div>

        <div
          class="list-view grid-item"
          :style="listFixStyle"
        >
          <div
            v-for="(article, index) in articles"
            :key="`${kebabCase(article.title)}-${index}`"
            class="list-item"
          >
            <tawk-article-card :item="article" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {isEmpty, kebabCase} from 'lodash'
import axios from 'axios'
import Breadcrumb from '../components/Breadcrumb.vue'
import CategoryCard from '../components/CategoryCard.vue'
import ArticleCard from '../components/ArticleCard.vue'
import {prodMode} from '../utils'

export default {
  components: {
    'tawk-breadcrumb': Breadcrumb,
    'tawk-category-card': CategoryCard,
    'tawk-article-card': ArticleCard
  },
  data: () => ({
    isEmpty,
    kebabCase,
    breadcrumbItems: [],
    category: {},
    articles: []
  }),
  computed: {
    breadcrumbStyle: () => {
      return {marginTop: `${21 - 60}px`, marginBottom: '22px'}
    },
    listFixStyle: () => {
      return {width: `${100/3*2}%`}
    }
  },
  watch: {
    category() {
      this.breadcrumbItems = [...this.breadcrumbItems, {
        title: this.category.title
      }]
    }
  },
  methods: {
    extractCategoryId() {
      const {path} = this.$route
      // I'm sure there is a better way to extract the id below..
      return path.split('-').reverse()[0]
    },
    async fetchCategoryById(id) {
      const suffix = prodMode ? '.json' : ''
      axios.get(`/api/categories${suffix}`)
        .then(response => {
          this.category = response.data.filter(item => item.id === id)[0]
        })
        .catch(error => ({error: JSON.stringify(error)}))
    },
    async fetchArticles() {
      const suffix = prodMode ? '.json' : '/'
      axios.get(`/api/category${suffix}`)
        .then(response => {
          this.articles = response.data.filter(item => item.status === 'published')
        })
        .catch(error => ({error: JSON.stringify(error)}))
    }
  },
  created() {
    const id = this.extractCategoryId()
    this.fetchCategoryById(id)
    this.fetchArticles()
    this.breadcrumbItems = [{
      title: 'All categories',
      path: '/'
    }]
  }
}
</script>

<style lang="scss" scoped>
.section .grid-view {
  transform: translateX(0);
}
</style>

<!-- global styles -->
<style lang="scss">
@import '../scss/_variables.scss';

// my apologies for the inconvenience...
// the rule below should've been somewhere as shared styles.
// the reason to keep it here is to @extend it within list view.
/* start of block */
.clearfix:before,
.clearfix:after {
  content: ' ';
  display: table;
}
.clearfix:after {
  clear: both;
}
/* end of block */

.section .list-view {
  @extend .clearfix;
  margin-top: -($container-grid--gap*0.5);
  margin-bottom: -($container-grid--gap*0.5);
  > .list-item {
    float: left;
    width: 100%;
    padding: $container-grid--gap*0.5 0;
  }
}
</style>