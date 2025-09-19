import { useState } from "react"
import { Container } from "react-bootstrap"
import UtilizacaoAvaliacaoBeneficios from "./UtilizacaoAvaliacaoBeneficios"
import ConcordanciaBeneficios from "./ConcordanciaBeneficios"
import QuestionNavigationBeneficios from "./QuestionNavigationBeneficios"

const OpiniaoBeneficios = () => {
  const [activeQuestion, setActiveQuestion] = useState("utilizacao-avaliacao")

  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Opinião sobre benefícios da Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      {/* Navegação entre perguntas */}
      <QuestionNavigationBeneficios 
        activeQuestion={activeQuestion} 
        setActiveQuestion={setActiveQuestion} 
      />

      {/* Seção de Utilização e Avaliação dos Benefícios */}
      {activeQuestion === "utilizacao-avaliacao" && <UtilizacaoAvaliacaoBeneficios />}

      {/* Seção de Concordância sobre Benefícios */}
      {activeQuestion === "concordancia-beneficios" && <ConcordanciaBeneficios />}
    </Container>
  )
}

export default OpiniaoBeneficios