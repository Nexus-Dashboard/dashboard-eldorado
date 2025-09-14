import { Nav } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useLocation } from "react-router-dom"

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: "/metodologia", label: "01 Metodologia", id: 1 },
    { path: "/perfil-amostra", label: "02 Perfil da amostra", id: 2 },
    { path: "/grau-felicidade", label: "03 Grau de felicidade e perspectivas de futuro", id: 3 },
    { path: "/fatores-motivam", label: "04 Fatores que Motivam Nossa Gente", id: 4 },
    { path: "/saude-emocional", label: "05 Saúde emocional e trabalho", id: 5 },
    { path: "/ambiente-trabalho", label: "06 Ambiente de trabalho", id: 6 },
    { path: "/cultura-eldorado", label: "07 Cultura Eldorado", id: 7 },
    { path: "/lideranca-eldorado", label: "08 Liderança Eldorado", id: 8 },
    { path: "/opiniao-beneficios", label: "09 Opinião sobre benefícios da Eldorado", id: 9 },
    { path: "/diversidade", label: "10 Diversidade, igualdade e inclusão", id: 10 },
    { path: "/comunicacao-eldorado", label: "11 Comunicação Eldorado", id: 11 },
    { path: "/pilares-esg", label: "12 Pilares ESG & percepções sobre a atuação da Eldorado", id: 12 },
    { path: "/indicador-satisfacao", label: "13 Indicador de Satisfação & Bem-Estar Eldorado", id: 13 },
    { path: "/nps-eldorado", label: "14 NPS Eldorado", id: 14 },
    { path: "/comentarios-sugestoes", label: "15 Comentários e sugestões", id: 15 },
    { path: "/consideracoes-finais", label: "16 Considerações finais", id: 16 },
  ]

  return (
    <div className="sidebar">
      <div className="brand-logos">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eldorado_logo-bB4IvqCxEMXmOomzOqD6WQ9v7fIPTC.png"
          alt="Eldorado Brasil"
        />
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nexus-logo-3Lm6A9xw5mHs01qJpT7F2MdGeSNxXY.png"
          alt="Nexus"
        />
      </div>

      <div className="px-3 py-2">
        <h6 className="text-muted mb-3">Pesquisa Nossa Gente Eldorado</h6>
      </div>

      <Nav className="flex-column">
        {menuItems.map((item) => (
          <LinkContainer key={item.id} to={item.path}>
            <Nav.Link className={location.pathname === item.path ? "active" : ""}>{item.label}</Nav.Link>
          </LinkContainer>
        ))}
      </Nav>
    </div>
  )
}

export default Sidebar
