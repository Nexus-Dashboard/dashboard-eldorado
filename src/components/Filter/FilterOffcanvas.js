"use client"

import { useState, useEffect } from "react"
import { Offcanvas, Form, Button, Row, Col } from "react-bootstrap"
import { useData } from "../../context/DataContext"

const FilterOffcanvas = ({ show, handleClose }) => {
  const { filters, updateFilters, getUniqueValues } = useData()
  const [localFilters, setLocalFilters] = useState({})

  const filterConfig = [
    { key: "CALCULO_TEMPO_ELDORADO", label: "Tempo de Eldorado" },
    { key: "LOCALIDADE", label: "Localidade" },
    { key: "RECORTE_PERFIL_FINAL", label: "Diretorias" },
    { key: "PF3_FINAL", label: "Áreas" },
    { key: "FAIXA_ETARIA", label: "Faixa Etária" },
    { key: "GENERO", label: "Gênero" },
    { key: "RACA_COR", label: "Raça/Cor" },
    { key: "ESCOLARIDADE_0", label: "Escolaridade" },
    { key: "PF8 - Qual a sua orientação sexual?", label: "Orientação Sexual" },
  ]

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
    <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: "400px" }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filtros de Dados</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="mb-3">
          <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>

        {filterConfig.map((config) => {
          const uniqueValues = getUniqueValues(config.key)
          const selectedValues = localFilters[config.key] || []

          return (
            <div key={config.key} className="mb-4">
              <h6 className="fw-bold">{config.label}</h6>
              <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {uniqueValues.map((value) => (
                  <Form.Check
                    key={value}
                    type="checkbox"
                    id={`${config.key}-${value}`}
                    label={value}
                    checked={selectedValues.includes(value)}
                    onChange={(e) => handleFilterChange(config.key, value, e.target.checked)}
                    className="mb-1"
                  />
                ))}
              </div>
            </div>
          )
        })}

        <Row className="mt-4">
          <Col>
            <Button variant="success" onClick={applyFilters} className="w-100">
              Aplicar Filtros
            </Button>
          </Col>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default FilterOffcanvas
