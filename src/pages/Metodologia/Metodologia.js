import { Container, Row, Col } from "react-bootstrap"

const Metodologia = () => {
  return (
    <Container fluid>
      <div className="page-header">
        <h1 className="page-title">O que foi realizado</h1>
        <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
      </div>

      <Row>
        <Col lg={12}>
          <div className="methodology-content">
            <div className="mb-4">
              <p>
                Para a <strong>Pesquisa Nossa Gente Eldorado 2025</strong>, a Nexus - Pesquisa e Inteligência de Dados
                conduziu uma pesquisa de opinião com os colaboradores da Eldorado com o objetivo de aprofundar o
                entendimento sobre a experiência interna dos profissionais.
              </p>

              <p>
                A pesquisa contou com a participação de{" "}
                <strong>
                  3.484 colaboradores (63% do total de pessoas empregadas na empresa no período da pesquisa)
                </strong>
                . Foram aplicadas entrevistas presenciais com funcionários terceirizados e questionários online via
                autopreenchimento, assegurando acessibilidade e alcance a diferentes perfis e áreas da empresa.
              </p>

              <p>
                A coleta de dados foi realizada entre os dias <strong>20 de maio e 20 de junho de 2025</strong>. O
                questionário foi construído com linguagem acessível, tempo médio de resposta de 20 minutos e foco em
                gerar indicadores relevantes para orientar ações de melhoria contínua no ambiente de trabalho.
              </p>

              <p>
                As segmentações demostram tendências, os dados cujas bases apresentam número insuficiente para análise
                estatística deverão ser observados com cautela devido à baixa incidência amostral.
              </p>

              <p>
                <strong>Devido ao arredondamento dos dados, a soma dos percentuais pode variar entre 99% e 101%</strong>
              </p>
            </div>

            <div>
              <img
                src="eldorado-forest-illustration-with-trees-and-indust.jpg"
                alt="Ilustração da Eldorado com floresta e indústria"
                className="eldorado-illustration"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>            

            <div className="d-flex justify-content-between align-items-center mt-4">
              <img
                src="eldorado_logo.png"
                alt="Eldorado Brasil"
                style={{ maxHeight: "50px" }}
              />
              <img
                src="nexus-logo-preta-2.png.jpg"
                alt="Nexus"
                style={{ maxHeight: "50px" }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Metodologia
