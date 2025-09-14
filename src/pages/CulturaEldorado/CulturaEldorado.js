import { Container, Row, Col } from "react-bootstrap"

const CulturaEldorado = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Cultura Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Cultura Eldorado</h3>
            <p>Esta seção explorará a percepção dos colaboradores sobre a cultura organizacional da Eldorado.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CulturaEldorado
