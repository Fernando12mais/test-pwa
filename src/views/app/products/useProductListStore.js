import { defineStore } from 'pinia'
import axios from '@axios'

export const useProductListStore = defineStore('ProductListStore', {
  actions: {
    // 👉 Fetch users data
    fetchProducts(params) { return axios.get('/apps/products', { params }) },


    // 👉 fetch single user
    fetchProduct(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/apps/products/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
