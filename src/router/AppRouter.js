import { Routes, Route } from "react-router-dom"
import Metodologia from "../pages/Metodologia/Metodologia"
import PerfilAmostra from "../pages/PerfilAmostra/PerfilAmostra"
import GrauFelicidade from "../pages/GrauFelicidade/GrauFelicidade"
import FatoresMotivam from "../pages/FatoresMotivam/FatoresMotivam"
import SaudeEmocional from "../pages/SaudeEmocional/SaudeEmocional"
import AmbienteTrabalho from "../pages/AmbienteTrabalho/AmbienteTrabalho"
import CulturaEldorado from "../pages/CulturaEldorado/CulturaEldorado"
import LiderancaEldorado from "../pages/LiderancaEldorado/LiderancaEldorado"
import OpiniaoBeneficios from "../pages/OpiniaoBeneficios/OpiniaoBeneficios"
import Diversidade from "../pages/Diversidade/Diversidade"
import ComunicacaoEldorado from "../pages/ComunicacaoEldorado/ComunicacaoEldorado"
import PilaresESG from "../pages/PilaresESG/PilaresESG"
import IndicadorSatisfacao from "../pages/IndicadorSatisfacao/IndicadorSatisfacao"
import NPSEldorado from "../pages/NPSEldorado/NPSEldorado"
import ComentariosSugestoes from "../pages/ComentariosSugestoes/ComentariosSugestoes"
import ConsideracoesFinais from "../pages/ConsideracoesFinais/ConsideracoesFinais"

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Metodologia />} />
      <Route path="/metodologia" element={<Metodologia />} />
      <Route path="/perfil-amostra" element={<PerfilAmostra />} />
      <Route path="/grau-felicidade" element={<GrauFelicidade />} />
      <Route path="/fatores-motivam" element={<FatoresMotivam />} />
      <Route path="/saude-emocional" element={<SaudeEmocional />} />
      <Route path="/ambiente-trabalho" element={<AmbienteTrabalho />} />
      <Route path="/cultura-eldorado" element={<CulturaEldorado />} />
      <Route path="/lideranca-eldorado" element={<LiderancaEldorado />} />
      <Route path="/opiniao-beneficios" element={<OpiniaoBeneficios />} />
      <Route path="/diversidade" element={<Diversidade />} />
      <Route path="/comunicacao-eldorado" element={<ComunicacaoEldorado />} />
      <Route path="/pilares-esg" element={<PilaresESG />} />
      <Route path="/indicador-satisfacao" element={<IndicadorSatisfacao />} />
      <Route path="/nps-eldorado" element={<NPSEldorado />} />
      <Route path="/comentarios-sugestoes" element={<ComentariosSugestoes />} />
      <Route path="/consideracoes-finais" element={<ConsideracoesFinais />} />
    </Routes>
  )
}

export default AppRouter
