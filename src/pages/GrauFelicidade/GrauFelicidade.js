import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"
import TrajetoriaEldorado from "./TrajetoriaEldorado"

const GrauFelicidade = () => {
  const { getFilteredData, loading } = useData()
  const [showComparison, setShowComparison] = useState(false)
  const [data2025, setData2025] = useState(null)
  const [activeSection, setActiveSection] = useState("felicidade") // Para controlar qual seção mostrar

  // ========================================================================
  // DADOS ESTÁTICOS DE 2023 - Atualize aqui com base no relatório anterior
  // ========================================================================
  const dados2023 = {
    media: 8.6,
    distribuicao: [
      { score: "0", percentage: 0 },
      { score: "1", percentage: 0 },
      { score: "2", percentage: 1 },
      { score: "3", percentage: 1 },
      { score: "4", percentage: 1 },
      { score: "5", percentage: 4 },
      { score: "6", percentage: 3 },
      { score: "7", percentage: 8 },
      { score: "8", percentage: 22 },
      { score: "9", percentage: 20 },
      { score: "10", percentage: 40 }
    ],
    categorias: {
      baixa: 7,
      media: 11,
      alta: 82
    }
  }

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) return

        const questionField = "P12 - Pensando em uma escala de 0 a 10, em que 0 é nada e 10 é muito, o quanto você se considera feliz no ambiente de trabalho?"
        
        const scores = filteredData
          .map(row => {
            const value = row[questionField]
            return value !== undefined && value !== null && value !== "" ? parseInt(value) : null
          })
          .filter(score => score !== null && !isNaN(score) && score >= 0 && score <= 10)

        if (scores.length === 0) return

        const media = scores.reduce((acc, score) => acc + score, 0) / scores.length

        const distribuicao = []
        for (let i = 0; i <= 10; i++) {
          const count = scores.filter(score => score === i).length
          distribuicao.push({
            score: i.toString(),
            percentage: Math.round((count / scores.length) * 100)
          })
        }

        const baixa = scores.filter(s => s <= 5).length
        const media_cat = scores.filter(s => s >= 6 && s <= 7).length
        const alta = scores.filter(s => s >= 8).length

        setData2025({
          media: media.toFixed(1),
          distribuicao: distribuicao,
          categorias: {
            baixa: Math.round((baixa / scores.length) * 100),
            media: Math.round((media_cat / scores.length) * 100),
            alta: Math.round((alta / scores.length) * 100)
          },
          total: scores.length
        })

      } catch (error) {
        console.error("Erro ao processar dados:", error)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

  if (loading || !data2025) {
    return (
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Grau de felicidade no ambiente de trabalho</h1>
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

  const ChartComponent = ({ data, year }) => {
    const chartData = data.distribuicao.map(item => ({
      score: item.score,
      percentage: item.percentage
    }))

    return (
      <div className="chart-container">
        {/* Header com categorias e badge de média */}
        <div className="chart-header">
          <div className="categories-header">
            {/* Linha Baixa */}
            <div className="category-line baixa-line">
              <div className="line-dot start-dot"></div>
              <div className="line-segment"></div>
              <div className="category-label">
                <span className="category-title baixa">Baixa</span>
                <span className="category-value">{data.categorias.baixa}%</span>
              </div>
              <div className="line-segment"></div>
              <div className="line-dot end-dot"></div>
            </div>
            
            {/* Linha Média */}
            <div className="category-line media-line">
              <div className="line-dot start-dot"></div>
              <div className="line-segment"></div>
              <div className="category-label">
                <span className="category-title media">Média</span>
                <span className="category-value">{data.categorias.media}%</span>
              </div>
              <div className="line-segment"></div>
              <div className="line-dot end-dot"></div>
            </div>
            
            {/* Linha Alta */}
            <div className="category-line alta-line">
              <div className="line-dot start-dot"></div>
              <div className="line-segment"></div>
              <div className="category-label">
                <span className="category-title alta">Alta</span>
                <span className="category-value">{data.categorias.alta}%</span>
              </div>
              <div className="line-segment"></div>
              <div className="line-dot end-dot"></div>
            </div>
          </div>
          
          
        </div>

        {/* Gráfico */}
        <div style={{ height: "350px", backgroundColor: "#f0f0f0", position: "relative" }}>
          <ResponsiveBar
            data={chartData}
            keys={['percentage']}
            indexBy="score"
            margin={{ top: 20, right: 30, bottom: 60, left: 50 }}
            padding={0.4}
            valueScale={{ type: 'linear', min: 0, max: 45 }}
            colors={(bar) => {
              const score = parseInt(bar.indexValue)
              if (score <= 5) return '#d32f2f'
              if (score <= 7) return '#ff9800'
              return '#4caf50'
            }}
            borderRadius={2}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 0,
              tickPadding: 8,
              tickRotation: 0,
              legend: '0 - Nada                                                                                              10 - Muito',
              legendPosition: 'middle',
              legendOffset: 45
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              format: v => `${v}%`,
              tickValues: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45]
            }}
            gridYValues={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
            enableLabel={true}
            label={d => d.value > 0 ? `${d.value}%` : ''}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#333"
            theme={{
              grid: {
                line: {
                  stroke: "#e0e0e0",
                  strokeWidth: 1
                }
              },
              axis: {
                ticks: {
                  text: {
                    fontSize: 11,
                    fill: "#666"
                  }
                },
                legend: {
                  text: {
                    fontSize: 12,
                    fill: "#666"
                  }
                }
              }
            }}
            animate={true}
            motionConfig="gentle"
          />
          {/* Linhas divisórias verticais - Ajustadas para posições corretas */}
          <div className="vertical-divider" style={{ left: "calc(50px + ((100% - 80px) * 0.5))" }}></div>
          <div className="vertical-divider" style={{ left: "calc(50px + ((100% - 80px) * 0.7))" }}></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          position: relative;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          height: 60px;
        }

        .categories-header {
          flex: 1;
          display: flex;
          justify-content: space-between;
          padding: 0 50px;
          position: relative;
          height: 40px;
          align-items: center;
        }

        .category-line {
          position: absolute;
          display: flex;
          align-items: center;
          height: 2px;
          top: 20px;
        }

        .baixa-line {
          left: 50px;
          width: calc(45.5% - 50px);
        }

        .media-line {
          left: 45.5%;
          width: 20%;
        }

        .alta-line {
          left: 65.5%;
          width: calc(100% - 65.5% - 50px);
        }

        .line-segment {
          flex: 1;
          height: 2px;
          background: #e0e0e0;
        }

        .line-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .baixa-line .line-dot { background: #d32f2f; }
        .media-line .line-dot { background: #ff9800; }
        .alta-line .line-dot { background: #4caf50; }

        .category-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 15px;
          background: white;
          position: relative;
          top: -20px;
        }

        .category-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .category-value {
          font-size: 13px;
          font-weight: 500;
          color: #666;
          background: #f5f5f5;
          padding: 2px 10px;
          border-radius: 4px;
        }

        .baixa { color: #d32f2f; }
        .media { color: #ff9800; }
        .alta { color: #4caf50; }

        .media-badge {
          background: #2e8b57;
          color: white;
          padding: 12px 18px;
          border-radius: 10px;
          text-align: center;
          min-width: 90px;
        }

        .media-label {
          font-size: 12px;
          margin-bottom: 3px;
          opacity: 0.9;
        }

        .media-value {
          font-size: 24px;
          font-weight: bold;
        }

        .vertical-divider {
          position: absolute;
          top: 20px;
          bottom: 60px;
          width: 1px;
          background: transparent;
          border-left: 2px dashed #999;
          opacity: 0.3;
          pointer-events: none;
        }

        .main-title {
          font-size: 1.75rem;
          color: #333;
          font-weight: 600;
          text-align: center;
          margin: 30px 0;
          line-height: 1.4;
        }

        .question-text {
          font-style: italic;
          color: #6c757d;
          padding: 15px 20px;
          background: #fff;
          border-left: 4px solid #ff8c00;
          border-radius: 4px;
          margin-bottom: 25px;
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
          transition: all 0.3s;
        }

        .comparison-toggle button:hover {
          background: #246a43;
          transform: translateY(-1px);
        }

        .description-card {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 12px;
          margin-top: 30px;
        }

        .description-section {
          margin-bottom: 25px;
        }

        .description-section h5 {
          font-weight: 600;
          margin-bottom: 10px;
        }

        .description-section p {
          color: #666;
          line-height: 1.6;
        }

        .section-navigation {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          text-align: center;
        }

        .nav-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nav-button {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          color: #495057;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 200px;
        }

        .nav-button.active {
          background: #2e8b57;
          border-color: #2e8b57;
          color: white;
        }

        .nav-button:hover:not(.active) {
          background: #e9ecef;
          border-color: #dee2e6;
        }

        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, #ff8c00 0%, #2e8b57 100%);
          border: none;
          margin: 50px 0;
          border-radius: 1px;
        }

        @media (max-width: 768px) {
          .nav-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .nav-button {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>

      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Grau de felicidade no ambiente de trabalho</h1>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>

        {/* Navegação entre seções */}
        <div className="section-navigation">
          <div className="nav-buttons">
            <button 
              className={`nav-button ${activeSection === "felicidade" ? "active" : ""}`}
              onClick={() => setActiveSection("felicidade")}
            >
              📊 Grau de Felicidade
            </button>
            <button 
              className={`nav-button ${activeSection === "trajetoria" ? "active" : ""}`}
              onClick={() => setActiveSection("trajetoria")}
            >
              🚀 Trajetória na Eldorado
            </button>
          </div>
        </div>

        {/* Seção de Grau de Felicidade */}
        {activeSection === "felicidade" && (
          <>
            <div className="question-text">
              Pensando em uma escala de 0 a 10, em que 0 é nada e 10 é muito, o quanto você se considera feliz no ambiente de trabalho?
            </div>    

            {/* Gráfico de 2025 */}
            <ChartComponent data={data2025} year={2025} />

            {/* Botão para mostrar comparação */}
            {!showComparison && (
              <div className="comparison-toggle">
                <button onClick={() => setShowComparison(true)}>
                  Ver comparação com 2023
                </button>
              </div>
            )}

            {/* Gráfico de 2023 (se habilitado) */}
            {showComparison && (
              <>
                <div className="text-center mb-3">
                  <h4 style={{ color: "#666" }}>Comparação com 2023</h4>
                </div>
                <ChartComponent data={dados2023} year={2023} />
              </>
            )}

            {/* Descrições das categorias */}
            <Row>
              <Col lg={12}>
                <Card className="description-card">
                  <Row>
                    <Col lg={4} className="description-section">
                      <h5 className="alta">Alta felicidade (81%)</h5>
                      <p>
                        O grupo com alta felicidade é composto majoritariamente por colaboradores que estão nos extremos do tempo de casa — especialmente aqueles com menos de 1 ano de Eldorado (86%) e os que estão há 10 anos ou mais (81%), indicando entusiasmo inicial e vínculo consolidado como fatores positivos.
                      </p>
                    </Col>
                    <Col lg={4} className="description-section">
                      <h5 className="media">Média felicidade (13%)</h5>
                      <p>
                        O perfil de felicidade média concentra-se entre colaboradores que estão em fase intermediária de jornada na empresa, especialmente entre 1 a 9 anos de Eldorado (com médias variando de 13% a 15%). É mais comum entre aqueles que avaliam sua trajetória profissional como "em análise" (22%) ou com "intenção de saída" (21%).
                      </p>
                    </Col>
                    <Col lg={4} className="description-section">
                      <h5 className="baixa">Baixa felicidade (7%)</h5>
                      <p>
                        O grupo com baixa felicidade representa a maior preocupação estratégica, com maior incidência entre colaboradores com 4 a 6 anos de casa (10%), e com pós-graduação (33%). Apresenta forte correlação com percepções negativas sobre o impacto do trabalho na saúde emocional (33%), intenção de saída da empresa (52%), e baixo grau de informação sobre a Eldorado (38%).
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Seção de Trajetória na Eldorado */}
        {activeSection === "trajetoria" && <TrajetoriaEldorado />}
      </Container>
    </>
  )
}

export default GrauFelicidade