"use client"

import { createContext, useContext, useState, useEffect } from "react"
import apiService from "../services/apiService"

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await apiService.fetchData()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err)
        console.error("Error loading data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const updateFilters = (newFilters) => {
    setFilters(newFilters)
  }

  const getFilteredData = () => {
    return apiService.filterData(filters)
  }

  const getUniqueValues = (columnName) => {
    return apiService.getUniqueValues(columnName)
  }

  const value = {
    data,
    loading,
    error,
    filters,
    updateFilters,
    getFilteredData,
    getUniqueValues,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
