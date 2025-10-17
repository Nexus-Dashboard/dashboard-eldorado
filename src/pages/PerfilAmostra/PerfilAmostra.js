import { useState, useEffect } from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
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

        const getFieldValue = (row, fieldName) => {
            return row ? row[fieldName] || "" : ""
        }

        const calculatePercentages = (data, fieldName, skipSort = false) => {
          const counts = {}
          // CORREÇÃO FINAL: O denominador para o cálculo da porcentagem
          // será sempre o número total de respondentes no filtro atual.
          const totalRespondentesNoFiltro = data.length

          const mapOrientacaoSexual = (value) => {
            if (typeof value !== 'string') return value
            const lowerCaseValue = value.toLowerCase()
            if (lowerCaseValue.startsWith('heterossexual')) return 'Heterossexual'
            if (lowerCaseValue.startsWith('homossexual')) return 'Homossexual'
            if (lowerCaseValue.startsWith('bissexual')) return 'Bissexual'
            if (lowerCaseValue.startsWith('assexual')) return 'Assexual'
            if (lowerCaseValue.startsWith('pansexual')) return 'Pansexual'
            return value
          }

          data.forEach(row => {
            let value = getFieldValue(row, fieldName)

            // A contagem ainda ignora valores nulos ou inválidos para não poluírem o gráfico.
            if (!value ||
                value.toString().trim() === "" ||
                value.toString().includes("#NULL!") ||
                value.toString().toLowerCase() === "null") {
              return
            }

            if (fieldName === 'PF8 - Qual a sua orientação sexual?') {
                value = mapOrientacaoSexual(value.toString())
            } else {
                if (value.toString().includes(':')) {
                    value = value.toString().split(':')[0].trim()
                }
            }

            const finalValue = value.toString()
            counts[finalValue] = (counts[finalValue] || 0) + 1
          })

          const result = Object.entries(counts)
            .map(([key, count]) => {
                // A porcentagem é calculada dividindo a contagem da categoria pelo
                // número total de respondentes do filtro, como solicitado.
                const percentage = totalRespondentesNoFiltro > 0 ? (count / totalRespondentesNoFiltro) * 100 : 0
                return {
                    categoria: key,
                    valor: count,
                    percentage: parseFloat(percentage.toFixed(1))
                }
            })

          // Ordenar por percentual crescente, exceto se skipSort for true
          return skipSort ? result : result.sort((a, b) => a.percentage - b.percentage)
        }
        
        setChartData({
          genero: calculatePercentages(filteredData, 'GENERO'),
          orientacaoSexual: calculatePercentages(filteredData, 'PF8 - Qual a sua orientação sexual?'),
          faixaEtaria: calculatePercentages(filteredData, 'FAIXA_ETARIA', true), // skipSort = true
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
  
  const HorizontalBarChart = ({ data, height = 400, maxValue = null, leftMargin = 180 }) => {
    const maxVal = maxValue || Math.max(...data.map(d => d.percentage))
    const roundedMax = Math.ceil(maxVal / 25) * 25
    
    return (
      <div style={{ height }}>
        <ResponsiveBar
          data={data}
          keys={['percentage']}
          indexBy="categoria"
          layout="horizontal"
          margin={{ top: 20, right: 80, bottom: 40, left: leftMargin }}
          padding={0.3}
          valueScale={{ type: 'linear', min: 0, max: roundedMax > 100 ? 100 : roundedMax }}
          colors="#2e8b57"
          borderRadius={3}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            tickValues: [0, 25, 50, 75, 100].filter(val => val <= roundedMax),
            format: v => `${v}%`
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: 0
          }}
          enableLabel={false}
          enableGridY={true}
          gridYValues={[0, 25, 50, 75, 100].filter(val => val <= roundedMax)}
          tooltip={({ value, data }) => (
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
                {data.categoria}
              </div>
              <div style={{ color: '#666' }}>
                <strong>{Number(value).toFixed(1)}%</strong> ({data.valor.toLocaleString()} respondentes)
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
                    {bar.data.data.percentage.toFixed(1)}%
                  </text>
                ))}
              </g>
            )
          ]}
        />
      </div>
    )
  }

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
        .perfil-container {
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

        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, #ff8c00 0%, #2e8b57 100%);
          border: none;
          margin: 50px 0 30px 0;
          border-radius: 1px;
        }

        .section-title {
          color: #2e8b57;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 30px;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: #ff8c00;
          border-radius: 2px;
        }

        .chart-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .chart-title {
          color: #333;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 25px;
          text-align: center;
        }

        .stats-summary {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 40px 0;
          flex-wrap: wrap;
        }

        .stat-item {
          background: white;
          border: 2px solid #2e8b57;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          min-width: 150px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2e8b57;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .tempo-badge {
          background: #2e8b57;
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px auto;
          max-width: 200px;
        }

        .tempo-label {
          font-size: 0.9rem;
          margin-bottom: 5px;
          opacity: 0.9;
        }

        .tempo-value {
          font-size: 1.5rem;
          font-weight: bold;
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
          border-left: 4px solid #ff8c00;
          padding: 10px 15px;
          margin: 10px 0;
          border-radius: 0 4px 4px 0;
        }

        @media (max-width: 768px) {
          .chart-section {
            padding: 20px;
          }
          
          .stats-summary {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          
          .stat-item {
            width: 100%;
            max-width: 200px;
          }

          .section-title {
            font-size: 1.3rem;
          }
        }
      `}</style>

      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Perfil da amostra</h1>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>

        <div className="perfil-container">
          <div className="question-text">
            Conheça o perfil sociodemográfico e profissional dos {totalRespondentes.toLocaleString()} colaboradores que participaram da Pesquisa Nossa Gente Eldorado 2025, representando 63% do total de pessoas empregadas na empresa.
          </div>

          {/* Seção 1: Perfil Demográfico */}
          <h2 className="section-title">Perfil Demográfico</h2>

          {/* Gênero */}
          <div className="chart-section">
            <h5 className="chart-title">Gênero</h5>
            <HorizontalBarChart data={chartData.genero} height={250} />
          </div>

          {/* Orientação Sexual e Faixa Etária */}
          <Row className="mb-4">
            <Col lg={6}>
              <div className="chart-section">
                <h5 className="chart-title">Orientação Sexual</h5>
                <HorizontalBarChart data={chartData.orientacaoSexual} height={300} leftMargin={180} />
              </div>
            </Col>

            <Col lg={6}>
              <div className="chart-section">
                <h5 className="chart-title">Faixa Etária</h5>
                <HorizontalBarChart data={chartData.faixaEtaria} height={300} />
              </div>
            </Col>
          </Row>

          {/* Escolaridade e Cor/Raça */}
          <Row className="mb-4">
            <Col lg={6}>
              <div className="chart-section">
                <h5 className="chart-title">Escolaridade</h5>
                <HorizontalBarChart data={chartData.escolaridade} height={350} />
              </div>
            </Col>

            <Col lg={6}>
              <div className="chart-section">
                <h5 className="chart-title">Cor/Raça</h5>
                <HorizontalBarChart data={chartData.racaCor} height={350} />
              </div>
            </Col>
          </Row>

          {/* Divisor */}
          <hr className="section-divider" />

          {/* Seção 2: Perfil Profissional */}
          <h2 className="section-title">Perfil Profissional</h2>

          {/* Tempo de Eldorado */}
          <div className="chart-section">
            <h5 className="chart-title">Tempo de Eldorado</h5>
            <HorizontalBarChart data={chartData.tempoEldorado} height={300} />
            
            <div className="tempo-badge">
              <div className="tempo-label">Tempo médio na empresa</div>
              <div className="tempo-value">5 anos</div>
            </div>
          </div>

          {/* Diretoria */}
          <div className="chart-section">
            <h5 className="chart-title">Diretorias</h5>
            <HorizontalBarChart data={chartData.diretoria} height={500} leftMargin={380} />
          </div>

          {/* Localidade */}
          <div className="chart-section">
            <h5 className="chart-title">Localidade</h5>
            <HorizontalBarChart data={chartData.localidade} height={400} leftMargin={200} />
          </div>

          {/* Resumo Estatístico */}
          <div className="stats-summary">
            <div className="stat-item">
              <div className="stat-number">{totalRespondentes.toLocaleString()}</div>
              <div className="stat-label">Participantes</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">63%</div>
              <div className="stat-label">Taxa de Participação</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">{chartData.genero.length}</div>
              <div className="stat-label">Categorias de Gênero</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">{chartData.localidade.length}</div>
              <div className="stat-label">Localidades</div>
            </div>
          </div>

          {/* Insights */}
          <Row>
            <Col lg={12}>
              <Card className="insights-card">
                <Row>
                  <Col lg={4} className="insights-section">
                    <h6>Diversidade de Gênero</h6>
                    <div className="metric-highlight">
                      <strong>Homens cisgênero:</strong> {chartData.genero.find(g => g.categoria.toLowerCase().includes('homem'))?.percentage || 0}%<br />
                      <strong>Mulheres cisgênero:</strong> {chartData.genero.find(g => g.categoria.toLowerCase().includes('mulher'))?.percentage || 0}%
                    </div>
                    <p>
                      A amostra reflete a composição da força de trabalho da Eldorado, com representação 
                      equilibrada entre gêneros e abertura para diferentes identidades de gênero.
                    </p>
                  </Col>
                  <Col lg={4} className="insights-section">
                    <h6>Perfil Etário</h6>
                    <div className="metric-highlight">
                      <strong>Faixa predominante:</strong> {chartData.faixaEtaria[0]?.categoria || "N/A"} ({chartData.faixaEtaria[0]?.percentage || 0}%)
                    </div>
                    <p>
                      O perfil etário demonstra uma força de trabalho madura e experiente, com boa 
                      distribuição entre diferentes gerações, favorecendo a troca de conhecimentos.
                    </p>
                  </Col>
                  <Col lg={4} className="insights-section">
                    <h6>Experiência na Empresa</h6>
                    <div className="metric-highlight">
                      <strong>Tempo médio:</strong> 5 anos<br />
                      <strong>Maior grupo:</strong> {chartData.tempoEldorado[0]?.categoria || "N/A"} ({chartData.tempoEldorado[0]?.percentage || 0}%)
                    </div>
                    <p>
                      A combinação entre colaboradores experientes e novos talentos cria um ambiente 
                      propício para inovação e continuidade organizacional.
                    </p>
                  </Col>
                </Row>
                
                <div className="text-muted mt-3" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
                  <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
                  <br />
                  <small>
                    Pesquisa realizada entre 20 de maio e 20 de junho de 2025, com participação de 63% 
                    dos colaboradores da Eldorado Brasil.
                  </small>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  )
}

export default PerfilAmostra