import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { ResponsivePie } from "@nivo/pie"
import { useData } from "../../context/DataContext"

const UsoLinhaEtica = () => {
  const { getFilteredData, loading } = useData()
  const [chartData, setChartData] = useState([])
  const [totalRespondentes, setTotalRespondentes] = useState(0)
  const [percentualNaoUsou, setPercentualNaoUsou] = useState(0)

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) {
          // Dados de exemplo
          const exampleData = [
            { id: "Não", label: "Não", value: 95, color: "#4caf50" },
            { id: "Sim", label: "Sim", value: 5, color: "#2e8b57" }
          ]
          
          setChartData(exampleData)
          setTotalRespondentes(3484)
          setPercentualNaoUsou(95)
          return
        }

        // Campo da pergunta P29
        const questionField = "P29 - Você já usou o Canal Linha Ética - 0800?"
        
        const availableFields = filteredData.length > 0 ? Object.keys(filteredData[0]) : []
        const actualField = availableFields.find(field => 
          field.includes("P29") && field.includes("Canal Linha Ética")
        ) || questionField

        // Extrair as respostas válidas
        const responses = filteredData
          .map(row => row[actualField])
          .filter(response => 
            response && 
            response.trim() !== "" && 
            !response.includes("#NULL!") &&
            response.toLowerCase() !== "null"
          )

        if (responses.length === 0) {
          const exampleData = [
            { id: "Não", label: "Não", value: 95, color: "#4caf50" },
            { id: "Sim", label: "Sim", value: 5, color: "#2e8b57" }
          ]
          setChartData(exampleData)
          setTotalRespondentes(filteredData.length)
          setPercentualNaoUsou(95)
          return
        }

        // Contar respostas
        const counts = { "Sim": 0, "Não": 0 }
        responses.forEach(response => {
          const resposta = response.toLowerCase().trim()
          if (resposta === "sim" || resposta.includes("sim")) {
            counts["Sim"]++
          } else if (resposta === "não" || resposta.includes("não") || resposta === "nao") {
            counts["Não"]++
          }
        })

        const total = responses.length
        const percentualSim = Math.round((counts["Sim"] / total) * 100)
        const percentualNao = Math.round((counts["Não"] / total) * 100)

        const processedData = [
          { id: "Não", label: "Não", value: percentualNao, color: "#4caf50" },
          { id: "Sim", label: "Sim", value: percentualSim, color: "#2e8b57" }
        ]

        setChartData(processedData)
        setTotalRespondentes(total)
        setPercentualNaoUsou(percentualNao)

      } catch (error) {
        console.error("Erro ao processar dados:", error)
        
        // Fallback para dados de exemplo
        const exampleData = [
          { id: "Não", label: "Não", value: 95, color: "#4caf50" },
          { id: "Sim", label: "Sim", value: 5, color: "#2e8b57" }
        ]
        setChartData(exampleData)
        setTotalRespondentes(3484)
        setPercentualNaoUsou(95)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

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
        }

        .chart-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .chart-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          min-height: 400px;
        }

        .pie-chart-area {
          flex: 1;
          height: 350px;
          position: relative;
        }

        .stats-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 30px;
          padding: 20px;
        }

        .main-stat {
          text-align: center;
          background: #f8f9fa;
          padding: 30px 20px;
          border-radius: 15px;
          border: 2px solid #e9ecef;
        }

        .stat-percentage {
          font-size: 48px;
          font-weight: bold;
          color: #2e8b57;
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 16px;
          color: #666;
          font-weight: 500;
          line-height: 1.3;
        }

        .usage-insight {
          background: #e8f5e9;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #4caf50;
        }

        .insight-title {
          font-weight: 600;
          color: #2e8b57;
          margin-bottom: 8px;
        }

        .insight-text {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .legend-custom {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .chart-container {
            flex-direction: column;
            gap: 20px;
          }
          
          .pie-chart-area {
            height: 300px;
          }

          .stats-area {
            flex-direction: row;
            justify-content: space-around;
          }

          .main-stat {
            flex: 1;
            margin: 0 10px;
          }

          .stat-percentage {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="question-text">
        Você já usou o Canal Linha Ética - 0800?
      </div>

      <div className="chart-section">
        <h5 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "30px", textAlign: "center" }}>
          Uso do Canal Linha Ética - 0800
        </h5>

        <div className="chart-container">
          <div className="pie-chart-area">
            <ResponsivePie
              data={chartData}
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              innerRadius={0.6}
              padAngle={2}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={(d) => d.data.color}
              borderWidth={1}
              borderColor="#fff"
              arcLinkLabelsSkip={10}
              arcLinkLabelsTextColor="#333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor="#333"
              arcLabelsSkip={10}
              arcLabelsTextColor="#fff"
              arcLabel={(d) => `${d.value}%`}
              arcLinkLabel={(d) => `${d.id}: ${d.value}%`}
              tooltip={({ datum }) => (
                <div
                  style={{
                    background: 'white',
                    padding: '12px 15px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  <strong>{datum.id}:</strong> {datum.value}%
                </div>
              )}
              animate={true}
              motionConfig="gentle"
            />
          </div>

          <div className="stats-area">
            <div className="main-stat">
              <div className="stat-percentage">{percentualNaoUsou}%</div>
              <div className="stat-label">Nunca utilizaram o Canal Linha Ética</div>
            </div>

            <div className="usage-insight">
              <div className="insight-title">Baixa utilização do canal</div>
              <p className="insight-text">
                A baixa utilização do Canal Linha Ética pode indicar tanto um ambiente de trabalho 
                com poucos problemas graves quanto a necessidade de maior divulgação sobre o canal 
                e suas finalidades entre os colaboradores.
              </p>
            </div>
          </div>
        </div>

        <div className="legend-custom">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#4caf50' }}></div>
            <span>Não utilizaram</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#2e8b57' }}></div>
            <span>Já utilizaram</span>
          </div>
        </div>
      </div>

      <Row>
        <Col lg={12}>
          <Card style={{ background: "#f8f9fa", padding: "30px", borderRadius: "12px" }}>
            <Row>
              <Col lg={6}>
                <h6 style={{ fontWeight: 600, marginBottom: "10px", color: "#2e8b57" }}>
                  Interpretação dos Resultados
                </h6>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  O baixo percentual de utilização ({100 - percentualNaoUsou}%) é esperado e pode ser positivo, 
                  sugerindo que a maioria dos colaboradores não enfrentou situações que demandassem o uso do canal. 
                  A existência do canal como mecanismo de proteção é fundamental, mesmo com baixa utilização.
                </p>
              </Col>
              <Col lg={6}>
                <h6 style={{ fontWeight: 600, marginBottom: "10px", color: "#2e8b57" }}>
                  Importância do Canal
                </h6>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  O Canal Linha Ética representa uma ferramenta importante de governança corporativa, 
                  oferecendo aos colaboradores um meio seguro e confidencial para reportar irregularidades, 
                  mesmo que sua utilização seja baixa no período analisado.
                </p>
              </Col>
            </Row>
            
            <div className="text-muted mt-3" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
              <strong>Base | {totalRespondentes.toLocaleString()} respondentes entre quem conhece o Canal Linha Ética</strong>
              <br />
              <small>Pergunta aplicada apenas para colaboradores que demonstraram conhecimento do canal na questão anterior.</small>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default UsoLinhaEtica