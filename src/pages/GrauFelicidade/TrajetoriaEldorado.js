import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const TrajetoriaEldorado = () => {
  const { getFilteredData, loading } = useData()
  const [data2025, setData2025] = useState(null)

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) return

        const questionField = "P17 - Pensando no seu momento atual e no seu futuro profissional, como você enxerga a sua trajetória na Eldorado?"
        
        // Extrair as respostas válidas
        const responses = filteredData
          .map(row => row[questionField])
          .filter(response => 
            response && 
            response.trim() !== "" && 
            !response.includes("#NULL!") &&
            response.toLowerCase() !== "null"
          )

        if (responses.length === 0) return

        // Contar cada resposta
        const counts = {}
        responses.forEach(response => {
          counts[response] = (counts[response] || 0) + 1
        })

        // Definir ordem específica das categorias
        const ordemCategorias = [
          "Vejo como um lugar para construir uma carreira de longo prazo",
          "Tenho vontade de crescer e evoluir profissionalmente",
          "Quero continuar na empresa, mas sem grandes expectativas no momento",
          "Ainda estou refletindo sobre o meu futuro",
          "Não me vejo na Eldorado no futuro",
          "Não sei dizer"
        ]

        // Criar distribuição ordenada por percentual crescente
        const distribuicao = ordemCategorias
          .map(categoria => ({
            categoria: categoria.length > 50 ? categoria.substring(0, 50) + "..." : categoria,
            categoriaCompleta: categoria,
            count: counts[categoria] || 0,
            percentage: counts[categoria] ? Math.round((counts[categoria] / responses.length) * 100) : 0
          }))
          .filter(item => item.count > 0)
          .sort((a, b) => a.percentage - b.percentage)

        // Classificar em categorias principais baseado na análise da imagem
        const altaIntencaoKeywords = [
          "lugar para construir uma carreira de longo prazo",
          "vontade de crescer e evoluir profissionalmente"
        ]
        
        const trajetoriaAnaliseKeywords = [
          "continuar na empresa, mas sem grandes expectativas",
          "ainda estou refletindo sobre o meu futuro"
        ]
        
        const intencaoSaidaKeywords = [
          "não me vejo na eldorado no futuro"
        ]

        const classificarResposta = (resposta) => {
          const respostaLower = resposta.toLowerCase()
          
          if (altaIntencaoKeywords.some(keyword => respostaLower.includes(keyword.toLowerCase()))) {
            return "alta"
          }
          if (trajetoriaAnaliseKeywords.some(keyword => respostaLower.includes(keyword.toLowerCase()))) {
            return "analise"
          }
          if (intencaoSaidaKeywords.some(keyword => respostaLower.includes(keyword.toLowerCase()))) {
            return "saida"
          }
          return "analise" // Default para análise se não conseguir classificar
        }

        let altaCount = 0
        let analiseCount = 0
        let saidaCount = 0

        responses.forEach(response => {
          const categoria = classificarResposta(response)
          if (categoria === "alta") altaCount++
          else if (categoria === "analise") analiseCount++
          else if (categoria === "saida") saidaCount++
        })

        setData2025({
          altaIntencao: Math.round((altaCount / responses.length) * 100),
          trajetoriaAnalise: Math.round((analiseCount / responses.length) * 100),
          intencaoSaida: Math.round((saidaCount / responses.length) * 100),
          distribuicao: distribuicao,
          total: responses.length,
          detalhes: {
            alta: altaCount,
            analise: analiseCount,
            saida: saidaCount
          }
        })

      } catch (error) {
        console.error("Erro ao processar dados de trajetória:", error)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

  if (loading || !data2025) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando dados de trajetória...</span>
        </div>
      </div>
    )
  }

  const ChartComponent = ({ data }) => {
    const chartData = data.distribuicao.map(item => ({
      categoria: item.categoria,
      percentage: item.percentage,
      categoriaCompleta: item.categoriaCompleta
    }))

    return (
      <div style={{ height: "400px" }}>
        <ResponsiveBar
          data={chartData}
          keys={['percentage']}
          indexBy="categoria"
          layout="horizontal"
          margin={{ top: 20, right: 80, bottom: 20, left: 380 }}
          padding={0.3}
          valueScale={{ type: 'linear', min: 0, max: 50 }}
          colors={(bar) => {
            const categoria = bar.data.categoriaCompleta.toLowerCase()
            if (categoria.includes('longo prazo') || categoria.includes('crescer e evoluir')) {
              return '#4caf50' // Verde para alta intenção
            }
            if (categoria.includes('continuar') || categoria.includes('refletindo')) {
              return '#ff9800' // Laranja para análise
            }
            if (categoria.includes('não me vejo')) {
              return '#d32f2f' // Vermelho para saída
            }
            return '#9e9e9e' // Cinza para outros
          }}
          borderRadius={3}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            format: v => `${v}%`,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0
          }}
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
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .trajetoria-container {
          width: 100%;
        }
        
        .trajetoria-container * {
          box-sizing: border-box;
        }
        
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
          border-bottom: none !important;
          border-top: none !important;
          border-right: none !important;
        }

        .categories-summary {
          display: flex;
          justify-content: center;
          align-items: stretch;
          flex-wrap: wrap;
          gap: 30px;
          margin: 40px 0;
          width: 100%;
        }

        .category-badge {
          background: white;
          border: 2px solid;
          border-radius: 12px;
          padding: 25px 20px;
          text-align: center;
          min-width: 280px;
          max-width: 320px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .category-badge:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .category-badge.alta {
          border-color: #4caf50;
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
        }

        .category-badge.alta .category-value {
          color: #4caf50;
        }

        .category-badge.analise {
          border-color: #ff9800;
          background: linear-gradient(135deg, #fff3e0 0%, #fef7ed 100%);
        }

        .category-badge.analise .category-value {
          color: #ff9800;
        }

        .category-badge.saida {
          border-color: #d32f2f;
          background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
        }

        .category-badge.saida .category-value {
          color: #d32f2f;
        }

        .category-title {
          display: block;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 12px;
          line-height: 1.3;
          color: #333;
        }

        .category-value {
          display: block;
          font-size: 36px;
          font-weight: bold;
          margin-top: 5px;
        }

        .detailed-chart {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .chart-title {
          color: #2e8b57;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }

        .main-title {
          font-size: 1.75rem;
          color: #333;
          font-weight: 600;
          text-align: center;
          margin: 30px 0;
          line-height: 1.4;
        }

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

        @media (max-width: 768px) {
          .categories-summary {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          
          .category-badge {
            min-width: 90%;
            max-width: 350px;
          }

          .detailed-chart {
            padding: 20px;
            margin: 20px 0;
          }

          .chart-title {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <div className="trajetoria-container">
        <div className="question-text">
          Pensando no seu momento atual e no seu futuro profissional, como você enxerga a sua trajetória na Eldorado?
        </div>

        {/* Cards com percentuais principais */}
        <div className="categories-summary">
          <div className="category-badge alta">
            <span className="category-title">Alta intenção de permanência e desenvolvimento</span>
            <span className="category-value">{data2025.altaIntencao}%</span>
          </div>
          
          <div className="category-badge analise">
            <span className="category-title">Trajetória em análise</span>
            <span className="category-value">{data2025.trajetoriaAnalise}%</span>
          </div>
          
          <div className="category-badge saida">
            <span className="category-title">Intenção de saída</span>
            <span className="category-value">{data2025.intencaoSaida}%</span>
          </div>
        </div>

        {/* Gráfico detalhado */}
        <div className="detailed-chart">
          <h5 className="chart-title">Distribuição detalhada das respostas</h5>
          <ChartComponent data={data2025} />
        </div>

        {/* Insights e Análises */}
        <Row>
          <Col lg={12}>
            <Card className="insights-card">
              <Row>
                <Col lg={4} className="insights-section">
                  <h6>Alta Intenção ({data2025.altaIntencao}%)</h6>
                  <p>
                    Entre quem respondeu ver a Eldorado como um lugar para construir uma carreira de longo prazo e 
                    ter vontade de crescer e evoluir profissionalmente. Este grupo demonstra forte vínculo com a empresa
                    e visão positiva sobre o futuro profissional.
                  </p>
                </Col>
                <Col lg={4} className="insights-section">
                  <h6>Trajetória em Análise ({data2025.trajetoriaAnalise}%)</h6>
                  <p>
                    Entre quem disse ter vontade de continuar na Eldorado, mas sem grandes expectativas no momento 
                    e ainda estar refletindo sobre o futuro. Este grupo está em fase de avaliação sobre sua jornada 
                    profissional na empresa.
                  </p>
                </Col>
                <Col lg={4} className="insights-section">
                  <h6>Intenção de Saída ({data2025.intencaoSaida}%)</h6>
                  <p>
                    Entre quem avalia não se enxergar na Eldorado no futuro. Representa um grupo minoritário que 
                    demonstra baixo engajamento com os planos de permanência na empresa, sendo importante para 
                    estratégias de retenção.
                  </p>
                </Col>
              </Row>
              
              <div className="text-muted mt-3" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
                <strong>Base | {data2025.total.toLocaleString()} respondentes</strong>
                <br />
                <small>
                  Principalmente entre homens cisgênero (85%), mais jovens, com escolaridade mais alta e com menos 
                  tempo de Eldorado (menos de 1 ano).
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default TrajetoriaEldorado