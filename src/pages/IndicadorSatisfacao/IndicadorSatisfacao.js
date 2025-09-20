import { Container, Row, Col } from "react-bootstrap"
import Indicadores from "./Indicadores"
import MediaAtributos from "./MediaAtributos"
import QuestionNavigationIndicador from "./QuestionNavigationIndicador"
import { useState } from "react"

const IndicadorSatisfacao = () => {
  const [activeQuestion, setActiveQuestion] = useState("indicadores")
  
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

      {/* Seção de Utilização e Avaliação dos Benefícios */}
      {activeQuestion === "media-atributos" && <MediaAtributos />}

      {/* Seção de Concordância sobre Benefícios */}
      {activeQuestion === "indicadores" && <Indicadores />}
    </Container>
  )
}

export default IndicadorSatisfacao
