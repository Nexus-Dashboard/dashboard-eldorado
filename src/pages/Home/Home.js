import { Container, Row, Col, Card } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

const Home = () => {
  const menuItems = [
    { path: "/metodologia", label: "Metodologia", id: 1, icon: "bi-clipboard-data", description: "Entenda como foi realizada a pesquisa" },
    { path: "/perfil-amostra", label: "Perfil da amostra", id: 2, icon: "bi-people", description: "Conheça o perfil dos participantes" },
    { path: "/grau-felicidade", label: "Grau de felicidade e Futuro", id: 3, icon: "bi-emoji-smile", description: "Índices de satisfação e felicidade" },
    { path: "/fatores-motivam", label: "Fatores que Motivam", id: 4, icon: "bi-lightning", description: "O que motiva nossos colaboradores" },
    { path: "/saude-emocional", label: "Saúde emocional", id: 5, icon: "bi-heart-pulse", description: "Bem-estar e saúde mental" },
    { path: "/ambiente-trabalho", label: "Ambiente de trabalho", id: 6, icon: "bi-building", description: "Avaliação do ambiente corporativo" },
    { path: "/cultura-eldorado", label: "Cultura Eldorado", id: 7, icon: "bi-tree", description: "Nossa cultura organizacional" },
    { path: "/lideranca-eldorado", label: "Liderança Eldorado", id: 8, icon: "bi-person-badge", description: "Avaliação da liderança" },
    { path: "/opiniao-beneficios", label: "Benefícios da Eldorado", id: 9, icon: "bi-gift", description: "Opinião sobre benefícios oferecidos" },
    { path: "/diversidade", label: "Diversidade & Inclusão", id: 10, icon: "bi-rainbow", description: "Diversidade e inclusão na empresa" },
    { path: "/comunicacao-eldorado", label: "Comunicação", id: 11, icon: "bi-chat-dots", description: "Comunicação interna e feedback" },
    { path: "/pilares-esg", label: "Pilares ESG", id: 12, icon: "bi-globe", description: "Sustentabilidade e responsabilidade" },
    { path: "/indicador-satisfacao", label: "Satisfação & Bem-Estar", id: 13, icon: "bi-graph-up", description: "Indicadores de satisfação geral" },
    { path: "/nps-eldorado", label: "NPS Eldorado", id: 14, icon: "bi-star", description: "Net Promoter Score da empresa" },
    { path: "/comentarios-sugestoes", label: "Comentários", id: 15, icon: "bi-chat-square-text", description: "Comentários e sugestões" },
    { path: "/consideracoes-finais", label: "Considerações finais", id: 16, icon: "bi-flag-fill", description: "Conclusões e próximos passos" },
  ]

  return (
    <Container fluid>
      <div className="home-header text-center mb-5">
        <div className="home-logos mb-3">
          <img
            src="eldorado_logo.png"
            alt="Eldorado Brasil"
            style={{ maxHeight: "70px", marginRight: "30px" }}
          />
          <img
            src="nexus-logo-preta-2.png.jpg"
            alt="Nexus"
            style={{ maxHeight: "50px" }}
          />
        </div>
        <h1 className="home-title">Pesquisa Nossa Gente Eldorado 2025</h1>
        <p className="home-subtitle text-muted">Dashboard Interativo - Resultados e Insights</p>
        <div className="home-stats">
          <span className="stat-item">
            <strong>3.484</strong> participantes
          </span>
          <span className="stat-separator">•</span>
          <span className="stat-item">
            <strong>63%</strong> de participação
          </span>
          <span className="stat-separator">•</span>
          <span className="stat-item">
            <strong>16</strong> seções
          </span>
        </div>
      </div>

      <Row>
        {menuItems.map((item) => (
          <Col lg={3} md={4} sm={6} xs={12} key={item.id} className="mb-4">
            <LinkContainer to={item.path}>
              <Card className="home-card h-100">
                <Card.Body className="d-flex flex-column">
                  <div className="home-card-header mb-3">
                    <div className="home-card-number">
                      {String(item.id).padStart(2, '0')}
                    </div>
                    <i className={`${item.icon} home-card-icon`}></i>
                  </div>
                  <Card.Title className="home-card-title">{item.label}</Card.Title>
                  <Card.Text className="home-card-description text-muted flex-grow-1">
                    {item.description}
                  </Card.Text>
                  <div className="home-card-footer mt-auto">
                    <span className="home-card-link">
                      Explorar <i className="bi bi-arrow-right ms-1"></i>
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </LinkContainer>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Home