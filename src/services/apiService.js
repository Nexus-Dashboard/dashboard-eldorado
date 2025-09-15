// src/services/apiService.js

import axios from "axios"

const API_BASE_URL = "https://api-phi-one-99.vercel.app/api/google/file/10hEQUBRdf8YCWfx-HulMkAcOyjSY55XgfFQBSL2TOZU"

class ApiService {
  constructor() {
    this.data = null
    this.loading = false
    this.error = null
  }

  async fetchData() {
    if (this.data) {
      return this.data
    }

    this.loading = true
    this.error = null

    try {
      const response = await axios.get(API_BASE_URL)
      this.data = response.data
      this.loading = false
      return this.data
    } catch (error) {
      this.error = error
      this.loading = false
      throw error
    }
  }

  getData() {
    return this.data
  }

  isLoading() {
    return this.loading
  }

  getError() {
    return this.error
  }

  // Filter data and transform to array of objects
  filterData(filters) {
    if (!this.data || !this.data.fileData || !this.data.fileData.sheets || !this.data.fileData.sheets.base_tratada) {
      return []
    }

    const rawData = this.data.fileData.sheets.base_tratada
    const headers = rawData[0]
    const rows = rawData.slice(1)

    let filteredRows = rows
    if (filters && Object.keys(filters).length > 0) {
      filteredRows = rows.filter((row) => {
        return Object.entries(filters).every(([filterKey, filterValues]) => {
          if (!filterValues || filterValues.length === 0) return true

          const columnIndex = headers.indexOf(filterKey)
          if (columnIndex === -1) return true

          const cellValue = row[columnIndex]
          return filterValues.includes(cellValue)
        })
      })
    }
    
    // **PRINCIPAL ALTERAÇÃO AQUI: Transformar array de arrays em array de objetos**
    return filteredRows.map(row => {
      const rowObject = {}
      headers.forEach((header, index) => {
        rowObject[header] = row[index]
      })
      return rowObject
    })
  }

  getUniqueValues(columnName) {
    if (!this.data || !this.data.fileData || !this.data.fileData.sheets || !this.data.fileData.sheets.base_tratada) {
      return []
    }

    const rawData = this.data.fileData.sheets.base_tratada
    const headers = rawData[0]
    const rows = rawData.slice(1)

    const columnIndex = headers.indexOf(columnName)
    if (columnIndex === -1) return []

    const values = rows.map((row) => row[columnIndex]).filter((value) => value && value.trim() !== "")
    return [...new Set(values)].sort()
  }
}

export default new ApiService()