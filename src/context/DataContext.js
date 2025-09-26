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

  // Função para calcular indicador de satisfação para um registro
  const calculateSatisfactionIndicator = (row) => {
    const indicatorFields = [
      // Saúde Emocional
      "T_P13_1", "T_P13_2",
      // Reconhecimento & Motivação
      "T_P16_1", "T_P16_2", "T_P16_3", "T_P16_4", "T_P16_5",
      // Ambiente de Trabalho
      "T_P20_1", "T_P20_2", "T_P20_3",
      // Cultura Organizacional
      "T_P21_2", "T_P21_3",
      // Liderança
      "T_P22_1", "T_P22_2", "T_P22_3", "T_P22_4", "T_P22_5",
      // Comunicação Interna
      "T_P23_1", "T_P23_2",
      // Diversidade
      "T_P31_1", "T_P31_2",
      // Benefícios
      "T_P32_2", "T_P32_3"
    ]

    let pontuacaoTotal = 0
    let respostasValidas = 0

    indicatorFields.forEach(field => {
      const value = row[field]
      const numValue = parseInt(value)
      
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
        if (numValue >= 4) {
          pontuacaoTotal += 10 // Nota 4 ou 5 = 10 pontos
        } else if (numValue === 3) {
          pontuacaoTotal += 5  // Nota 3 = 5 pontos
        }
        // Nota 1 ou 2 = 0 pontos
        respostasValidas++
      }
    })

    const pontuacaoMaxima = respostasValidas * 10
    return pontuacaoMaxima > 0 ? (pontuacaoTotal / pontuacaoMaxima) * 100 : 0
  }

  // Função para categorizar grau de felicidade
  const categorizeFelicidade = (value) => {
    const numValue = parseInt(value)
    if (isNaN(numValue)) return null
    
    if (numValue <= 5) return "Baixa felicidade (0-5)"
    if (numValue <= 7) return "Felicidade média (6-7)"
    return "Alta felicidade (8-10)"
  }

  // Função para categorizar indicador de satisfação
  const categorizeSatisfaction = (score) => {
    if (score < 60) return "Baixo (0-59)"
    if (score < 80) return "Regular (60-79)"
    if (score < 90) return "Alto (80-89)"
    return "Excelente (90-100)"
  }

  const getFilteredData = () => {
    const rawData = apiService.filterData(filters)
    
    // Se não há filtros analíticos, retorna dados normais
    const hasAnalyticFilters = Object.keys(filters).some(key => 
      ['P17_TRAJETORIA', 'P12_FELICIDADE', 'SATISFACAO_CATEGORIA'].includes(key)
    )
    
    if (!hasAnalyticFilters) {
      return rawData
    }

    // Aplicar filtros analíticos
    return rawData.filter(row => {
      let passesFilter = true

      // Filtro de Futuro Profissional (P17)
      if (filters.P17_TRAJETORIA && filters.P17_TRAJETORIA.length > 0) {
        const p17Field = "P17 - Pensando no seu momento atual e no seu futuro profissional, como você enxerga a sua trajetória na Eldorado?"
        const trajetoria = row[p17Field]
        
        if (!trajetoria || !filters.P17_TRAJETORIA.includes(trajetoria)) {
          passesFilter = false
        }
      }

      // Filtro de Grau de Felicidade (P12)
      if (filters.P12_FELICIDADE && filters.P12_FELICIDADE.length > 0) {
        const p12Field = "P12 - Pensando em uma escala de 0 a 10, em que 0 é nada e 10 é muito, o quanto você se considera feliz no ambiente de trabalho?"
        const felicidade = row[p12Field]
        const categoriaFelicidade = categorizeFelicidade(felicidade)
        
        if (!categoriaFelicidade || !filters.P12_FELICIDADE.includes(categoriaFelicidade)) {
          passesFilter = false
        }
      }

      // Filtro de Indicador de Satisfação
      if (filters.SATISFACAO_CATEGORIA && filters.SATISFACAO_CATEGORIA.length > 0) {
        const satisfactionScore = calculateSatisfactionIndicator(row)
        const categoriaSatisfacao = categorizeSatisfaction(satisfactionScore)
        
        if (!filters.SATISFACAO_CATEGORIA.includes(categoriaSatisfacao)) {
          passesFilter = false
        }
      }

      return passesFilter
    })
  }

  const getUniqueValues = (columnName) => {
    return apiService.getUniqueValues(columnName)
  }

  // Função para obter estatísticas dos filtros aplicados
  const getFilterStats = () => {
    const allData = apiService.filterData({}) // Todos os dados
    const filteredData = getFilteredData() // Dados filtrados
    
    return {
      total: allData.length,
      filtered: filteredData.length,
      percentage: allData.length > 0 ? Math.round((filteredData.length / allData.length) * 100) : 0
    }
  }

  // Função para obter valores únicos dos filtros analíticos
  const getAnalyticFilterValues = (filterKey) => {
    const allData = apiService.filterData({})
    
    if (filterKey === "P17_TRAJETORIA") {
      const p17Field = "P17 - Pensando no seu momento atual e no seu futuro profissional, como você enxerga a sua trajetória na Eldorado?"
      const values = allData
        .map(row => row[p17Field])
        .filter(value => value && value.trim() !== "" && !value.includes("#NULL!"))
      
      return [...new Set(values)].sort()
    }
    
    if (filterKey === "P12_FELICIDADE") {
      return [
        "Baixa felicidade (0-5)",
        "Felicidade média (6-7)", 
        "Alta felicidade (8-10)"
      ]
    }
    
    if (filterKey === "SATISFACAO_CATEGORIA") {
      return [
        "Baixo (0-59)",
        "Regular (60-79)",
        "Alto (80-89)",
        "Excelente (90-100)"
      ]
    }
    
    return []
  }

  const value = {
    data,
    loading,
    error,
    filters,
    updateFilters,
    getFilteredData,
    getUniqueValues,
    getFilterStats,
    getAnalyticFilterValues,
    calculateSatisfactionIndicator,
    categorizeFelicidade,
    categorizeSatisfaction
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}