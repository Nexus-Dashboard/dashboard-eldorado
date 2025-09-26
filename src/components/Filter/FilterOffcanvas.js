"use client"

import { useState, useEffect } from "react"
import { Offcanvas, Form, Button, Row, Col } from "react-bootstrap"
import { useData } from "../../context/DataContext"

const FilterOffcanvas = ({ show, handleClose }) => {
  const { filters, updateFilters, getUniqueValues } = useData()
  const [localFilters, setLocalFilters] = useState({})

  const filterConfig = [
    { key: "TEMPO_ELDORADO", label: "Tempo de Eldorado" },
    { key: "LOCALIDADE2", label: "Localidade" },
    { key: "PF2_FINAL", label: "Diretorias" },
    { key: "RECORTE_PERFIL_FINAL", label: "Diretorias e Segmentações" },
    { key: "FAIXA_ETARIA", label: "Faixa Etária" },
    { key: "GENERO", label: "Gênero" },
    { key: "RACA_COR", label: "Raça/Cor" },
    { key: "ESCOLARIDADE_0", label: "Escolaridade" }
  ]

  // Definir ordem específica para cada filtro
  const customOrders = {
    "TEMPO_ELDORADO": [
      "Menos de 1 ano",
      "De 1 a 3 anos", 
      "De 4 a 6 anos",
      "De 7 a 9 anos",
      "10 anos ou mais"
    ],
    "FAIXA_ETARIA": [
      "Até 24 anos",
      "De 25 a 34 anos",
      "De 35 a 44 anos", 
      "De 45 a 54 anos",
      "De 55 a 64 anos",
      "65 anos ou mais"
    ],
    "GENERO": [
      "Homem cisgênero",
      "Mulher cisgênero",
      "Outros",
      "Prefiro não declarar"
    ],
    "RACA_COR": [
      "Branco",
      "Preto", 
      "Pardo",
      "Prefiro não declarar",
      "Outros"
    ]
  }

  // Configuração de agregações - mapeia valores para serem agrupados
  const aggregations = {
    "GENERO": {
      "Outros": ["Outros", "Transgênero"] // "Outros" inclui tanto "Outros" quanto "Transgênero"
    }
  }

  // Função para filtrar valores inválidos
  const filterValidValues = (values) => {
    return values.filter(value => 
      value && 
      value.trim() !== "" && 
      !value.includes("#NULL!") &&
      value !== "null" &&
      value !== "undefined"
    )
  }

  // Função para agregar valores conforme configuração
  const aggregateValues = (values, filterKey) => {
    if (!aggregations[filterKey]) {
      return values
    }

    const aggregationConfig = aggregations[filterKey]
    const aggregatedSet = new Set()
    
    values.forEach(value => {
      let wasAggregated = false
      
      // Verificar se este valor deve ser agregado em algum grupo
      Object.entries(aggregationConfig).forEach(([groupName, groupValues]) => {
        if (groupValues.includes(value)) {
          aggregatedSet.add(groupName)
          wasAggregated = true
        }
      })
      
      // Se não foi agregado, manter o valor original
      if (!wasAggregated) {
        aggregatedSet.add(value)
      }
    })
    
    return Array.from(aggregatedSet)
  }

  // Função para ordenar valores conforme configuração
  const sortValues = (values, filterKey) => {
    const validValues = filterValidValues(values)
    const aggregatedValues = aggregateValues(validValues, filterKey)
    
    if (customOrders[filterKey]) {
      const order = customOrders[filterKey]
      const sorted = []
      
      // Primeiro, adicionar valores na ordem específica
      order.forEach(orderItem => {
        const foundValue = aggregatedValues.find(value => 
          value.toLowerCase().trim() === orderItem.toLowerCase().trim()
        )
        if (foundValue) {
          sorted.push(foundValue)
        }
      })
      
      // Depois, adicionar valores que não estão na ordem específica (alfabeticamente)
      const remainingValues = aggregatedValues.filter(value => 
        !order.some(orderItem => 
          value.toLowerCase().trim() === orderItem.toLowerCase().trim()
        )
      ).sort()
      
      return [...sorted, ...remainingValues]
    }
    
    // Para filtros sem ordem específica, ordenar alfabeticamente
    return aggregatedValues.sort()
  }

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (filterKey, value, checked) => {
    setLocalFilters((prev) => {
      const currentValues = prev[filterKey] || []
      if (checked) {
        return {
          ...prev,
          [filterKey]: [...currentValues, value],
        }
      } else {
        return {
          ...prev,
          [filterKey]: currentValues.filter((v) => v !== value),
        }
      }
    })
  }

  // Função para expandir filtros agregados na aplicação
  const expandAggregatedFilters = (filters) => {
    const expandedFilters = { ...filters }
    
    Object.entries(filters).forEach(([filterKey, selectedValues]) => {
      if (aggregations[filterKey] && selectedValues && selectedValues.length > 0) {
        const expandedValues = []
        
        selectedValues.forEach(selectedValue => {
          const aggregationConfig = aggregations[filterKey]
          if (aggregationConfig[selectedValue]) {
            // Se o valor selecionado é um grupo agregado, adicionar todos os valores do grupo
            expandedValues.push(...aggregationConfig[selectedValue])
          } else {
            // Se não é um grupo agregado, manter o valor original
            expandedValues.push(selectedValue)
          }
        })
        
        expandedFilters[filterKey] = [...new Set(expandedValues)] // Remove duplicatas
      }
    })
    
    return expandedFilters
  }

  const applyFilters = () => {
    const expandedFilters = expandAggregatedFilters(localFilters)
    updateFilters(expandedFilters)
    handleClose()
  }

  const clearFilters = () => {
    setLocalFilters({})
    updateFilters({})
  }

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "420px" }}>
      <Offcanvas.Header closeButton style={{ backgroundColor: "#2e8b57", color: "white" }}>
        <Offcanvas.Title>Filtros de Dados</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="mb-3 d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Limpar Filtros
          </Button>
          <Button variant="success" size="sm" onClick={applyFilters}>
            <i className="bi bi-funnel-fill me-1"></i>
            Aplicar
          </Button>
        </div>

        <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          {filterConfig.map((config) => {
            const rawValues = getUniqueValues(config.key)
            const sortedValues = sortValues(rawValues, config.key)
            const selectedValues = localFilters[config.key] || []

            if (sortedValues.length === 0) {
              return null // Não mostrar filtros sem valores
            }

            return (
              <div key={config.key} className="mb-4 border-bottom pb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0 text-success">{config.label}</h6>
                  <small className="text-muted">
                    {selectedValues.length > 0 && `(${selectedValues.length} selecionados)`}
                  </small>
                </div>
                
                <div style={{ maxHeight: "200px", overflowY: "auto" }} className="pe-2">
                  {sortedValues.map((value) => (
                    <Form.Check
                      key={`${config.key}-${value}`}
                      type="checkbox"
                      id={`${config.key}-${value}`}
                      label={value}
                      checked={selectedValues.includes(value)}
                      onChange={(e) => handleFilterChange(config.key, value, e.target.checked)}
                      className="mb-2"
                      style={{ fontSize: "0.9rem" }}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-top pt-3 mt-3">
          <Row>
            <Col>
              <Button variant="success" onClick={applyFilters} className="w-100">
                <i className="bi bi-check-circle-fill me-2"></i>
                Aplicar Filtros
              </Button>
            </Col>
          </Row>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default FilterOffcanvas