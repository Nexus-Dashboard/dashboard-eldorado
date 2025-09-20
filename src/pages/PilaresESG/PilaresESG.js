import { useState } from "react"
import { Container } from "react-bootstrap"
import QuestionNavigationESG from "./QuestionNavigationESG"
import PercepcaoAtuacaoESG from "./PercepcaoAtuacaoESG"
import NivelComprometimento from "./NivelComprometimento"
import ConhecimentoAcoesESG from "./ConhecimentoAcoesESG"
import ParticipacaoIniciativas from "./ParticipacaoIniciativas"
import UsoLinhaEtica from "./UsoLinhaEtica"
import ProgramaCompliance from "./ProgramaCompliance"

const PilaresESG = () => {
  const [activeQuestion, setActiveQuestion] = useState("percepcao-atuacao")

  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Pilares ESG & percepções sobre a atuação da Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <QuestionNavigationESG 
        activeQuestion={activeQuestion} 
        setActiveQuestion={setActiveQuestion} 
      />

      {activeQuestion === "percepcao-atuacao" && <PercepcaoAtuacaoESG />}
      {activeQuestion === "nivel-comprometimento" && <NivelComprometimento />}
      {activeQuestion === "conhecimento-acoes" && <ConhecimentoAcoesESG />}
      {activeQuestion === "participacao-iniciativas" && <ParticipacaoIniciativas />}
      {activeQuestion === "uso-linha-etica" && <UsoLinhaEtica />}
      {activeQuestion === "programa-compliance" && <ProgramaCompliance />}
    </Container>
  )
}

export default PilaresESG