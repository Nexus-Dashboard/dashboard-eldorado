// src/components/PerfilAmostra.js

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const PerfilAmostra = () => {
  const { getFilteredData, loading } = useData()
  const [chartData, setChartData] = useState({
    genero: [],
    orientacaoSexual: [],
    faixaEtaria: [],
    escolaridade: [],
    racaCor: [],
    tempoEldorado: [],
    diretoria: [],
    localidade: []
  })
  const [totalRespondentes, setTotalRespondentes] = useState(0)

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) return

        setTotalRespondentes(filteredData.length)

        // **ALTERAÇÃO AQUI: Simplificando a função getFieldValue**
        const getFieldValue = (row, fieldName) => {
            // Agora 'row' é um objeto, então podemos acessar a propriedade diretamente.
            return row ? row[fieldName] || "" : ""
        }

        const calculatePercentages = (data, fieldName) => {
          const counts = {}
          
          const validData = data.filter(row => {
            const value = getFieldValue(row, fieldName)
            return value && 
                   value.toString().trim() !== "" && 
                   !value.toString().includes("#NULL!") &&
                   value.toString().toLowerCase() !== "null"
          })

          validData.forEach(row => {
            const value = getFieldValue(row, fieldName)
            if (value) {
              counts[value] = (counts[value] || 0) + 1
            }
          })

          const total = validData.length
          return Object.entries(counts)
            .map(([key, count]) => ({
              categoria: key,
              valor: count,
              percentage: total > 0 ? Math.round((count / total) * 100) : 0
            }))
            .sort((a, b) => b.percentage - a.percentage)
        }
        
        // As colunas agora correspondem exatamente aos cabeçalhos do seu JSON
        setChartData({
          genero: calculatePercentages(filteredData, 'GENERO'),
          orientacaoSexual: calculatePercentages(filteredData, 'PF8 - Qual a sua orientação sexual?'),
          faixaEtaria: calculatePercentages(filteredData, 'FAIXA_ETARIA'),
          escolaridade: calculatePercentages(filteredData, 'ESCOLARIDADE_0'),
          racaCor: calculatePercentages(filteredData, 'RACA_COR'),
          tempoEldorado: calculatePercentages(filteredData, 'TEMPO_ELDORADO'),
          diretoria: calculatePercentages(filteredData, 'RECORTE_PERFIL_FINAL'),
          localidade: calculatePercentages(filteredData, 'LOCALIDADE2')
        })

      } catch (error) {
        console.error("Erro ao processar dados:", error)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])
  
  // O restante do seu componente continua igual...
  const commonBarConfig = {
    margin: { top: 10, right: 60, bottom: 20, left: 120 },
    padding: 0.2,
    layout: 'horizontal',
    valueScale: { type: 'linear' },
    indexScale: { type: 'band', round: true },
    colors: ['#2e8b57'],
    borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
    axisTop: null,
    axisRight: null,
    axisBottom: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      format: value => `${value}%`
    },
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0
    },
    labelSkipWidth: 12,
    labelSkipHeight: 12,
    labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
    animate: true,
    motionStiffness: 90,
    motionDamping: 15
  }

  const HorizontalBarChart = ({ data, height = 300 }) => (
    <div style={{ height }}>
      <ResponsiveBar
        data={data}
        keys={['percentage']}
        indexBy="categoria"
        {...commonBarConfig}
        label={d => `${d.data.percentage}%`} // Correção: Acessar 'percentage' via d.data
      />
    </div>
  )

  const DataTable = ({ data, title }) => (
    <Card className="chart-card h-100">
      <Card.Header>
        <h6 className="mb-0">{title}</h6>
      </Card.Header>
      <Card.Body className="p-0">
        <Table striped bordered hover className="mb-0 data-table" size="sm">
          <thead>
            <tr>
              <th>{title}</th>
              <th>Entrevistas</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((item, index) => (
              <tr key={index}>
                <td>{item.categoria}</td>
                <td>{item.valor.toLocaleString()}</td>
                <td>{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )

  if (loading) {
    return (
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Perfil da amostra</h1>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>
        <div className="text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <>
      <style jsx>{`
        .chart-card {
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .chart-card .card-header {
          background-color: #2e8b57 !important;
          color: white !important;
          font-weight: 600;
          padding: 12px 20px;
          border-bottom: none;
        }

        .chart-card .card-body {
          padding: 20px;
        }

        .data-table {
          font-size: 0.9rem;
        }

        .data-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333333;
          border-color: #dee2e6;
        }

        .data-table td {
          border-color: #dee2e6;
          vertical-align: middle;
        }

        .ilustracao-placeholder {
          background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .media-badge {
          background-color: #2e8b57;
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          display: inline-block;
          font-weight: 600;
          text-align: center;
          min-width: 100px;
        }

        .base-info {
          font-size: 0.9rem;
          color: #6c757d;
          border-top: 2px solid #ff8c00;
          padding-top: 10px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .chart-card .card-body {
            padding: 15px;
          }
          
          .ilustracao-placeholder {
            min-height: 150px;
            padding: 20px;
          }
        }
      `}</style>

      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Perfil da amostra</h1>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>

        {/* Primeira linha - Perfil Demográfico */}
        <Row className="mb-4">
          <Col lg={4}>
            <Card className="chart-card h-100">
              <Card.Header>
                <h6 className="mb-0">Gênero</h6>
              </Card.Header>
              <Card.Body>
                <HorizontalBarChart data={chartData.genero} height={250} />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="chart-card h-100">
              <Card.Header>
                <h6 className="mb-0">Orientação Sexual</h6>
              </Card.Header>
              <Card.Body>
                <HorizontalBarChart data={chartData.orientacaoSexual} height={250} />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="chart-card h-100">
              <Card.Header>
                <h6 className="mb-0">Faixa etária</h6>
              </Card.Header>
              <Card.Body>
                <HorizontalBarChart data={chartData.faixaEtaria} height={200} />
                <div className="ilustracao-placeholder mt-3" style={{ minHeight: '100px' }}>
                  <small className="text-muted">Ilustração representativa</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Segunda linha - Escolaridade e Raça/Cor */}
        <Row className="mb-4">
          <Col lg={6}>
            <Card className="chart-card h-100">
              <Card.Header>
                <h6 className="mb-0">Escolaridade</h6>
              </Card.Header>
              <Card.Body>
                <HorizontalBarChart data={chartData.escolaridade} height={300} />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="chart-card h-100">
              <Card.Header>
                <h6 className="mb-0">Cor/raça</h6>
              </Card.Header>
              <Card.Body>
                <HorizontalBarChart data={chartData.racaCor} height={300} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Terceira linha - Perfil Profissional */}
        <div className="page-header mt-5">
          <h2 className="page-title">Perfil profissional</h2>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>

        <Row className="mb-4">
          <Col lg={4}>
            <DataTable data={chartData.diretoria} title="Diretoria" />
          </Col>

          <Col lg={4}>
            <Card className="chart-card h-100">
              <Card.Header>
                <h6 className="mb-0">Tempo de Eldorado</h6>
              </Card.Header>
              <Card.Body>
                <HorizontalBarChart data={chartData.tempoEldorado} height={250} />
                <div className="text-center mt-3">
                  <div className="media-badge">
                    <div>Média</div>
                    <div><strong>5 anos</strong></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <div className="ilustracao-placeholder h-100">
              <div>
                <i className="bi bi-people-fill" style={{ fontSize: '3rem', color: '#2e8b57', marginBottom: '10px' }}></i>
                <p className="text-muted mb-0">Ilustração representativa</p>
                <p className="text-muted">dos colaboradores</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Localidade */}
        <Row className="mb-4">
          <Col lg={6}>
            <DataTable data={chartData.localidade} title="Localidade" />
          </Col>
          <Col lg={6}>
            <div className="ilustracao-placeholder h-100">
              <div>
                <i className="bi bi-geo-alt-fill" style={{ fontSize: '3rem', color: '#2e8b57', marginBottom: '10px' }}></i>
                <p className="text-muted mb-0">Representação das</p>
                <p className="text-muted">localidades da Eldorado</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="mt-4">
          <Col>
            <div className="base-info">
              <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default PerfilAmostra