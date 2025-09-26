"use client"

import { useState, useEffect } from "react"
import { Offcanvas, Form, Button, Row, Col, Nav, Tab, Badge } from "react-bootstrap"
import { useData } from "../../context/DataContext"

const FilterOffcanvas = ({ show, handleClose }) => {
  const { filters, updateFilters, getUniqueValues, getFilteredData, getFilterStats, getAnalyticFilterValues } = useData()
  const [localFilters, setLocalFilters] = useState({})
  const [activeTab, setActiveTab] = useState("demograficos")
  const [filterStats, setFilterStats] = useState({ total: 0, filtered: 0, percentage: 100 })

  // Configuração dos filtros demográficos (existentes)
  const demograficFilters = [
    { key: "TEMPO_ELDORADO", label: "Tempo de Eldorado" },
    { key: "LOCALIDADE2", label: "Localidade" },
    { key: "PF2_FINAL", label: "Diretorias" },
    { key: "RECORTE_PERFIL_FINAL", label: "Diretorias e Segmentações" },
    { key: "FAIXA_ETARIA", label: "Faixa Etária" },
    { key: "GENERO", label: "Gênero" },
    { key: "RACA_COR", label: "Raça/Cor" },
    { key: "ESCOLARIDADE_0", label: "Escolaridade" }
  ]

  // Configuração dos filtros analíticos (novos)
  const analyticFilters = [
    { 
      key: "P17_TRAJETORIA", 
      label: "Futuro Profissional",
      field: "P17 - Pensando no seu momento atual e no seu futuro profissional, como você enxerga a sua trajetória na Eldorado?",
      type: "categorical"
    },
    { 
      key: "P12_FELICIDADE", 
      label: "Grau de Felicidade no Trabalho",
      field: "P12 - Pensando em uma escala de 0 a 10, em que 0 é nada e 10 é muito, o quanto você se considera feliz no ambiente de trabalho?",
      type: "scale",
      ranges: [
        { label: "Baixa felicidade (0-5)", min: 0, max: 5 },
        { label: "Felicidade média (6-7)", min: 6, max: 7 },
        { label: "Alta felicidade (8-10)", min: 8, max: 10 }
      ]
    },
    {
      key: "SATISFACAO_CATEGORIA",
      label: "Indicador Satisfação & Bem-Estar",
      type: "calculated",
      ranges: [
        { label: "Baixo (0-59)", min: 0, max: 59 },
        { label: "Regular (60-79)", min: 60, max: 79 },
        { label: "Alto (80-89)", min: 80, max: 89 },
        { label: "Excelente (90-100)", min: 90, max: 100 }
      ]
    }
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

  // Configuração de agregações
  const aggregations = {
    "GENERO": {
      "Outros": ["Outros", "Transgênero"]
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
      
      Object.entries(aggregationConfig).forEach(([groupName, groupValues]) => {
        if (groupValues.includes(value)) {
          aggregatedSet.add(groupName)
          wasAggregated = true
        }
      })
      
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
      
      order.forEach(orderItem => {
        const foundValue = aggregatedValues.find(value => 
          value.toLowerCase().trim() === orderItem.toLowerCase().trim()
        )
        if (foundValue) {
          sorted.push(foundValue)
        }
      })
      
      const remainingValues = aggregatedValues.filter(value => 
        !order.some(orderItem => 
          value.toLowerCase().trim() === orderItem.toLowerCase().trim()
        )
      ).sort()
      
      return [...sorted, ...remainingValues]
    }
    
    return aggregatedValues.sort()
  }

  // Processar filtros analíticos
  const processAnalyticFilter = (filterConfig) => {
    if (filterConfig.type === "categorical") {
      // Para futuro profissional, usar valores diretos da pergunta
      return getAnalyticFilterValues(filterConfig.key)
    } 
    else if (filterConfig.type === "scale" || filterConfig.type === "calculated") {
      // Para felicidade e indicadores, usar faixas predefinidas
      return getAnalyticFilterValues(filterConfig.key)
    }

    return []
  }

  // Atualizar estatísticas quando filtros mudam
  useEffect(() => {
    if (getFilterStats) {
      const stats = getFilterStats()
      setFilterStats(stats)
    }
  }, [localFilters, getFilterStats])

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
            expandedValues.push(...aggregationConfig[selectedValue])
          } else {
            expandedValues.push(selectedValue)
          }
        })
        
        expandedFilters[filterKey] = [...new Set(expandedValues)]
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

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(arr => arr && arr.length > 0).length
  }

  return (
    <>
      <style jsx>{`
        .filter-tabs {
          border-bottom: 2px solid #e9ecef;
          margin-bottom: 20px;
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .filter-tabs .nav-link {
          border: none;
          border-bottom: 3px solid transparent;
          color: #212529;
          font-weight: 600;
          padding: 15px 20px;
          border-radius: 0;
          background: transparent;
          font-size: 0.95rem;
        }

        .filter-tabs .nav-link.active {
          border-bottom-color: #2e8b57;
          color: #2e8b57;
          background: white;
          font-weight: 700;
        }

        .filter-tabs .nav-link:hover:not(.active) {
          border-bottom-color: #ff8c00;
          color: #ff8c00;
          background: #fff;
        }

        .filter-summary {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          border-left: 4px solid #2e8b57;
        }

        .filter-summary h6 {
          color: #2e8b57;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .respondents-counter {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 12px 15px;
          margin-bottom: 15px;
          text-align: center;
        }

        .counter-main {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2e8b57;
          margin-bottom: 5px;
        }

        .counter-subtitle {
          font-size: 0.9rem;
          color: #212529;
          font-weight: 600;
        }

        .filter-section {
          margin-bottom: 25px;
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 20px;
        }

        .filter-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .filter-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 12px;
        }

        .filter-title {
          font-weight: 700;
          color: #212529;
          margin: 0;
          font-size: 1rem;
        }

        .filter-count {
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 600;
        }

        .filter-options .form-check-label {
          color: #212529;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .filter-options .form-check-input:checked + .form-check-label {
          color: #2e8b57;
          font-weight: 600;
        }

        .filter-options {
          max-height: 200px;
          overflow-y: auto;
          padding-right: 8px;
        }

        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .active-filter-tag {
          background: #2e8b57;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #2e8b57;
        }

        .active-filter-tag i {
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.3s;
          color: white;
        }

        .active-filter-tag i:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tab-content {
          max-height: calc(100vh - 280px);
          overflow-y: auto;
        }
      `}</style>

      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "480px" }}>
        <Offcanvas.Header closeButton style={{ backgroundColor: "#2e8b57", color: "white" }}>
          <Offcanvas.Title>
            Filtros de Dados
            {getActiveFiltersCount() > 0 && (
              <Badge bg="warning" className="ms-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          {/* Contador de Respondentes */}
          <div className="respondents-counter">
            <div className="counter-main">
              {filterStats.filtered.toLocaleString()}
            </div>
            <div className="counter-subtitle">
              de {filterStats.total.toLocaleString()} respondentes
              {filterStats.filtered !== filterStats.total && (
                <span style={{ color: "#2e8b57", fontWeight: 500 }}>
                  {" "}({filterStats.percentage}% da amostra)
                </span>
              )}
            </div>
          </div>

          {/* Resumo dos filtros ativos */}
          {getActiveFiltersCount() > 0 && (
            <div className="filter-summary">
              <h6>Filtros Aplicados ({getActiveFiltersCount()})</h6>
              <div className="active-filters">
                {Object.entries(localFilters).map(([key, values]) => 
                  values && values.length > 0 ? (
                    <div key={key} className="active-filter-tag">
                      <span>{demograficFilters.find(f => f.key === key)?.label || analyticFilters.find(f => f.key === key)?.label || key}: {values.length}</span>
                      <i 
                        className="bi bi-x" 
                        onClick={() => setLocalFilters(prev => ({ ...prev, [key]: [] }))}
                        title="Remover filtro"
                      ></i>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Controles principais */}
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

          {/* Abas de filtros */}
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="tabs" className="filter-tabs">
              <Nav.Item>
                <Nav.Link eventKey="demograficos">
                  <i className="bi bi-people me-2" style={{ color: 'inherit' }}></i>
                  <strong>Demográficos</strong>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="analiticos">
                  <i className="bi bi-graph-up me-2" style={{ color: 'inherit' }}></i>
                  <strong>Cruzamentos</strong>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="tab-content">
              {/* Aba de Filtros Demográficos */}
              <Tab.Pane eventKey="demograficos">
                {demograficFilters.map((config) => {
                  const rawValues = getUniqueValues(config.key)
                  const sortedValues = sortValues(rawValues, config.key)
                  const selectedValues = localFilters[config.key] || []

                  if (sortedValues.length === 0) return null

                  return (
                    <div key={config.key} className="filter-section">
                      <div className="filter-header">
                        <h6 className="filter-title" style={{ color: '#212529' }}>{config.label}</h6>
                        <small className="filter-count">
                          {selectedValues.length > 0 && `${selectedValues.length} selecionados`}
                        </small>
                      </div>
                      
                      <div className="filter-options">
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
              </Tab.Pane>

              {/* Aba de Filtros Analíticos */}
              <Tab.Pane eventKey="analiticos">
                {analyticFilters.map((config) => {
                  const values = processAnalyticFilter(config)
                  const selectedValues = localFilters[config.key] || []

                  if (values.length === 0) return null

                  return (
                    <div key={config.key} className="filter-section">
                      <div className="filter-header">
                        <h6 className="filter-title" style={{ color: '#212529' }}>{config.label}</h6>
                        <small className="filter-count">
                          {selectedValues.length > 0 && `${selectedValues.length} selecionados`}
                        </small>
                      </div>
                      
                      <div className="filter-options">
                        {values.map((value) => (
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
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

          {/* Aplicar filtros */}
          <div className="border-top pt-3 mt-3">
            <Row>
              <Col>
                <Button variant="success" onClick={applyFilters} className="w-100">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Aplicar Filtros ({filterStats.filtered.toLocaleString()} respondentes)
                </Button>
              </Col>
            </Row>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default FilterOffcanvas