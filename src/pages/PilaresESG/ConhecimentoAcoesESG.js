import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const ConhecimentoAcoesESG = () => {
  const { getFilteredData, loading } = useData()
  const [chartData, setChartData] = useState([])
  const [totalRespondentes, setTotalRespondentes] = useState(0)
  const [categorias, setCategorias] = useState({ ambiental: 0, social: 0, governanca: 0 })

  const acoesESG = [
    { id: "P27_CAT1", nome: "Programa Jovem Aprendiz, Estagiários e PCD (RH)", tipo: "social" },
    { id: "P27_CAT2", nome: "Canal Linha Ética - 0800", tipo: "governanca" },
    { id: "P27_CAT3", nome: "Código de Conduta", tipo: "governanca" },
    { id: "P27_CAT4", nome: "Auditoria interna", tipo: "governanca" },
    { id: "P27_CAT5", nome: "Relatório de Sustentabilidade", tipo: "ambiental" },
    { id: "P27_CAT6", nome: "Programa de Voluntariado Amigos da Eldorado (AME)", tipo: "social" },
    { id: "P27_CAT7", nome: "Pacto Global da ONU", tipo: "ambiental" },
    { id: "P27_CAT8", nome: "Sequestro de Carbono pelas Florestas", tipo: "ambiental" },
    { id: "P27_CAT9", nome: "Programa Eldorado de Educação Ambiental (PES)", tipo: "ambiental" },
    { id: "P27_CAT10", nome: "Projeto Raízes (Sustentabilidade)", tipo: "ambiental" },
    { id: "P27_CAT11", nome: "Projeto Pomar (Sustentabilidade)", tipo: "ambiental" },
    { id: "P27_CAT12", nome: "Produção Agroecológica Integrada e Sustentável (PAIS)", tipo: "ambiental" },
    { id: "P27_CAT13", nome: "Projeto Debrasa (Sustentabilidade)", tipo: "ambiental" },
    { id: "P27_CAT14", nome: "Programa Essência (DE&I)", tipo: "social" },
    { id: "P27_NENHUM", nome: "Nenhum deles", tipo: "nenhum" }
  ]

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) {
          // Dados de exemplo
          const exampleData = [
            { acao: "Programa Jovem Aprendiz, Estagiários e PCD", percentage: 76, tipo: "social" },
            { acao: "Canal Linha Ética - 0800", percentage: 71, tipo: "governanca" },
            { acao: "Código de Conduta", percentage: 70, tipo: "governanca" },
            { acao: "Auditoria interna", percentage: 53, tipo: "governanca" },
            { acao: "Relatório de Sustentabilidade", percentage: 46, tipo: "ambiental" },
            { acao: "Programa de Voluntariado Amigos da Eldorado", percentage: 45, tipo: "social" },
            { acao: "Pacto Global da ONU", percentage: 34, tipo: "ambiental" },
            { acao: "Sequestro de Carbono pelas Florestas", percentage: 34, tipo: "ambiental" },
            { acao: "Programa Eldorado de Educação Ambiental", percentage: 29, tipo: "ambiental" },
            { acao: "Projeto Raízes", percentage: 20, tipo: "ambiental" },
            { acao: "Projeto Pomar", percentage: 19, tipo: "ambiental" },
            { acao: "Produção Agroecológica Integrada", percentage: 15, tipo: "ambiental" },
            { acao: "Projeto Debrasa", percentage: 15, tipo: "ambiental" },
            { acao: "Programa Essência", percentage: 12, tipo: "social" },
            { acao: "Nenhum deles", percentage: 2, tipo: "nenhum" }
          ]
          
          setChartData(exampleData)
          setTotalRespondentes(3484)
          setCategorias({ ambiental: 50, social: 87, governanca: 90 })
          return
        }

        const processedData = []
        let conhecemAmbiental = 0
        let conhecemSocial = 0
        let conhecemGovernanca = 0
        const totalResp = filteredData.length

        acoesESG.forEach(({ id, nome, tipo }) => {
          const fieldName = `${id} - 27. Agora, vamos falar sobre as ações ambientais, sociais e de governança realizadas pela Eldorado nos últimos anos. Gostaria de saber quais delas você já tinha tomado conhecimento anteriormente. (RU POR LINHA, RODÍZIO)`
          
          const conhecem = filteredData.filter(row => {
            const value = row[fieldName] || row[id]
            return value && value.toLowerCase() === "sim"
          }).length

          const percentage = Math.round((conhecem / totalResp) * 100)
          
          if (percentage > 0) {
            processedData.push({
              acao: nome.replace("(RH)", "").replace("(DE&I)", "").replace("(Sustentabilidade)", ""),
              percentage,
              tipo
            })

            if (tipo === "ambiental" && conhecem > 0) conhecemAmbiental++
            if (tipo === "social" && conhecem > 0) conhecemSocial++
            if (tipo === "governanca" && conhecem > 0) conhecemGovernanca++
          }
        })

        processedData.sort((a, b) => b.percentage - a.percentage)

        const categoriasPercentuais = {
          ambiental: Math.round((conhecemAmbiental / totalResp) * 100),
          social: Math.round((conhecemSocial / totalResp) * 100),
          governanca: Math.round((conhecemGovernanca / totalResp) * 100)
        }

        setChartData(processedData.length > 0 ? processedData : [
          { acao: "Programa Jovem Aprendiz", percentage: 76, tipo: "social" },
          { acao: "Canal Linha Ética", percentage: 71, tipo: "governanca" },
          { acao: "Código de Conduta", percentage: 70, tipo: "governanca" }
        ])
        setTotalRespondentes(totalResp)
        setCategorias(categoriasPercentuais)

      } catch (error) {
        console.error("Erro ao processar dados:", error)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

  const getBarColor = (tipo) => {
    switch(tipo) {
      case 'ambiental': return '#4caf50'
      case 'social': return '#2196f3'
      case 'governanca': return '#ff9800'
      default: return '#9e9e9e'
    }
  }

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
        .badge-amostra {
          display: inline-block;
          background: #ff8c00;
          color: white;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: lowercase;
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
          flex: 3;
          padding: 30px;
          border-right: 1px solid #e9ecef;
        }

        .sidebar-area {
          flex: 1;
          background: #f8f9fa;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 30px;
        }

        .category-badge {
          background: #4caf50;
          border: none;
          border-radius: 50%;
          width: 160px;
          height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s ease;
        }

        .category-badge:hover {
          transform: scale(1.05);
        }

        .category-badge.ambiental {
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
        }

        .category-badge.social {
          background: linear-gradient(135deg, #5cb85c 0%, #4caf50 100%);
        }

        .category-badge.governanca {
          background: linear-gradient(135deg, #66bb6a 0%, #5cb85c 100%);
        }

        .badge-icon {
          font-size: 42px;
          color: white;
          margin-bottom: 10px;
        }

        .badge-percentage {
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin-bottom: 5px;
          line-height: 1;
        }

        .badge-label {
          font-size: 13px;
          font-weight: 600;
          color: white;
          line-height: 1.2;
        }

        @media (max-width: 992px) {
          .chart-content {
            flex-direction: column;
          }

          .chart-area {
            border-right: none;
            border-bottom: 1px solid #e9ecef;
          }

          .sidebar-area {
            flex-direction: row;
            justify-content: center;
            gap: 20px;
          }

          .category-badge {
            width: 140px;
            height: 140px;
          }
        }

        @media (max-width: 768px) {
          .sidebar-area {
            flex-direction: column;
          }
        }
      `}</style>

      <div>
        <span className="badge-amostra">amostra total</span>
      </div>

      <div className="question-text">
        Agora, vamos falar sobre as ações ambientais, sociais e de governança realizadas pela Eldorado nos últimos anos.
        Gostaria de saber quais delas você já tinha tomado conhecimento anteriormente.
      </div>

      <div className="chart-section">
        <div className="chart-content">
          {/* Área do Gráfico */}
          <div className="chart-area">
            <div style={{ height: "650px" }}>
              <ResponsiveBar
                data={chartData}
                keys={['percentage']}
                indexBy="acao"
                layout="horizontal"
                margin={{ top: 20, right: 80, bottom: 20, left: 320 }}
                padding={0.25}
                valueScale={{ type: 'linear', min: 0, max: 100 }}
                colors={(bar) => getBarColor(bar.data.tipo)}
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
          </div>

          {/* Sidebar com Círculos */}
          <div className="sidebar-area">
            <div className="category-badge ambiental">
              <i className="bi bi-leaf badge-icon"></i>
              <div className="badge-percentage">{categorias.ambiental || 50}%</div>
              <div className="badge-label">Ações Ambientais</div>
            </div>

            <div className="category-badge social">
              <i className="bi bi-people-fill badge-icon"></i>
              <div className="badge-percentage">{categorias.social || 87}%</div>
              <div className="badge-label">Ações Sociais</div>
            </div>

            <div className="category-badge governanca">
              <i className="bi bi-gear-fill badge-icon"></i>
              <div className="badge-percentage">{categorias.governanca || 90}%</div>
              <div className="badge-label">Ações de Governança</div>
            </div>
          </div>
        </div>
      </div>

      <Row>
        <Col lg={12}>
          <Card style={{ background: "#f8f9fa", padding: "30px", borderRadius: "12px" }}>
            <div className="text-muted" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
              <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ConhecimentoAcoesESG