import { Container, Row, Col } from "react-bootstrap"
import Indicadores from "./Indicadores"
import MediaAtributos from "./MediaAtributos"
import IndicadorGeral from "./IndicadorGeral"
import QuestionNavigationIndicador from "./QuestionNavigationIndicador"
import { useState } from "react"

const IndicadorSatisfacao = () => {
  const [activeQuestion, setActiveQuestion] = useState("indicador-geral")

  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Indicador de Satisfação & Bem-Estar Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      {/* Navegação entre perguntas */}
      <QuestionNavigationIndicador
        activeQuestion={activeQuestion}
        setActiveQuestion={setActiveQuestion}
      />

      {/* Seção do Indicador Geral */}
      {activeQuestion === "indicador-geral" && <IndicadorGeral />}

      {/* Seção de Concordância sobre Benefícios */}
      {activeQuestion === "indicadores" && <Indicadores />}

      {/* Seção de Utilização e Avaliação dos Benefícios */}
      {activeQuestion === "media-atributos" && <MediaAtributos />}

      
    </Container>
  )
}

export default IndicadorSatisfacao
