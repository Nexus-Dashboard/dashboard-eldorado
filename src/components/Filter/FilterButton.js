"use client"

import { useState } from "react"
import { Button } from "react-bootstrap"
import FilterOffcanvas from "./FilterOffcanvas"

const FilterButton = () => {
  const [showFilters, setShowFilters] = useState(false)

  const handleClose = () => setShowFilters(false)
  const handleShow = () => setShowFilters(true)

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="filter-btn">
        <i className="bi bi-funnel"></i> Filtros
      </Button>

      <FilterOffcanvas show={showFilters} handleClose={handleClose} />
    </>
  )
}

export default FilterButton
