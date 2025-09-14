import { Container, Row, Col } from "react-bootstrap"

const PerfilAmostra = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">Perfil da amostra</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado | 6</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <h3>Perfil da amostra</h3>
            <p>
              Esta seção apresentará os dados demográficos dos participantes da pesquisa, incluindo gênero, faixa
              etária, escolaridade, orientação sexual e raça/cor.
            </p>
            <p>
              <em>Conteúdo em desenvolvimento...</em>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default PerfilAmostra
