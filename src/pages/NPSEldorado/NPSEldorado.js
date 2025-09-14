import { Container, Row, Col } from "react-bootstrap"

const NPSEldorado = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">NPS Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>NPS Eldorado</h3>
            <p>Esta seção apresentará o Net Promoter Score da Eldorado baseado na pesquisa com colaboradores.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default NPSEldorado
