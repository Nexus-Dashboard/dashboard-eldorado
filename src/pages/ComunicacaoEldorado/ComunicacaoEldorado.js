import { Container, Row, Col } from "react-bootstrap"

const ComunicacaoEldorado = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Comunicação Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Comunicação Eldorado</h3>
            <p>Esta seção analisará a efetividade da comunicação interna da Eldorado.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ComunicacaoEldorado