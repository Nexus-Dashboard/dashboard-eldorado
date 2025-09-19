import { useState } from "react"
import { Container } from "react-bootstrap"
import ConcordanciaComunicacao from "./ConcordanciaComunicacao"
import MeiosBuscarInformacoes from "./MeiosBuscarInformacoes"
import QuestionNavigationComunicacao from "./QuestionNavigationComunicacao"

const ComunicacaoEldorado = () => {
  const [activeQuestion, setActiveQuestion] = useState("concordancia-comunicacao")

  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Comunicação Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      {/* Navegação entre perguntas */}
      <QuestionNavigationComunicacao 
        activeQuestion={activeQuestion} 
        setActiveQuestion={setActiveQuestion} 
      />

      {/* Seção de Concordância sobre Comunicação */}
      {activeQuestion === "concordancia-comunicacao" && <ConcordanciaComunicacao />}

      {/* Seção de Meios para Buscar Informações */}
      {activeQuestion === "meios-buscar-informacoes" && <MeiosBuscarInformacoes />}
    </Container>
  )
}

export default ComunicacaoEldorado