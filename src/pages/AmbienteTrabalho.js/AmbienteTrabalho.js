import { Container, Row, Col } from "react-bootstrap"

const AmbienteTrabalho = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Ambiente de trabalho</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Ambiente de trabalho</h3>
            <p>Esta seção analisará a percepção dos colaboradores sobre o ambiente de trabalho na Eldorado.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default AmbienteTrabalho
