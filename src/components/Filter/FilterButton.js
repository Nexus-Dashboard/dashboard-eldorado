"use client"

import { useState } from "react"
import { Button, Badge } from "react-bootstrap"
import FilterOffcanvas from "./FilterOffcanvas"
import { useData } from "../../context/DataContext"

const FilterButton = () => {
  const [showFilters, setShowFilters] = useState(false)
  const { filters } = useData()

  const handleClose = () => setShowFilters(false)
  const handleShow = () => setShowFilters(true)

  // Contar filtros aplicados
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(arr => arr && arr.length > 0).length
  }

  const activeCount = getActiveFiltersCount()

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="filter-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16">
          <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
        </svg>
        &nbsp;Filtros de dados
        {activeCount > 0 && (
          <Badge bg="warning" className="ms-2" style={{ fontSize: "0.75rem" }}>
            {activeCount}
          </Badge>
        )}
      </Button>

      <FilterOffcanvas show={showFilters} handleClose={handleClose} />
    </>
  )
}

export default FilterButton
