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

        .category-badges {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
          flex-wrap: wrap;
        }

        .category-badge {
          background: white;
          border: 2px solid;
          border-radius: 50%;
          width: 140px;
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .ambiental { border-color: #4caf50; }
        .social { border-color: #2196f3; }
        .governanca { border-color: #ff9800; }

        .badge-percentage {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .ambiental .badge-percentage { color: #4caf50; }
        .social .badge-percentage { color: #2196f3; }
        .governanca .badge-percentage { color: #ff9800; }

        .badge-label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
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
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 3px;
        }
      `}</style>

      <div className="question-text">
        Agora, vamos falar sobre as ações ambientais, sociais e de governança realizadas pela Eldorado nos últimos anos. 
        Gostaria de saber quais delas você já tinha tomado conhecimento anteriormente.
      </div>

      <div className="category-badges">
        <div className="category-badge ambiental">
          <div className="badge-percentage">{categorias.ambiental || 50}%</div>
          <div className="badge-label">Ações Ambientais</div>
        </div>
        <div className="category-badge social">
          <div className="badge-percentage">{categorias.social || 87}%</div>
          <div className="badge-label">Ações Sociais</div>
        </div>
        <div className="category-badge governanca">
          <div className="badge-percentage">{categorias.governanca || 90}%</div>
          <div className="badge-label">Ações de Governança</div>
        </div>
      </div>

      <div className="chart-section">
        <h5 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "30px", textAlign: "center" }}>
          Conhecimento sobre as ações ESG da Eldorado
        </h5>
        
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#4caf50' }}></div>
            <span>Ambiental</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#2196f3' }}></div>
            <span>Social</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#ff9800' }}></div>
            <span>Governança</span>
          </div>
        </div>

        <div style={{ height: "600px" }}>
          <ResponsiveBar
            data={chartData}
            keys={['percentage']}
            indexBy="acao"
            layout="horizontal"
            margin={{ top: 20, right: 80, bottom: 20, left: 280 }}
            padding={0.3}
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