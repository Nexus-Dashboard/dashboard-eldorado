import { useState } from "react"
import { Container } from "react-bootstrap"
import TrabalhoSaudeEmocional from "./TrabalhoSaudeEmocional"
import ImpactoEmocional from "./ImpactoEmocional"
import QuestionNavigationSaude from "./QuestionNavigationSaude"

const SaudeEmocional = () => {
  const [activeQuestion, setActiveQuestion] = useState("trabalho-saude")

  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Saúde emocional e trabalho</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      {/* Navegação entre perguntas */}
      <QuestionNavigationSaude 
        activeQuestion={activeQuestion} 
        setActiveQuestion={setActiveQuestion} 
      />

      {/* Seção de Trabalho e Saúde Emocional */}
      {activeQuestion === "trabalho-saude" && <TrabalhoSaudeEmocional />}

      {/* Seção de Impacto Emocional */}
      {activeQuestion === "impacto-emocional" && <ImpactoEmocional />}
    </Container>
  )
}

export default SaudeEmocional