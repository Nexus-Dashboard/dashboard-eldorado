import { Container, Row, Col } from "react-bootstrap"

const ComentariosSugestoes = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Comentários e sugestões</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Comentários e sugestões</h3>
            <p>Esta seção compilará os principais comentários e sugestões dos colaboradores.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ComentariosSugestoes
