import { Container, Row, Col } from "react-bootstrap"

const IndicadorSatisfacao = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Indicador de Satisfação & Bem-Estar Eldorado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Indicador de Satisfação & Bem-Estar Eldorado</h3>
            <p>Esta seção apresentará os indicadores de satisfação e bem-estar dos colaboradores.</p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default IndicadorSatisfacao