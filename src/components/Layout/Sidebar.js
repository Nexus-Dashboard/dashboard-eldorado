import { Nav, Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { path: "/metodologia", label: "Metodologia", id: 1 },
    { path: "/perfil-amostra", label: "Perfil da amostra", id: 2 },
    { path: "/grau-felicidade", label: "Grau de felicidade e Futuro", id: 3 },
    { path: "/fatores-motivam", label: "Fatores que Motivam", id: 4 },
    { path: "/saude-emocional", label: "Saúde emocional", id: 5 },
    { path: "/ambiente-trabalho", label: "Ambiente de trabalho", id: 6 },
    { path: "/cultura-eldorado", label: "Cultura Eldorado", id: 7 },
    { path: "/lideranca-eldorado", label: "Liderança Eldorado", id: 8 },
    { path: "/opiniao-beneficios", label: "Benefícios da Eldorado", id: 9 },
    { path: "/diversidade", label: "Diversidade & Inclusão", id: 10 },
    { path: "/comunicacao-eldorado", label: "Comunicação", id: 11 },
    { path: "/pilares-esg", label: "Pilares ESG", id: 12 },
    { path: "/indicador-satisfacao", label: "Satisfação & Bem-Estar", id: 13 },
    { path: "/nps-eldorado", label: "NPS Eldorado", id: 14 },
    { path: "/comentarios-sugestoes", label: "Comentários", id: 15 },
    { path: "/consideracoes-finais", label: "Considerações finais", id: 16 },
  ]

  return (
    <div className="sidebar">
      <div className="brand-logos" onClick={() => navigate("/")}>
        <img
          src="eldorado_logo.png"
          alt="Eldorado Brasil"
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="sidebar-title">
        <h6>Pesquisa Nossa Gente</h6>
      </div>

      <div className="sidebar-nav">
        <Nav className="flex-column">
          {menuItems.map((item, index) => (
            <LinkContainer key={item.id} to={item.path}>
              <Nav.Link 
                className={location.pathname === item.path ? "active" : ""}
                style={{ borderBottom: index === menuItems.length - 1 ? 'none' : undefined }}
              >
                <span style={{ 
                  fontSize: '0.7rem', 
                  opacity: 0.7, 
                  marginRight: '6px',
                  fontWeight: '600'
                }}>
                  {String(item.id).padStart(2, '0')}
                </span>
                {item.label}
              </Nav.Link>
            </LinkContainer>
          ))}
        </Nav>
      </div>

      <div className="sidebar-footer mt-auto p-3">
        <Button
          variant="outline-danger"
          size="sm"
          className="w-100"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Sair do Sistema
        </Button>
      </div>
    </div>
  )
}

export default Sidebar