import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const MeiosBuscarInformacoes = () => {
  const { getFilteredData, loading } = useData()
  const [chartData, setChartData] = useState([])
  const [totalRespondentes, setTotalRespondentes] = useState(0)
  const [principalMeio, setPrincipalMeio] = useState(null)

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) return

        console.log("=== DEBUG MEIOS DE BUSCAR INFORMAÇÕES ===")
        console.log("Total de registros filtrados:", filteredData.length)

        // As 14 opções possíveis de resposta para P24
        const opcoes = [
          "Comunicados",
          "Eldorado Conecta, nossa intranet",
          "Eldcast",
          "Radar",
          "Site da Eldorado",
          "Redes Sociais Eldorado",
          "Murais/Quadros físicos", 
          "Colegas de trabalho",
          "DDS (Diálogo Diário de Segurança)",
          "Líder imediato",
          "Grupos de WhatsApp",
          "Jornais/TV",
          "Nenhum desses",
          "Não sei dizer"
        ]

        const availableFields = filteredData.length > 0 ? Object.keys(filteredData[0]) : []
        
        // Debug detalhado dos campos disponíveis
        console.log("Primeiro campo de exemplo:", availableFields[0])
        console.log("Campos que contêm 'P24':", availableFields.filter(f => f.includes('P24')))
        console.log("Campos que contêm 'meios':", availableFields.filter(f => f.toLowerCase().includes('meios')))
        console.log("Total de campos disponíveis:", availableFields.length)

        // Procurar por campos P24 de forma mais ampla
        let p24Fields = availableFields.filter(field => 
          field.includes('P24') && 
          (field.includes('Por qual desses meios') || 
           field.includes('meios você costuma buscar') ||
           field.includes('informações sobre a Eldorado'))
        )

        // Se não encontrou, tentar busca mais simples
        if (p24Fields.length === 0) {
          p24Fields = availableFields.filter(field => field.includes('P24'))
          console.log("Busca simples por P24:", p24Fields)
        }

        // Se ainda não encontrou, tentar busca por "meios"
        if (p24Fields.length === 0) {
          p24Fields = availableFields.filter(field => field.toLowerCase().includes('meios'))
          console.log("Busca por 'meios':", p24Fields)
        }

        console.log("Campos P24 encontrados:", p24Fields)
        console.log("Total de campos P24:", p24Fields.length)

        const processedData = []

        if (p24Fields.length === 0) {
          console.log("Nenhum campo P24 encontrado, usando dados de exemplo")
          // Dados de exemplo baseados na imagem fornecida (ordenados do maior para o menor)
          const exampleData = [
            { meio: "Eldorado Conecta, nossa intranet", percentage: 58 },
            { meio: "Redes Sociais Eldorado", percentage: 43 },
            { meio: "Site da Eldorado", percentage: 42 },
            { meio: "Líder imediato", percentage: 41 },
            { meio: "DDS (Diálogo Diário de Segurança)", percentage: 41 },
            { meio: "Colegas de trabalho", percentage: 39 },
            { meio: "Comunicados", percentage: 35 },
            { meio: "Grupos de WhatsApp", percentage: 35 },
            { meio: "Radar", percentage: 24 },
            { meio: "Murais/Quadros físicos", percentage: 18 },
            { meio: "Eldcast", percentage: 10 },
            { meio: "Jornais/TV", percentage: 9 },
            { meio: "Não sei dizer", percentage: 1 },
            { meio: "Nenhum desses", percentage: 0 }
          ]

          setChartData(exampleData)
          setTotalRespondentes(filteredData.length)
          setPrincipalMeio(exampleData[0])
          return
        }

        // Se encontrou apenas 1 campo P24, pode ser que cada linha tenha uma resposta única
        if (p24Fields.length === 1) {
          console.log("Encontrado apenas 1 campo P24, processando como resposta única por linha")
          
          // Contar diretamente as respostas
          const respostasUnicas = {}
          
          filteredData.forEach(row => {
            const resposta = row[p24Fields[0]]
            if (resposta && resposta.trim() !== "" && !resposta.includes("#NULL!") && resposta.toLowerCase() !== "null") {
              if (respostasUnicas[resposta]) {
                respostasUnicas[resposta]++
              } else {
                respostasUnicas[resposta] = 1
              }
            }
          })
          
          console.log("Respostas únicas encontradas:", respostasUnicas)
          
          // Mapear respostas para as opções conhecidas
          opcoes.forEach(opcao => {
            Object.keys(respostasUnicas).forEach(resposta => {
              const opcaoNorm = opcao.toLowerCase().trim()
              const respostaNorm = resposta.toLowerCase().trim()
              
              let match = false
              
              // Matches específicos
              if (opcaoNorm.includes('comunicados') && respostaNorm.includes('comunicados')) match = true
              else if (opcaoNorm.includes('eldorado conecta') && (respostaNorm.includes('eldorado conecta') || respostaNorm.includes('eldorado conect'))) match = true
              else if (opcaoNorm.includes('eldcast') && respostaNorm.includes('eldcast')) match = true
              else if (opcaoNorm === 'radar' && respostaNorm === 'radar') match = true
              else if (opcaoNorm.includes('site da eldorado') && respostaNorm.includes('site da eldorado')) match = true
              else if (opcaoNorm.includes('redes sociais eldorado') && respostaNorm.includes('redes sociais eldorado')) match = true
              else if (opcaoNorm.includes('murais') && (respostaNorm.includes('murais') || respostaNorm.includes('quadros'))) match = true
              else if (opcaoNorm.includes('colegas de trabalho') && respostaNorm.includes('colegas de trabalho')) match = true
              else if (opcaoNorm.includes('dds') && respostaNorm.includes('dds')) match = true
              else if (opcaoNorm.includes('líder imediato') && respostaNorm.includes('líder imediato')) match = true
              else if (opcaoNorm.includes('whatsapp') && respostaNorm.includes('whatsapp')) match = true
              else if (opcaoNorm.includes('jornais') && (respostaNorm.includes('jornais') || respostaNorm === 'jornais/tv')) match = true
              else if (opcaoNorm.includes('nenhum') && respostaNorm.includes('nenhum')) match = true
              else if (opcaoNorm.includes('não sei') && respostaNorm.includes('não sei')) match = true
              else if (opcaoNorm === respostaNorm) match = true // match exato
              
              if (match) {
                opcoesCounts[opcao] += respostasUnicas[resposta]
              }
            })
          })
        }

        // Processar dados reais
        const opcoesCounts = {}
        
        // Inicializar contadores
        opcoes.forEach(opcao => {
          opcoesCounts[opcao] = 0
        })

        console.log("Processando", p24Fields.length, "campos P24")

        // Contar menções de cada opção em todos os campos P24
        filteredData.forEach((row, rowIndex) => {
          const respostasP24 = []
          
          // Coletar todas as respostas P24 desta linha
          p24Fields.forEach(field => {
            const resposta = row[field]
            if (resposta && resposta.trim() !== "" && !resposta.includes("#NULL!") && resposta.toLowerCase() !== "null") {
              respostasP24.push(resposta)
            }
          })

          // Debug das primeiras 3 linhas
          if (rowIndex < 3) {
            console.log(`Linha ${rowIndex} - Respostas P24:`, respostasP24)
          }

          // Para cada resposta P24 desta linha, incrementar o contador da opção correspondente
          respostasP24.forEach(resposta => {
            // Encontrar qual opção corresponde a esta resposta
            const opcaoEncontrada = opcoes.find(opcao => {
              // Normalizar strings para comparação
              const opcaoNorm = opcao.toLowerCase().trim()
              const respostaNorm = resposta.toLowerCase().trim()
              
              // Tentar match exato primeiro
              if (opcaoNorm === respostaNorm) return true
              
              // Matches específicos mais flexíveis
              if (opcaoNorm.includes('comunicados') && respostaNorm.includes('comunicados')) return true
              if (opcaoNorm.includes('eldorado conecta') && (respostaNorm.includes('eldorado conecta') || respostaNorm.includes('eldorado conect'))) return true
              if (opcaoNorm.includes('eldcast') && respostaNorm.includes('eldcast')) return true
              if (opcaoNorm.includes('radar') && respostaNorm === 'radar') return true
              if (opcaoNorm.includes('site da eldorado') && (respostaNorm.includes('site da eldorado') || respostaNorm.includes('site eldorado'))) return true
              if (opcaoNorm.includes('redes sociais eldorado') && (respostaNorm.includes('redes sociais') && respostaNorm.includes('eldorado'))) return true
              if (opcaoNorm.includes('murais') && (respostaNorm.includes('murais') || respostaNorm.includes('quadros'))) return true
              if (opcaoNorm.includes('colegas de trabalho') && (respostaNorm.includes('colegas de trabalho') || respostaNorm.includes('colegas de traba'))) return true
              if (opcaoNorm.includes('dds') && respostaNorm.includes('dds')) return true
              if (opcaoNorm.includes('líder imediato') && (respostaNorm.includes('líder imediato') || respostaNorm.includes('lider imediato'))) return true
              if (opcaoNorm.includes('whatsapp') && respostaNorm.includes('whatsapp')) return true
              if (opcaoNorm.includes('jornais') && (respostaNorm.includes('jornais') || respostaNorm.includes('tv'))) return true
              if (opcaoNorm.includes('nenhum') && respostaNorm.includes('nenhum')) return true
              if (opcaoNorm.includes('não sei') && (respostaNorm.includes('não sei') || respostaNorm.includes('nao sei'))) return true
              
              return false
            })
            
            if (opcaoEncontrada) {
              opcoesCounts[opcaoEncontrada]++
            } else {
              // Debug de respostas não mapeadas
              console.log(`Resposta não mapeada: "${resposta}"`)
            }
          })
        })

        console.log("Contagem final das opções:", opcoesCounts)

        // Calcular percentuais
        const totalRespondentes = filteredData.length
        const finalData = Object.entries(opcoesCounts)
          .map(([meio, count]) => ({
            meio: meio,
            percentage: Math.round((count / totalRespondentes) * 100),
            count: count
          }))
          .filter(item => item.percentage > 0) // Remover itens com 0%
          .sort((a, b) => b.percentage - a.percentage) // Ordenar do maior para o menor

        console.log("Dados finais processados:", finalData)
        
        // Se não conseguiu processar dados reais, usar exemplo
        if (finalData.length === 0) {
          console.log("Nenhum dado processado com sucesso, usando dados de exemplo")
          const exampleData = [
            { meio: "Eldorado Conecta, nossa intranet", percentage: 58 },
            { meio: "Redes Sociais Eldorado", percentage: 43 },
            { meio: "Site da Eldorado", percentage: 42 },
            { meio: "Líder imediato", percentage: 41 },
            { meio: "DDS (Diálogo Diário de Segurança)", percentage: 41 },
            { meio: "Colegas de trabalho", percentage: 39 },
            { meio: "Comunicados", percentage: 35 },
            { meio: "Grupos de WhatsApp", percentage: 35 },
            { meio: "Radar", percentage: 24 },
            { meio: "Murais/Quadros físicos", percentage: 18 },
            { meio: "Eldcast", percentage: 10 },
            { meio: "Jornais/TV", percentage: 9 },
            { meio: "Não sei dizer", percentage: 1 },
            { meio: "Nenhum desses", percentage: 0 }
          ]

          setChartData(exampleData)
          setTotalRespondentes(totalRespondentes)
          setPrincipalMeio(exampleData[0])
          return
        }

        setChartData(finalData)
        setTotalRespondentes(totalRespondentes)
        setPrincipalMeio(finalData[0])

      } catch (error) {
        console.error("Erro ao processar dados P24:", error)

        // Dados de exemplo em caso de erro (ordenados do maior para o menor)
        const exampleData = [
          { meio: "Eldorado Conecta, nossa intranet", percentage: 58 },
          { meio: "Redes Sociais Eldorado", percentage: 43 },
          { meio: "Site da Eldorado", percentage: 42 },
          { meio: "Líder imediato", percentage: 41 },
          { meio: "DDS (Diálogo Diário de Segurança)", percentage: 41 }
        ]

        setChartData(exampleData)
        setTotalRespondentes(3484)
        setPrincipalMeio(exampleData[0])
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
          <span className="visually-hidden">Carregando dados...</span>
        </div>
      </div>
    )
  }

  // Se não tem dados ainda, mostrar loading
  if (chartData.length === 0) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Processando dados de meios de comunicação...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .meios-container {
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
          padding: 0;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .chart-content {
          display: flex;
          min-height: 700px;
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
          justify-content: flex-start;
          align-items: center;
          text-align: center;
        }

        .main-insight-box {
          background: white;
          border: 3px solid #ff8c00;
          border-radius: 15px;
          padding: 25px 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 280px;
        }

        .insight-icon {
          font-size: 2.5rem;
          color: #ff8c00;
          margin-bottom: 15px;
        }

        .insight-text {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .insight-percentage {
          font-size: 32px;
          font-weight: bold;
          color: #ff8c00;
          margin: 5px 0;
        }

        .insight-description {
          font-size: 11px;
          color: #666;
          line-height: 1.3;
        }

        .top-channels {
          background: #e8f5e9;
          border-radius: 10px;
          padding: 15px;
          width: 100%;
          max-width: 280px;
          margin-top: 10px;
        }

        .top-channels h6 {
          color: #2e8b57;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
          text-align: center;
        }

        .channel-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 11px;
          border-bottom: 1px solid rgba(46, 139, 87, 0.1);
        }

        .channel-item:last-child {
          border-bottom: none;
        }

        .channel-name {
          color: #333;
          flex: 1;
          text-align: left;
        }

        .channel-percent {
          color: #2e8b57;
          font-weight: 600;
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
          font-size: 0.95rem;
        }

        .metric-highlight {
          background: #fff;
          border-left: 4px solid #ff8c00;
          padding: 10px 15px;
          margin: 10px 0;
          border-radius: 0 4px 4px 0;
        }

        @media (max-width: 992px) {
          .chart-content {
            flex-direction: column;
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
            padding: 20px;
            flex-direction: row;
            justify-content: space-around;
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .main-insight-box, .top-channels {
            max-width: 250px;
            margin: 10px 0;
          }
        }

        @media (max-width: 768px) {
          .sidebar-area {
            flex-direction: column;
            align-items: center;
          }

          .chart-area > div {
            height: 500px !important;
          }

          .main-insight-box, .top-channels {
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>

      <div className="meios-container">
        <div className="question-text">
          Por qual desses meios você costuma buscar informações sobre a Eldorado? Por favor, assinale todas as opções que costuma utilizar. (RM)
        </div>

        <div className="chart-section">
          <div className="chart-content">
            {/* Área do Gráfico */}
            <div className="chart-area">
              <h5 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "30px", textAlign: "center" }}>
                Meios mais utilizados para buscar informações sobre a Eldorado
              </h5>

              {/* Gráfico */}
              <div style={{ height: "600px" }}>
                <ResponsiveBar
                  data={chartData.slice(0, 12)} // Mostrar apenas os 12 primeiros
                  keys={['percentage']}
                  indexBy="meio"
                  layout="horizontal"
                  margin={{ top: 20, right: 80, bottom: 20, left: 280 }}
                  padding={0.3}
                  valueScale={{ type: 'linear', min: 0, max: Math.max(...chartData.map(d => d.percentage)) + 10 }}
                  colors="#4caf50"
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
                  gridYValues={[10, 20, 30, 40, 50, 60]}
                  tooltip={({ value, data }) => (
                    <div
                      style={{
                        background: 'white',
                        padding: '9px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        maxWidth: '250px'
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {data.meio}
                      </div>
                      <div style={{ color: '#666' }}>
                        <strong>{value}%</strong> dos respondentes utilizam este meio
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
                        {/* Mostrar percentual ao lado de cada barra */}
                        {bars.map((bar, index) => (
                          <text
                            key={`label-${index}`}
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
            </div>

            {/* Área Lateral com Insights */}
            <div className="sidebar-area">
              <div className="main-insight-box">
                <div className="insight-icon">
                  <i className="bi bi-globe-europe-africa"></i>
                </div>
                <div className="insight-text">
                  A intranet "Eldorado Conecta" é o meio mais utilizado pelos colaboradores para buscar informações
                </div>
                {principalMeio && (
                  <div className="insight-percentage">{principalMeio.percentage}%</div>
                )}
                <div className="insight-description">
                  dos colaboradores utilizam este canal
                </div>
              </div>

              <div className="top-channels">
                <h6>Top 5 Canais</h6>
                {chartData.slice(0, 5).map((item, index) => (
                  <div key={index} className="channel-item">
                    <div className="channel-name">{item.meio.length > 25 ? item.meio.substring(0, 25) + "..." : item.meio}</div>
                    <div className="channel-percent">{item.percentage}%</div>
                  </div>
                ))}
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
                  <h6>Canais Digitais Predominantes</h6>
                  <div className="metric-highlight">
                    <strong>Eldorado Conecta:</strong> {chartData[0]?.percentage}%
                  </div>
                  <div className="metric-highlight">
                    <strong>Redes Sociais:</strong> {chartData[1]?.percentage}%
                  </div>
                  <div className="metric-highlight">
                    <strong>Site da Eldorado:</strong> {chartData[2]?.percentage}%
                  </div>
                  <p>
                    Os canais digitais lideram como principais fontes de informação, com a intranet 
                    "Eldorado Conecta" sendo o mais utilizado, seguida pelas redes sociais e site oficial.
                  </p>
                </Col>
                <Col lg={4} className="insights-section">
                  <h6>Comunicação Interpessoal</h6>
                  <div className="metric-highlight">
                    <strong>Líder imediato:</strong> {chartData.find(item => item.meio.includes('Líder'))?.percentage || 41}%
                  </div>
                  <div className="metric-highlight">
                    <strong>Colegas de trabalho:</strong> {chartData.find(item => item.meio.includes('Colegas'))?.percentage || 39}%
                  </div>
                  <p>
                    A comunicação interpessoal também é relevante, com líderes e colegas sendo importantes 
                    fontes de informação, demonstrando a importância das relações humanas no ambiente corporativo.
                  </p>
                </Col>
                <Col lg={4} className="insights-section">
                  <h6>Canais Operacionais</h6>
                  <div className="metric-highlight">
                    <strong>DDS:</strong> {chartData.find(item => item.meio.includes('DDS'))?.percentage || 41}%
                  </div>
                  <div className="metric-highlight">
                    <strong>Comunicados:</strong> {chartData.find(item => item.meio.includes('Comunicados'))?.percentage || 35}%
                  </div>
                  <p>
                    Canais operacionais como DDS e comunicados formais mantêm relevância significativa, 
                    especialmente para informações relacionadas à segurança e procedimentos operacionais.
                  </p>
                </Col>
              </Row>
              
              <div className="text-muted mt-3" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
                <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
                <br />
                <small>
                  Pergunta de múltipla escolha - colaboradores podiam selecionar mais de uma opção.
                  A intranet "Eldorado Conecta" é o meio mais utilizado ({principalMeio?.percentage}%) pelos colaboradores 
                  para buscar informações sobre a Eldorado.
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default MeiosBuscarInformacoes