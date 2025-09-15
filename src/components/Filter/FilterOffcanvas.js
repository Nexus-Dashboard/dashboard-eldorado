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
    { key: "RECORTE_PERFIL_FINAL", label: "Diretorias" },
    { key: "PF3_FINAL", label: "Áreas" },
    { key: "FAIXA_ETARIA", label: "Faixa Etária" },
    { key: "GENERO", label: "Gênero" },
    { key: "RACA_COR", label: "Raça/Cor" },
    { key: "ESCOLARIDADE_0", label: "Escolaridade" },
    { key: "PF8 - Qual a sua orientação sexual?", label: "Orientação Sexual" },
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
      "Transgênero",
      "Prefiro não declarar",
      "Outros"
    ],
    "RACA_COR": [
      "Branco",
      "Preto", 
      "Pardo",
      "Prefiro não declarar",
      "Outros"
    ],
    "PF8 - Qual a sua orientação sexual?": [
      "Heterossexual: atração por pessoas do sexo oposto.",
      "Homossexual: atração por pessoas do mesmo sexo.", 
      "Bissexual: atração por ambos os sexos.",
      "Assexual: atração por nenhum sexo. Embora a pessoa não sinta desejo sexual, é capaz de manter um relacionamento amor",
      "Pansexual: atração por pessoas, independentemente do sexo.",
      "Não se identificou",
      "Outra"
    ]
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

  // Função para ordenar valores conforme configuração
  const sortValues = (values, filterKey) => {
    const validValues = filterValidValues(values)
    
    if (customOrders[filterKey]) {
      const order = customOrders[filterKey]
      const sorted = []
      
      // Primeiro, adicionar valores na ordem específica
      order.forEach(orderItem => {
        const foundValue = validValues.find(value => 
          value.toLowerCase().trim() === orderItem.toLowerCase().trim()
        )
        if (foundValue) {
          sorted.push(foundValue)
        }
      })
      
      // Depois, adicionar valores que não estão na ordem específica (alfabeticamente)
      const remainingValues = validValues.filter(value => 
        !order.some(orderItem => 
          value.toLowerCase().trim() === orderItem.toLowerCase().trim()
        )
      ).sort()
      
      return [...sorted, ...remainingValues]
    }
    
    // Para filtros sem ordem específica, ordenar alfabeticamente
    return validValues.sort()
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

  const applyFilters = () => {
    updateFilters(localFilters)
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