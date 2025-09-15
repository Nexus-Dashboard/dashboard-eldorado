import { Container, Row, Col } from "react-bootstrap"

const LiderancaEldorado = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Liderança Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Liderança Eldorado</h3>
            <p>Esta seção avaliará a percepção dos colaboradores sobre a liderança na Eldorado.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default LiderancaEldorado