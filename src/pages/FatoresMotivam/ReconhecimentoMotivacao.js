import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const ReconhecimentoMotivacao = () => {
  const { getFilteredData, loading } = useData()
  const [chartData, setChartData] = useState([])
  const [insights, setInsights] = useState({})
  const [totalRespondentes, setTotalRespondentes] = useState(0)

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) return

        // Primeiro, vamos debugar e verificar quais campos existem
        console.log("Dados filtrados:", filteredData.length)
        if (filteredData.length > 0) {
          console.log("Primeira linha:", filteredData[0])
          console.log("Campos disponíveis:", Object.keys(filteredData[0]))
        }

        // Vamos procurar pelos campos que começam com T_P16
        const availableFields = filteredData.length > 0 ? Object.keys(filteredData[0]) : []
        const p16Fields = availableFields.filter(field => field.includes('T_P16_'))
        console.log("Campos T_P16 encontrados:", p16Fields)

        // Vamos procurar pelos campos que contêm T_P16 de forma mais flexível
        const findField = (pattern) => {
          return availableFields.find(field => 
            field.includes(pattern) || 
            field.toLowerCase().includes(pattern.toLowerCase())
          )
        }

        // Usar os campos exatos que existem na base
        const questionFields = [
          {
            field: findField("T_P16_1") || "T_P16_1",
            label: "Me sinto reconhecido(a) pelo meu trabalho",
            shortLabel: "Reconhecimento pelo trabalho"
          },
          {
            field: findField("T_P16_2") || "T_P16_2", 
            label: "Me sinto parte de algo relevante",
            shortLabel: "Parte de algo relevante"
          },
          {
            field: findField("T_P16_3") || "T_P16_3",
            label: "É um lugar motivador para se trabalhar",
            shortLabel: "Lugar motivador"
          },
          {
            field: findField("T_P16_4") || "T_P16_4",
            label: "Tenho oportunidades reais de desenvolvimento",
            shortLabel: "Oportunidades de desenvolvimento"
          },
          {
            field: findField("T_P16_5") || "T_P16_5",
            label: "Tenho oportunidade de utilizar minhas habilidades e talentos",
            shortLabel: "Utilização de habilidades e talentos"
          }
        ]

        console.log("Campos mapeados:", questionFields.map(q => ({ original: q.field, exists: availableFields.includes(q.field) })))

        const processedData = []
        let totalRespondentesCount = 0
        const insightsData = {}

        questionFields.forEach(({ field, label, shortLabel }) => {
          // Verificar se o campo existe na base de dados
          if (!availableFields.includes(field)) {
            console.log(`Campo ${field} não encontrado. Campos disponíveis:`, availableFields.filter(f => f.includes('P16')))
            return
          }

          const validResponses = filteredData
            .map(row => {
              const value = row[field]
              // Converter para número e validar
              const numValue = parseInt(value)
              return (!isNaN(numValue) && numValue >= 1 && numValue <= 5) ? numValue : null
            })
            .filter(score => score !== null)

          console.log(`Campo ${field}: ${validResponses.length} respostas válidas`)

          if (validResponses.length === 0) {
            console.log(`Nenhuma resposta válida para ${field}`)
            return
          }

          if (totalRespondentesCount === 0) {
            totalRespondentesCount = validResponses.length
          }

          // Contar distribuição das respostas (1-5)
          const distribution = {}
          for (let i = 1; i <= 5; i++) {
            const count = validResponses.filter(score => score === i).length
            distribution[i] = Math.round((count / validResponses.length) * 100)
          }

          // Calcular médias e categorias
          const soma = validResponses.reduce((acc, score) => acc + score, 0)
          const media = soma / validResponses.length

          // Categorizar: 1-2 (Discordam), 3 (Neutro), 4-5 (Concordam)
          const discordam = validResponses.filter(s => s <= 2).length
          const neutro = validResponses.filter(s => s === 3).length
          const concordam = validResponses.filter(s => s >= 4).length

          const percentDiscordam = Math.round((discordam / validResponses.length) * 100)
          const percentNeutro = Math.round((neutro / validResponses.length) * 100)
          const percentConcordam = Math.round((concordam / validResponses.length) * 100)

          processedData.push({
            atributo: shortLabel,
            atributoCompleto: label,
            "1": distribution[1],
            "2": distribution[2],
            "3": distribution[3],
            "4": distribution[4],
            "5": distribution[5],
            media: media.toFixed(1),
            discordam: percentDiscordam,
            neutro: percentNeutro,
            concordam: percentConcordam,
            totalRespostas: validResponses.length
          })

          insightsData[shortLabel] = {
            media: media.toFixed(1),
            concordam: percentConcordam,
            discordam: percentDiscordam,
            neutro: percentNeutro
          }
        })

        console.log("Dados processados:", processedData)
        console.log("Total de campos processados:", processedData.length)

        // Só atualizar o estado se temos dados válidos
        if (processedData.length > 0) {
          // Ordenar por menor concordância (ordem crescente)
          processedData.sort((a, b) => a.concordam - b.concordam)

          setChartData(processedData)
          setInsights(insightsData)
          setTotalRespondentes(totalRespondentesCount)
        } else {
          console.log("Nenhum dado válido processado")
        }

      } catch (error) {
        console.error("Erro ao processar dados de reconhecimento:", error)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

  if (loading || chartData.length === 0) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Carregando dados de reconhecimento...</span>
        </div>
      </div>
    )
  }

  // Preparar dados para o gráfico empilhado
  const stackedChartData = chartData.map(item => ({
    atributo: item.atributo,
    atributoCompleto: item.atributoCompleto,
    "1": item["1"],
    "2": item["2"], 
    "3": item["3"],
    "4": item["4"],
    "5": item["5"],
    media: item.media,
    concordam: item.concordam
  }))

  return (
    <>
      <style jsx>{`
        .reconhecimento-container {
          width: 100%;
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
        }

        .chart-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .chart-header {
          margin-bottom: 25px;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin-bottom: 20px;
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

        .color-1 { background: #d32f2f; }
        .color-2 { background: #ff5722; }
        .color-3 { background: #ff9800; }
        .color-4 { background: #4caf50; }
        .color-5 { background: #2e7d32; }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
          padding: 0;
        }

        .summary-card {
          background: white;
          border: 3px solid #2e8b57;
          border-radius: 12px;
          padding: 25px 20px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(46, 139, 87, 0.2);
        }

        .card-title {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #2e8b57;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-value {
          font-size: 36px;
          font-weight: 700;
          color: #2e8b57;
          line-height: 1;
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

        .metric-highlight {
          background: #fff;
          border-left: 4px solid #2e8b57;
          padding: 10px 15px;
          margin: 10px 0;
          border-radius: 0 4px 4px 0;
        }

        @media (max-width: 768px) {
          .legend {
            gap: 15px;
          }

          .legend-item {
            font-size: 12px;
          }

          .summary-cards {
            flex-direction: column;
            align-items: center;
          }

          .summary-card {
            width: 100%;
            max-width: 300px;
          }

          .chart-section {
            padding: 20px;
          }
        }
      `}</style>

      <div className="reconhecimento-container">
        <div className="question-text">
          Em relação às frases abaixo, indique o quanto discorda ou concorda com cada uma delas. Escala de 1 a 5, onde 1 = "discorda totalmente" e 5 = "concorda totalmente".
        </div>

        {/* Cards de resumo - MOVIDOS PARA CIMA */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-title">Média de Concordância</div>
            <div className="card-value">
              {Math.round(chartData.reduce((acc, item) => acc + item.concordam, 0) / chartData.length)}%
            </div>
          </div>
          <div className="summary-card">
            <div className="card-title">Posição Neutra</div>
            <div className="card-value">
              {Math.round(chartData.reduce((acc, item) => acc + item.neutro, 0) / chartData.length)}%
            </div>
          </div>
          <div className="summary-card">
            <div className="card-title">Média de Discordância</div>
            <div className="card-value">
              {Math.round(chartData.reduce((acc, item) => acc + item.discordam, 0) / chartData.length)}%
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            {/* Legenda */}
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color color-1"></div>
                <span>1 - Discorda totalmente</span>
              </div>
              <div className="legend-item">
                <div className="legend-color color-2"></div>
                <span>2 - Discorda</span>
              </div>
              <div className="legend-item">
                <div className="legend-color color-3"></div>
                <span>3 - Neutro</span>
              </div>
              <div className="legend-item">
                <div className="legend-color color-4"></div>
                <span>4 - Concorda</span>
              </div>
              <div className="legend-item">
                <div className="legend-color color-5"></div>
                <span>5 - Concorda totalmente</span>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div style={{ height: "500px" }}>
            <ResponsiveBar
              data={stackedChartData}
              keys={['1', '2', '3', '4', '5']}
              indexBy="atributo"
              layout="horizontal"
              margin={{ top: 20, right: 100, bottom: 20, left: 250 }}
              padding={0.3}
              valueScale={{ type: 'linear', min: 0, max: 100 }}
              colors={['#d32f2f', '#ff5722', '#ff9800', '#4caf50', '#2e7d32']}
              borderRadius={2}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 8,
                tickRotation: 0,
                format: v => `${v}%`,
                tickValues: [0, 20, 40, 60, 80, 100]
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 12,
                tickRotation: 0
              }}
              enableLabel={false}
              enableGridY={true}
              gridYValues={[20, 40, 60, 80, 100]}
              tooltip={({ id, value, data }) => (
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
                    {data.atributoCompleto}
                  </div>
                  <div style={{ color: '#666' }}>
                    <strong>Escala {id}</strong>: {value}%
                  </div>
                  <div style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>
                    Média: {data.media} | Concordam: {data.concordam}%
                  </div>
                </div>
              )}
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
                    {/* Mostrar apenas a média */}
                    {stackedChartData.map((item, index) => {
                        const barGroup = bars.filter(bar => bar.data.indexValue === item.atributo)
                        if (barGroup.length === 0) return null

                        const lastBar = barGroup[barGroup.length - 1]
                        return (
                        <g key={`stats-${index}`}>
                            {/* Média com destaque */}
                            <text
                            x={lastBar.x + lastBar.width + 10}
                            y={lastBar.y + (lastBar.height / 2)}
                            textAnchor="start"
                            dominantBaseline="central"
                            fontSize="16"
                            fontWeight="700"
                            fill="#2e8b57"
                            >
                            Média: {item.media}
                            </text>
                        </g>
                        )
                    })}
                    </g>
                )
                ]}
            />
          </div>
        </div>

        {/* Insights e Análises */}
        <Row>
          <Col lg={12}>
            <Card className="insights-card">
              <Row>
                <Col lg={6} className="insights-section">
                  <h6>Atributos com Maior Concordância</h6>
                  {chartData.slice(0, 2).map(item => (
                    <div key={item.atributo} className="metric-highlight">
                      <strong>{item.atributoCompleto}</strong>: {item.concordam}% concordam (média {item.media})
                    </div>
                  ))}
                  <p>
                    Estes são os aspectos onde os colaboradores demonstram maior alinhamento positivo com a empresa, 
                    indicando pontos fortes da experiência profissional na Eldorado.
                  </p>
                </Col>
                <Col lg={6} className="insights-section">
                  <h6>Oportunidades de Melhoria</h6>
                  {chartData.slice(-2).map(item => (
                    <div key={item.atributo} className="metric-highlight">
                      <strong>{item.atributoCompleto}</strong>: {item.concordam}% concordam (média {item.media})
                    </div>
                  ))}
                  <p>
                    Estes aspectos apresentam menores índices de concordância, representando áreas prioritárias 
                    para ações de melhoria e desenvolvimento organizacional.
                  </p>
                </Col>
              </Row>
              
              <div className="text-muted mt-3" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
                <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
                <br />
                <small>
                  Percentuais de concordância incluem respostas 4 e 5 na escala. Discordância inclui respostas 1 e 2.
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ReconhecimentoMotivacao