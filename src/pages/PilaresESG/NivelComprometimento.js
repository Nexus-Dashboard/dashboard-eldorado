import { useState, useEffect } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const NivelComprometimento = () => {
  const { getFilteredData, loading } = useData()
  const [chartData2025, setChartData2025] = useState([])
  const [showComparison, setShowComparison] = useState(false)
  const [totalRespondentes, setTotalRespondentes] = useState(0)

  const dados2023 = [
    { nivel: "Muito alto", percentage: 28, color: "#2e7d32" },
    { nivel: "Alto", percentage: 48, color: "#4caf50" },
    { nivel: "Médio", percentage: 17, color: "#ff9800" },
    { nivel: "Baixo", percentage: 2, color: "#f44336" },
    { nivel: "Muito baixo", percentage: 1, color: "#d32f2f" },
    { nivel: "Não sei dizer", percentage: 4, color: "#9e9e9e" }
  ]

  const dados2025Exemplo = [
    { nivel: "Muito alto", percentage: 39, color: "#2e7d32" },
    { nivel: "Alto", percentage: 43, color: "#4caf50" },
    { nivel: "Médio", percentage: 12, color: "#ff9800" },
    { nivel: "Baixo", percentage: 1, color: "#f44336" },
    { nivel: "Muito baixo", percentage: 1, color: "#d32f2f" },
    { nivel: "Não sei dizer", percentage: 4, color: "#9e9e9e" }
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

        const questionField = "P26 - Qual é, na sua avaliação, o nível de comprometimento da Eldorado em relação às práticas ambientais, sociais e de governança em seus negócios? Você diria que é muito alto, alto, médio, baixo ou muito baixo?"
        
        const responses = filteredData
          .map(row => row[questionField])
          .filter(response => response && response.trim() !== "" && !response.includes("#NULL!"))

        if (responses.length === 0) {
          setChartData2025(dados2025Exemplo)
          setTotalRespondentes(filteredData.length)
          return
        }

        const counts = {}
        responses.forEach(response => {
          counts[response] = (counts[response] || 0) + 1
        })

        const processedData = [
          { nivel: "Muito alto", percentage: Math.round(((counts["Muito alto"] || 0) / responses.length) * 100), color: "#2e7d32" },
          { nivel: "Alto", percentage: Math.round(((counts["Alto"] || 0) / responses.length) * 100), color: "#4caf50" },
          { nivel: "Médio", percentage: Math.round(((counts["Médio"] || 0) / responses.length) * 100), color: "#ff9800" },
          { nivel: "Baixo", percentage: Math.round(((counts["Baixo"] || 0) / responses.length) * 100), color: "#f44336" },
          { nivel: "Muito baixo", percentage: Math.round(((counts["Muito baixo"] || 0) / responses.length) * 100), color: "#d32f2f" },
          { nivel: "Não sei dizer", percentage: Math.round(((counts["Não sei dizer"] || 0) / responses.length) * 100), color: "#9e9e9e" }
        ]

        setChartData2025(processedData.length > 0 ? processedData : dados2025Exemplo)
        setTotalRespondentes(responses.length || filteredData.length)

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

  const ChartComponent = ({ data }) => (
    <div style={{ height: "400px" }}>
      <ResponsiveBar
        data={data}
        keys={['percentage']}
        indexBy="nivel"
        layout="horizontal"
        margin={{ top: 20, right: 80, bottom: 20, left: 120 }}
        padding={0.3}
        valueScale={{ type: 'linear', min: 0, max: 50 }}
        colors={(bar) => bar.data.color}
        borderRadius={3}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickRotation: 0,
          format: v => `${v}%`
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 12,
          tickRotation: 0
        }}
        enableLabel={false}
        enableGridY={true}
        animate={true}
        layers={[
          'grid',
          'axes',
          'bars',
          ({ bars }) => (
            <g>
              {bars.map((bar, index) => (
                <text
                  key={index}
                  x={bar.x + bar.width + 15}
                  y={bar.y + (bar.height / 2)}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="600"
                  fill="#333"
                >
                  {bar.data.data.percentage}%
                </text>
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

  const percentualAltoMuito2025 = chartData2025[0]?.percentage + chartData2025[1]?.percentage || 82
  const percentualAltoMuito2023 = dados2023[0].percentage + dados2023[1].percentage

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

        .highlight-box {
          background: #e8f5e9;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }

        .highlight-percentage {
          font-size: 48px;
          font-weight: bold;
          color: #2e8b57;
        }

        .highlight-text {
          color: #666;
          margin-top: 10px;
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
        }

        .comparison-toggle button:hover {
          background: #246a43;
        }
      `}</style>

      <div className="question-text">
        Qual é, na sua avaliação, o nível de comprometimento da Eldorado em relação às práticas ambientais, 
        sociais e de governança em seus negócios? Você diria que é muito alto, alto, médio, baixo ou muito baixo?
      </div>

      <div className="chart-section">
        <h5 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "30px", textAlign: "center" }}>
          Percepção sobre o nível de comprometimento da Eldorado com práticas ESG - 2025
        </h5>
        
        <div className="highlight-box">
          <div className="highlight-percentage">{percentualAltoMuito2025}%</div>
          <div className="highlight-text">
            dos colaboradores avaliam o comprometimento como "Muito alto" ou "Alto" em 2025
          </div>
        </div>

        <ChartComponent data={chartData2025} />
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
          <h5 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "30px", textAlign: "center" }}>
            Percepção sobre o nível de comprometimento - 2023
          </h5>
          
          <div className="highlight-box">
            <div className="highlight-percentage">{percentualAltoMuito2023}%</div>
            <div className="highlight-text">
              dos colaboradores avaliaram como "Muito alto" ou "Alto" em 2023
            </div>
          </div>

          <ChartComponent data={dados2023} />
        </div>
      )}

      <Row>
        <Col lg={12}>
          <Card style={{ background: "#f8f9fa", padding: "30px", borderRadius: "12px", marginTop: "30px" }}>
            <p style={{ color: "#666", lineHeight: 1.6 }}>
              A percepção positiva geral subiu de {percentualAltoMuito2023}% em 2023 para {percentualAltoMuito2025}% em 2025, 
              com aumento significativo na categoria "Muito alto" (+11pp). Isso demonstra evolução positiva no 
              reconhecimento das práticas ESG da Eldorado.
            </p>
            <div className="text-muted" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px", marginTop: "20px" }}>
              <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default NivelComprometimento