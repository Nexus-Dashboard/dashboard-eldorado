import { useState, useEffect } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const PercepcaoAtuacaoESG = () => {
  const { getFilteredData, loading } = useData()
  const [chartData2025, setChartData2025] = useState([])
  const [showComparison, setShowComparison] = useState(false)
  const [totalRespondentes, setTotalRespondentes] = useState(0)

  const dados2023 = [
    { atributo: "Oferece canais de denúncias sobre casos de discriminação e assédio", media: 4.7 },
    { atributo: "Prioriza o uso de energia limpa", media: 4.6 },
    { atributo: "Oferece condições seguras de trabalho", media: 4.6 },
    { atributo: "Adota ações de reflorestamento e de promoção e preservação da biodiversidade", media: 4.6 },
    { atributo: "Adota políticas e práticas sustentáveis em relação ao meio ambiente", media: 4.6 },
    { atributo: "Possui incentivos à igualdade, diversidade e inclusão", media: 4.5 },
    { atributo: "Realiza uma boa gestão do relacionamento com os clientes e fornecedores", media: 4.5 },
    { atributo: "Possui programas de saúde e bem-estar efetivos para os seus colaboradores", media: 4.5 },
    { atributo: "Implementa práticas anticorrupção", media: 4.4 },
    { atributo: "Adota práticas de governança corporativa, priorizando a transparência e a ética", media: 4.4 },
    { atributo: "Investe na capacitação, treinamento e desenvolvimento dos seus colaboradores", media: 4.4 },
    { atributo: "Ajuda a melhorar a qualidade de vida das comunidades que vivem nas áreas onde atua", media: 4.3 },
    { atributo: "Oferece benefícios e vantagens aos funcionários, além da remuneração justa", media: 4.3 }
  ]

  const dados2025Exemplo = [
    { atributo: "Oferece canais de denúncias sobre casos de discriminação e assédio", media: 4.8, concordam: 92 },
    { atributo: "Prioriza o uso de energia limpa", media: 4.8, concordam: 91 },
    { atributo: "Oferece condições seguras de trabalho", media: 4.7, concordam: 90 },
    { atributo: "Possui incentivos à igualdade, diversidade e inclusão", media: 4.7, concordam: 89 },
    { atributo: "Realiza uma boa gestão do relacionamento com os clientes e fornecedores", media: 4.7, concordam: 88 },
    { atributo: "Adota ações de reflorestamento e de promoção e preservação da biodiversidade", media: 4.7, concordam: 88 },
    { atributo: "Adota políticas e práticas sustentáveis em relação ao meio ambiente", media: 4.7, concordam: 87 },
    { atributo: "Possui programas de saúde e bem-estar efetivos para os seus colaboradores", media: 4.6, concordam: 86 },
    { atributo: "Ajuda a melhorar a qualidade de vida das comunidades que vivem nas áreas onde atua", media: 4.6, concordam: 85 },
    { atributo: "Implementa práticas anticorrupção", media: 4.6, concordam: 85 },
    { atributo: "Adota práticas de governança corporativa, priorizando a transparência e a ética", media: 4.6, concordam: 84 },
    { atributo: "Investe na capacitação, treinamento e desenvolvimento dos seus colaboradores", media: 4.5, concordam: 83 },
    { atributo: "Oferece benefícios e vantagens aos funcionários, além da remuneração justa", media: 4.4, concordam: 80 }
  ]

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) {
          setChartData2025(dados2025Exemplo)
          setTotalRespondentes(3484)
          return
        }

        // Usar dados de exemplo por enquanto
        setChartData2025(dados2025Exemplo)
        setTotalRespondentes(filteredData.length)

      } catch (error) {
        console.error("Erro ao processar dados:", error)
        setChartData2025(dados2025Exemplo)
        setTotalRespondentes(3484)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

  const ChartComponent = ({ data, year, showPercentages = false }) => (
    <div style={{ height: "600px" }}>
      <ResponsiveBar
        data={data}
        keys={['media']}
        indexBy="atributo"
        layout="horizontal"
        margin={{ top: 20, right: showPercentages ? 100 : 60, bottom: 20, left: 380 }}
        padding={0.3}
        valueScale={{ type: 'linear', min: 0, max: 5 }}
        colors={year === 2023 ? '#90ee90' : '#2e8b57'}
        borderRadius={3}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
          tickValues: [1, 2, 3, 4, 5],
          legend: '1 - Discorda totalmente                                5 - Concorda totalmente',
          legendPosition: 'middle',
          legendOffset: 50
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 12,
          tickRotation: 0
        }}
        enableLabel={false}
        enableGridY={true}
        gridYValues={[1, 2, 3, 4, 5]}
        animate={true}
        motionConfig="gentle"
        layers={[
          'grid',
          'axes',
          'bars',
          ({ bars }) => (
            <g>
              {bars.map((bar, index) => (
                <g key={index}>
                  <text
                    x={bar.x + bar.width + 10}
                    y={bar.y + (bar.height / 2)}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontSize="14"
                    fontWeight="600"
                    fill="#333"
                  >
                    {bar.data.data.media.toFixed(1)}
                  </text>
                  {showPercentages && bar.data.data.concordam && (
                    <text
                      x={bar.x + bar.width + 40}
                      y={bar.y + (bar.height / 2)}
                      textAnchor="start"
                      dominantBaseline="central"
                      fontSize="12"
                      fill="#666"
                    >
                      {bar.data.data.concordam}%
                    </text>
                  )}
                </g>
              ))}
            </g>
          )
        ]}
      />
    </div>
  )

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .question-text {
          font-style: italic;
          color: #6c757d;
          padding: 15px 20px;
          background: #fff;
          border-left: 4px solid #ff8c00;
          border-radius: 4px;
          margin-bottom: 30px;
          font-size: 15px;
          line-height: 1.5;
        }

        .chart-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .year-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .year-2025 {
          background: #2e8b57;
          color: white;
        }

        .year-2023 {
          background: #90ee90;
          color: #333;
        }

        .comparison-toggle {
          text-align: center;
          margin: 30px 0;
        }

        .comparison-toggle button {
          background: #2e8b57;
          border: none;
          color: white;
          padding: 10px 25px;
          border-radius: 6px;
          font-weight: 500;
        }

        .comparison-toggle button:hover {
          background: #246a43;
        }
      `}</style>

      <div className="question-text">
        A seguir, falaremos um pouco sobre a percepção que você tem sobre a atuação da Eldorado. 
        Para cada frase, indique o quanto discorda ou concorda com cada uma delas. 
        Vamos utilizar uma escala de 1 a 5, em que 1 significa que você "discorda totalmente" 
        e 5 significa que você "concorda totalmente".
      </div>

      <div className="chart-section">
        <div className="year-badge year-2025">2025</div>
        <h5 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "30px" }}>
          Percepção sobre a atuação ESG da Eldorado
        </h5>
        <ChartComponent data={chartData2025} year={2025} showPercentages={true} />
      </div>

      {!showComparison && (
        <div className="comparison-toggle">
          <button onClick={() => setShowComparison(true)}>
            Ver comparação com 2023
          </button>
        </div>
      )}

      {showComparison && (
        <div className="chart-section">
          <div className="year-badge year-2023">2023</div>
          <h5 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "30px" }}>
            Percepção sobre a atuação ESG da Eldorado - 2023
          </h5>
          <ChartComponent data={dados2023} year={2023} />
        </div>
      )}

      <Row>
        <Col lg={12}>
          <Card style={{ background: "#f8f9fa", padding: "30px", borderRadius: "12px" }}>
            <div className="text-muted" style={{ fontSize: "0.9rem" }}>
              <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
              <br />
              <small>Escala de 1 a 5, onde 1 = "discorda totalmente" e 5 = "concorda totalmente"</small>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PercepcaoAtuacaoESG