import { useState } from "react"
import { Button, Offcanvas, Nav } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const MobileMenu = () => {
  const [show, setShow] = useState(false)
  const location = useLocation()
  const { logout } = useAuth()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const menuItems = [
    { path: "/", label: "Página Inicial", id: 0, icon: "bi-house" },
    { path: "/metodologia", label: "Metodologia", id: 1, icon: "bi-clipboard-data" },
    { path: "/perfil-amostra", label: "Perfil da amostra", id: 2, icon: "bi-people" },
    { path: "/grau-felicidade", label: "Grau de felicidade", id: 3, icon: "bi-emoji-smile" },
    { path: "/fatores-motivam", label: "Fatores que Motivam", id: 4, icon: "bi-lightning" },
    { path: "/saude-emocional", label: "Saúde emocional", id: 5, icon: "bi-heart-pulse" },
    { path: "/ambiente-trabalho", label: "Ambiente de trabalho", id: 6, icon: "bi-building" },
    { path: "/cultura-eldorado", label: "Cultura Eldorado", id: 7, icon: "bi-tree" },
    { path: "/lideranca-eldorado", label: "Liderança Eldorado", id: 8, icon: "bi-person-badge" },
    { path: "/opiniao-beneficios", label: "Benefícios da Eldorado", id: 9, icon: "bi-gift" },
    { path: "/diversidade", label: "Diversidade & Inclusão", id: 10, icon: "bi-rainbow" },
    { path: "/comunicacao-eldorado", label: "Comunicação", id: 11, icon: "bi-chat-dots" },
    { path: "/pilares-esg", label: "Pilares ESG", id: 12, icon: "bi-globe" },
    { path: "/indicador-satisfacao", label: "Satisfação & Bem-Estar", id: 13, icon: "bi-graph-up" },
    { path: "/nps-eldorado", label: "NPS Eldorado", id: 14, icon: "bi-star" },
    { path: "/comentarios-sugestoes", label: "Comentários", id: 15, icon: "bi-chat-square-text" },
    { path: "/consideracoes-finais", label: "Considerações finais", id: 16, icon: "bi-flag-fill" },
  ]

  const handleItemClick = () => {
    handleClose()
  }

  return (
    <>
      <Button
        variant="outline-primary"
        className="mobile-menu-btn d-lg-none"
        onClick={handleShow}
      >
        <img src="menu-4-fill-svgrepo-com.svg" style={{width:'30px'}}/>        
        
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton className="mobile-menu-header">
          <Offcanvas.Title>
            <img
              src="eldorado_logo.png"
              alt="Eldorado Brasil"
              style={{ maxHeight: "40px" }}
            />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="mobile-menu-title">
            <h6>Pesquisa Nossa Gente</h6>
          </div>

          <Nav className="flex-column mobile-menu-nav">
            {menuItems.map((item) => (
              <LinkContainer key={item.id} to={item.path}>
                <Nav.Link
                  className={`mobile-nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={handleItemClick}
                >
                  <i className={`${item.icon} me-3`}></i>
                  <span className="mobile-nav-number">
                    {item.id > 0 ? String(item.id).padStart(2, '0') + " - " : ""}
                  </span>
                  {item.label}
                </Nav.Link>
              </LinkContainer>
            ))}
          </Nav>

          <div className="mobile-menu-footer mt-auto p-3">
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
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default MobileMenu