import { Container, Row, Col } from "react-bootstrap"

const GrauFelicidade = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Grau de felicidade e perspectivas de futuro</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Grau de felicidade e perspectivas de futuro</h3>
            <p>Esta seção analisará o grau de felicidade dos colaboradores e suas perspectivas de futuro.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default GrauFelicidade