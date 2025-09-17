import { useState, useEffect } from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"
import TrajetoriaMotivacao from "./TrajetoriaMotivacao"

const FatoresMotivam = () => {
  const { getFilteredData, loading } = useData()
  const [motivationData, setMotivationData] = useState(null)
  const [activeSection, setActiveSection] = useState("motivacao") // Para controlar qual seção mostrar

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) return

        const questionFields = [
          "P15_O1 - Qual você diria ser a sua principal motivação de trabalhar na Eldorado? E em segundo lugar? E em terceiro?",
          "P15_O2 - Qual você diria ser a sua principal motivação de trabalhar na Eldorado? E em segundo lugar? E em terceiro?",
          "P15_O3 - Qual você diria ser a sua principal motivação de trabalhar na Eldorado? E em segundo lugar? E em terceiro?"
        ]

        // Contar respostas corretamente
        const fatoresMencoes = {}
        
        filteredData.forEach((row, rowIndex) => {
          const respostas = [
            row[questionFields[0]], // P15_O1 - 1ª opção
            row[questionFields[1]], // P15_O2 - 2ª opção  
            row[questionFields[2]]  // P15_O3 - 3ª opção
          ]
          
          // Para cada respondente, processar suas 3 respostas
          respostas.forEach((resposta, index) => {
            if (resposta && resposta.trim() !== "" && !resposta.includes("#NULL!") && resposta.toLowerCase() !== "null") {
              if (!fatoresMencoes[resposta]) {
                fatoresMencoes[resposta] = {
                  respondentesUnicos: new Set(),
                  posicoes: { primeira: 0, segunda: 0, terceira: 0 }
                }
              }
              
              // Adicionar respondente único usando o índice da linha como chave única
              fatoresMencoes[resposta].respondentesUnicos.add(rowIndex)
              
              // Contar posição específica
              if (index === 0) fatoresMencoes[resposta].posicoes.primeira++
              else if (index === 1) fatoresMencoes[resposta].posicoes.segunda++  
              else if (index === 2) fatoresMencoes[resposta].posicoes.terceira++
            }
          })
        })

        // Calcular percentuais corretos
        const totalRespondentes = filteredData.length
        const motivationItems = Object.entries(fatoresMencoes)
          .map(([fator, dados]) => {
            const totalMencoes = dados.posicoes.primeira + dados.posicoes.segunda + dados.posicoes.terceira
            const percentualTotal = Math.round((totalMencoes / totalRespondentes) * 100)
            
            // Calcular distribuição interna (como % do total de menções deste fator)
            const primeiraPercent = totalMencoes > 0 ? Math.round((dados.posicoes.primeira / totalMencoes) * 100) : 0
            const segundaPercent = totalMencoes > 0 ? Math.round((dados.posicoes.segunda / totalMencoes) * 100) : 0
            const terceiraPercent = totalMencoes > 0 ? Math.round((dados.posicoes.terceira / totalMencoes) * 100) : 0
            
            return {
              fator: fator.length > 45 ? fator.substring(0, 45) + "..." : fator,
              fatorCompleto: fator,
              primeira: primeiraPercent,
              segunda: segundaPercent,
              terceira: terceiraPercent,
              total: percentualTotal,
              totalMencoes: totalMencoes,
              respondentesUnicos: dados.respondentesUnicos.size
            }
          })
          .filter(item => item.total > 0)
          .sort((a, b) => b.total - a.total)

        // Classificar fatores em racionais vs emocionais
        const fatoresRacionais = [
          "ter oportunidades reais de desenvolvimento e carreira",
          "ter segurança e estabilidade", 
          "remuneração justa",
          "benefícios relevantes"
        ]

        const fatoresEmocionais = [
          "um ambiente saudável e respeitoso",
          "equilíbrio vida-trabalho",
          "reconhecimento pelo trabalho",
          "uma liderança que me inspira e apoia",
          "liberdade para ser quem eu sou",
          "sentir que estou contribuindo para algo maior"
        ]

        let racionaisTotal = 0
        let emocionaisTotal = 0

        motivationItems.forEach(item => {
          const fatorLower = item.fatorCompleto.toLowerCase()
          
          if (fatoresRacionais.some(fr => fatorLower.includes(fr))) {
            racionaisTotal += item.totalMencoes
          } else if (fatoresEmocionais.some(fe => fatorLower.includes(fe))) {
            emocionaisTotal += item.totalMencoes
          }
        })

        const totalClassificadas = racionaisTotal + emocionaisTotal
        const racionaisPercentual = totalClassificadas > 0 ? Math.round((racionaisTotal / totalClassificadas) * 100) : 0
        const emocionaisPercentual = totalClassificadas > 0 ? Math.round((emocionaisTotal / totalClassificadas) * 100) : 0

        // Encontrar o fator principal (maior percentual total)
        const fatorPrincipal = motivationItems.reduce((prev, current) => 
          prev.total > current.total ? prev : current
        )

        setMotivationData({
          items: motivationItems,
          totalRespondentes,
          fatorPrincipal,
          classificacao: {
            racionais: racionaisPercentual,
            emocionais: emocionaisPercentual
          }
        })

      } catch (error) {
        console.error("Erro ao processar dados de motivação:", error)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

  if (loading || !motivationData) {
    return (
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Fatores que Motivam Nossa Gente</h1>
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

  const chartData = motivationData.items.map(item => ({
    fator: item.fator,
    fatorCompleto: item.fatorCompleto,
    // Converter distribuição interna para valores absolutos baseados no percentual total
    "1ª": Math.round((item.primeira * item.total) / 100),
    "2ª": Math.round((item.segunda * item.total) / 100), 
    "3ª": Math.round((item.terceira * item.total) / 100),
    total: item.total,
    // Guardar percentuais internos para o tooltip
    primeiraPercent: item.primeira,
    segundaPercent: item.segunda,
    terceiraPercent: item.terceira
  }))

  return (
    <>
      <style jsx>{`
        .motivation-container {
          width: 100%;
        }

        .question-text {
          font-style: italic;
          color: #6c757d;
          padding: 15px 20px;
          background: #fff;
          border-left: 4px solid #ff8c00;
          border-radius: 4px;
          margin-bottom: 25px;
          font-size: 15px;
          line-height: 1.5;
        }

        .chart-section {
          background: white;
          border-radius: 12px;
          padding: 0;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .chart-content {
          display: flex;
          height: 650px;
        }

        .chart-area {
          flex: 2;
          padding: 30px 20px 30px 30px;
        }

        .sidebar-area {
          flex: 1;
          background: #f8f9fa;
          padding: 30px 20px;
          border-left: 1px solid #e9ecef;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 30px;
        }

        .factor-circle {
          background: white;
          border: 3px solid;
          border-radius: 50%;
          width: 140px;
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .factor-circle.racionais {
          border-color: #4caf50;
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
        }

        .factor-circle.emocionais {
          border-color: #ff9800;
          background: linear-gradient(135deg, #fff3e0 0%, #fef7ed 100%);
        }

        .circle-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .racionais .circle-icon {
          color: #4caf50;
        }

        .emocionais .circle-icon {
          color: #ff9800;
        }

        .circle-percentage {
          font-size: 24px;
          font-weight: bold;
          color: #2e8b57;
          margin-bottom: 5px;
        }

        .circle-label {
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          color: #333;
          margin-top: 10px;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 2px;
        }

        .color-primeira { background: #2e8b57; }
        .color-segunda { background: #4caf50; }
        .color-terceira { background: #81c784; }

        .insights-card {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 12px;
          margin-top: 30px;
        }

        .insights-section {
          margin-bottom: 20px;
        }

        .insights-section h6 {
          font-weight: 600;
          margin-bottom: 10px;
          color: #2e8b57;
        }

        .insights-section p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
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

        @media (max-width: 992px) {
          .chart-content {
            flex-direction: column;
            height: auto;
          }

          .chart-area {
            padding: 20px;
          }

          .chart-area > div {
            height: 600px !important;
          }

          .sidebar-area {
            border-left: none;
            border-top: 1px solid #e9ecef;
            flex-direction: row;
            justify-content: space-around;
            gap: 20px;
            padding: 20px;
          }

          .factor-circle {
            width: 120px;
            height: 120px;
          }

          .circle-percentage {
            font-size: 20px;
          }
        }

        @media (max-width: 768px) {
          .sidebar-area {
            flex-direction: column;
            align-items: center;
          }

          .legend {
            gap: 15px;
          }

          .legend-item {
            font-size: 12px;
          }

          .chart-area > div {
            height: 500px !important;
          }
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
      `}</style>

      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Fatores que Motivam Nossa Gente</h1>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>

        {/* Navegação entre seções */}
        <div className="section-navigation">
          <div className="nav-buttons">
            <button 
              className={`nav-button ${activeSection === "motivacao" ? "active" : ""}`}
              onClick={() => setActiveSection("motivacao")}
            >
              💼 Fatores de Motivação
            </button>
            <button 
              className={`nav-button ${activeSection === "trajetoria" ? "active" : ""}`}
              onClick={() => setActiveSection("trajetoria")}
            >
              🚀 Trajetória na Eldorado
            </button>
          </div>
        </div>

        {/* Seção de Fatores de Motivação */}
        {activeSection === "motivacao" && (
          <div className="motivation-container">
            {/* Pergunta */}
            <div className="question-text">
              Qual você diria ser a sua principal motivação de trabalhar na Eldorado? E em segundo lugar? E em terceiro? (RM)
            </div>

            {/* Seção do Gráfico */}
            <div className="chart-section">
              <div className="chart-content">
                {/* Área do Gráfico */}
                <div className="chart-area">
                  {/* Legenda */}
                  <div className="legend">
                    <div className="legend-item">
                      <div className="legend-color color-primeira"></div>
                      <span>1ª</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color color-segunda"></div>
                      <span>2ª</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color color-terceira"></div>
                      <span>3ª</span>
                    </div>
                  </div>

                  {/* Gráfico */}
                  <div style={{ height: "500px" }}>
                    <ResponsiveBar
                      data={chartData}
                      keys={['1ª', '2ª', '3ª']}
                      indexBy="fator"
                      layout="horizontal"
                      margin={{ top: 20, right: 100, bottom: 20, left: 280 }}
                      padding={0.3}
                      valueScale={{ type: 'linear', min: 0, max: Math.max(...chartData.map(d => d.total)) }}
                      colors={['#2e8b57', '#4caf50', '#81c784']}
                      borderRadius={2}
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
                      gridYValues={[10, 20, 30, 40, 50, 60]}
                      tooltip={({ id, value, data }) => {
                        // Buscar os percentuais internos corretos
                        let internalPercent = 0;
                        if (id === '1ª') internalPercent = data.primeiraPercent;
                        else if (id === '2ª') internalPercent = data.segundaPercent;
                        else if (id === '3ª') internalPercent = data.terceiraPercent;
                        
                        return (
                          <div
                            style={{
                              background: 'white',
                              padding: '9px 12px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '12px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                          >
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                              {data.fatorCompleto}
                            </div>
                            <div style={{ color: '#666' }}>
                              <strong>{id}</strong>: {internalPercent}% (da distribuição interna)
                            </div>
                            <div style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>
                              Total: {data.total}% dos respondentes
                            </div>
                          </div>
                        )
                      }}
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
                              fontSize: 12,
                              fill: "#666"
                            }
                          }
                        }
                      }}
                      animate={true}
                      motionConfig="gentle"
                      layers={[
                        'grid',
                        'axes',
                        'bars',
                        ({ bars }) => (
                          <g>
                            {/* Mostrar apenas o percentual total de cada fator */}
                            {chartData.map((item, index) => {
                              const barGroup = bars.filter(bar => bar.data.indexValue === item.fator)
                              if (barGroup.length === 0) return null
                              
                              const lastBar = barGroup[barGroup.length - 1]
                              return (
                                <text
                                  key={`total-${index}`}
                                  x={lastBar.x + lastBar.width + 15}
                                  y={lastBar.y + (lastBar.height / 2)}
                                  textAnchor="start"
                                  dominantBaseline="central"
                                  fontSize="14"
                                  fontWeight="600"
                                  fill="#333"
                                >
                                  {item.total}%
                                </text>
                              )
                            })}
                          </g>
                        )
                      ]}
                    />
                  </div>
                </div>

                {/* Área Lateral com Círculos */}
                <div className="sidebar-area">
                  <div>
                    <div className="factor-circle racionais">
                      <div className="circle-icon">🧠</div>
                      <div className="circle-percentage">{motivationData.classificacao.racionais}%</div>
                    </div>
                    <div className="circle-label">
                      <strong>Fatores racionais</strong><br />
                      Carreira e oportunidades
                    </div>
                  </div>

                  <div>
                    <div className="factor-circle emocionais">
                      <div className="circle-icon">❤️</div>
                      <div className="circle-percentage">{motivationData.classificacao.emocionais}%</div>
                    </div>
                    <div className="circle-label">
                      <strong>Fatores emocionais</strong><br />
                      Ambiente saudável e respeitoso
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights e Análises */}
            <Row>
              <Col lg={12}>
                <Card className="insights-card">
                  <Row>
                    <Col lg={4} className="insights-section">
                      <h6>Fatores Racionais ({motivationData.classificacao.racionais}%)</h6>
                      <p>
                        Predominam aspectos tangíveis como oportunidades de desenvolvimento, segurança no emprego e 
                        remuneração adequada. Estes fatores estão relacionados às necessidades básicas de crescimento 
                        profissional e estabilidade financeira.
                      </p>
                    </Col>
                    <Col lg={4} className="insights-section">
                      <h6>Fatores Emocionais ({motivationData.classificacao.emocionais}%)</h6>
                      <p>
                        Englobam aspectos subjetivos como ambiente respeitoso, equilíbrio vida-trabalho, reconhecimento 
                        e propósito. Demonstram a importância do bem-estar psicológico e da conexão emocional com 
                        a empresa.
                      </p>
                    </Col>
                    <Col lg={4} className="insights-section">
                      <h6>Fator Principal</h6>
                      <p>
                        <strong>{motivationData.fatorPrincipal.fatorCompleto}</strong> foi o fator mais mencionado 
                        ({motivationData.fatorPrincipal.total}% dos respondentes), demonstrando ser a principal 
                        motivação dos colaboradores para trabalhar na Eldorado.
                      </p>
                    </Col>
                  </Row>
                  
                  <div className="text-muted mt-3" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
                    <strong>Base | {motivationData.totalRespondentes.toLocaleString()} respondentes</strong>
                    <br />
                    <small>
                      Percentual total = quantos respondentes mencionaram o fator (em qualquer posição)<br />
                      Distribuição interna = como essas menções se dividem entre 1ª, 2ª e 3ª opção
                    </small>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {/* Seção de Trajetória na Eldorado */}
        {activeSection === "trajetoria" && <TrajetoriaMotivacao />}
      </Container>
    </>
  )
}

export default FatoresMotivam