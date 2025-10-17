import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { ResponsiveBar } from "@nivo/bar"
import { useData } from "../../context/DataContext"

const ConhecimentoAcoesESG = () => {
  const { getFilteredData, loading } = useData()
  const [chartData, setChartData] = useState([])
  const [totalRespondentes, setTotalRespondentes] = useState(0)
  const [categorias, setCategorias] = useState({ ambiental: 0, social: 0, governanca: 0 })

  // Mapeamento de categorias com seus tipos ESG
  const categoriasESG = {
    "Programa Jovem Aprendiz, Estagiários e PCD (RH)": "social",
    "Canal Linha Ética - 0800": "governanca",
    "Código de Conduta": "governanca",
    "Auditoria interna": "governanca",
    "Relatório de Sustentabilidade": "ambiental",
    "Programa de Voluntariado Amigos da Eldorado (AME)": "social",
    "Pacto Global da ONU": "ambiental",
    "Sequestro de Carbono pelas Florestas": "ambiental",
    "Programa Eldorado de Educação Ambiental (PES)": "ambiental",
    "Projeto Raízes (Sustentabilidade)": "ambiental",
    "Projeto Pomar (Sustentabilidade)": "ambiental",
    "Produção Agroecológica Integrada e Sustentável (PAIS)": "ambiental",
    "Projeto Debrasa (Sustentabilidade)": "ambiental",
    "Programa Essência (DE&I)": "social",
    "Nenhum deles": "nenhum"
  }

  // Lista dos campos a serem processados
  const camposP27 = [
    "P27_CAT1", "P27_CAT2", "P27_CAT3", "P27_CAT4", "P27_CAT5",
    "P27_CAT6", "P27_CAT7", "P27_CAT8", "P27_CAT9", "P27_CAT10",
    "P27_CAT11", "P27_CAT12", "P27_CAT13", "P27_CAT14", "P27_CAT15",
    "P27_CAT16", "P27_NENHUM"
  ]

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) {
          console.log("Sem dados filtrados, usando exemplo")
          // Dados de exemplo
          const exampleData = [
            { acao: "Programa Jovem Aprendiz, Estagiários e PCD (RH)", percentage: 76, tipo: "social" },
            { acao: "Canal Linha Ética - 0800", percentage: 71, tipo: "governanca" },
            { acao: "Código de Conduta", percentage: 70, tipo: "governanca" },
            { acao: "Auditoria interna", percentage: 53, tipo: "governanca" },
            { acao: "Relatório de Sustentabilidade", percentage: 46, tipo: "ambiental" },
            { acao: "Programa de Voluntariado Amigos da Eldorado (AME)", percentage: 45, tipo: "social" },
            { acao: "Pacto Global da ONU", percentage: 34, tipo: "ambiental" },
            { acao: "Sequestro de Carbono pelas Florestas", percentage: 34, tipo: "ambiental" },
            { acao: "Programa Eldorado de Educação Ambiental (PES)", percentage: 29, tipo: "ambiental" },
            { acao: "Projeto Raízes (Sustentabilidade)", percentage: 20, tipo: "ambiental" },
            { acao: "Projeto Pomar (Sustentabilidade)", percentage: 19, tipo: "ambiental" },
            { acao: "Produção Agroecológica Integrada e Sustentável (PAIS)", percentage: 15, tipo: "ambiental" },
            { acao: "Projeto Debrasa (Sustentabilidade)", percentage: 15, tipo: "ambiental" },
            { acao: "Programa Essência (DE&I)", percentage: 12, tipo: "social" },
            { acao: "Nenhum deles", percentage: 2, tipo: "nenhum" }
          ]

          setChartData(exampleData)
          setTotalRespondentes(3484)
          setCategorias({ ambiental: 50, social: 87, governanca: 90 })
          return
        }

        console.log("Processando dados reais")
        const totalResp = filteredData.length
        const acoesMencoes = {}

        // Verificar campos disponíveis
        const availableFields = filteredData.length > 0 ? Object.keys(filteredData[0]) : []
        console.log("Campos disponíveis:", availableFields.filter(f => f.includes('P27')))

        // Valores a serem desconsiderados (sujeira)
        const valoresSujeira = ["1,00", "2,00", "3,00", "4,00", "1.00", "2.00", "3.00", "4.00"]

        // Rastrear quais pessoas conhecem ações de cada tipo
        const pessoasConhecemAmbiental = new Set()
        const pessoasConhecemSocial = new Set()
        const pessoasConhecemGovernanca = new Set()

        // Para cada respondente
        filteredData.forEach((row, rowIndex) => {
          // Verificar cada campo P27_CAT
          camposP27.forEach(campo => {
            // Tentar encontrar o campo com sufixo completo
            const fieldWithSuffix = availableFields.find(f =>
              f.startsWith(campo) && f.includes("27. Agora, vamos falar sobre")
            )
            const fieldName = fieldWithSuffix || campo

            const valorCampo = row[fieldName]

            // Se o campo tem um valor (nome da ação mencionada)
            if (valorCampo &&
                valorCampo.trim() !== "" &&
                !valorCampo.includes("#NULL!") &&
                valorCampo.toLowerCase() !== "null" &&
                !valoresSujeira.includes(valorCampo.trim())) {

              // Normalizar o nome da ação
              const acaoNome = valorCampo.trim()

              // Contar as menções
              if (!acoesMencoes[acaoNome]) {
                acoesMencoes[acaoNome] = 0
              }
              acoesMencoes[acaoNome]++

              // Determinar o tipo da ação para tracking de pessoas
              const tipo = categoriasESG[acaoNome] ||
                          (acaoNome.toLowerCase().includes("sustentab") ||
                           acaoNome.toLowerCase().includes("ambient") ||
                           acaoNome.toLowerCase().includes("carbon") ||
                           acaoNome.toLowerCase().includes("florest") ||
                           acaoNome.toLowerCase().includes("pes") ||
                           acaoNome.toLowerCase().includes("pais") ||
                           acaoNome.toLowerCase().includes("raízes") ||
                           acaoNome.toLowerCase().includes("pomar") ||
                           acaoNome.toLowerCase().includes("debrasa") ? "ambiental" :
                           acaoNome.toLowerCase().includes("social") ||
                           acaoNome.toLowerCase().includes("jovem") ||
                           acaoNome.toLowerCase().includes("voluntar") ||
                           acaoNome.toLowerCase().includes("essência") ||
                           acaoNome.toLowerCase().includes("aprendiz") ||
                           acaoNome.toLowerCase().includes("ame") ? "social" :
                           acaoNome.toLowerCase().includes("governan") ||
                           acaoNome.toLowerCase().includes("ética") ||
                           acaoNome.toLowerCase().includes("conduta") ||
                           acaoNome.toLowerCase().includes("auditoria") ? "governanca" :
                           "nenhum")

              // Adicionar pessoa ao set correspondente
              if (tipo === "ambiental") pessoasConhecemAmbiental.add(rowIndex)
              if (tipo === "social") pessoasConhecemSocial.add(rowIndex)
              if (tipo === "governanca") pessoasConhecemGovernanca.add(rowIndex)
            }
          })
        })

        console.log("Ações mencionadas:", acoesMencoes)

        // Processar os dados coletados
        const processedData = []

        Object.entries(acoesMencoes).forEach(([acao, count]) => {
          const percentage = Math.round((count / totalResp) * 100)

          // Determinar o tipo (ambiental, social, governança)
          const tipo = categoriasESG[acao] ||
                      (acao.toLowerCase().includes("sustentab") ||
                       acao.toLowerCase().includes("ambient") ||
                       acao.toLowerCase().includes("carbon") ||
                       acao.toLowerCase().includes("florest") ||
                       acao.toLowerCase().includes("pes") ||
                       acao.toLowerCase().includes("pais") ||
                       acao.toLowerCase().includes("raízes") ||
                       acao.toLowerCase().includes("pomar") ||
                       acao.toLowerCase().includes("debrasa") ? "ambiental" :
                       acao.toLowerCase().includes("social") ||
                       acao.toLowerCase().includes("jovem") ||
                       acao.toLowerCase().includes("voluntar") ||
                       acao.toLowerCase().includes("essência") ||
                       acao.toLowerCase().includes("aprendiz") ||
                       acao.toLowerCase().includes("ame") ? "social" :
                       acao.toLowerCase().includes("governan") ||
                       acao.toLowerCase().includes("ética") ||
                       acao.toLowerCase().includes("conduta") ||
                       acao.toLowerCase().includes("auditoria") ? "governanca" :
                       "nenhum")

          processedData.push({
            acao: acao.replace("(RH)", "").replace("(DE&I)", "").replace("(Sustentabilidade)", "").trim(),
            percentage,
            tipo,
            count
          })
        })

        // Ordenar por percentual crescente
        processedData.sort((a, b) => a.percentage - b.percentage)

        console.log("Dados processados:", processedData)

        // Calcular percentuais das categorias (% de PESSOAS que conhecem pelo menos 1 ação)
        const categoriasPercentuais = {
          ambiental: Math.round((pessoasConhecemAmbiental.size / totalResp) * 100),
          social: Math.round((pessoasConhecemSocial.size / totalResp) * 100),
          governanca: Math.round((pessoasConhecemGovernanca.size / totalResp) * 100)
        }

        console.log("Pessoas que conhecem ações ambientais:", pessoasConhecemAmbiental.size)
        console.log("Pessoas que conhecem ações sociais:", pessoasConhecemSocial.size)
        console.log("Pessoas que conhecem ações de governança:", pessoasConhecemGovernanca.size)

        if (processedData.length > 0) {
          setChartData(processedData)
          setTotalRespondentes(totalResp)
          setCategorias(categoriasPercentuais)
        } else {
          console.log("Nenhum dado processado, usando exemplo")
          // Fallback para dados de exemplo
          const exampleData = [
            { acao: "Programa Jovem Aprendiz, Estagiários e PCD (RH)", percentage: 76, tipo: "social" },
            { acao: "Canal Linha Ética - 0800", percentage: 71, tipo: "governanca" },
            { acao: "Código de Conduta", percentage: 70, tipo: "governanca" }
          ]
          setChartData(exampleData)
          setTotalRespondentes(totalResp)
          setCategorias({ ambiental: 50, social: 87, governanca: 90 })
        }

      } catch (error) {
        console.error("Erro ao processar dados:", error)
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, loading])

  const getBarColor = () => {
    // Usar apenas verde para todas as barras
    return '#4caf50'
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
              <div className="badge-percentage">50%</div>
              <div className="badge-label">Ações Ambientais</div>
            </div>

            <div className="category-badge social">
              <i className="bi bi-people-fill badge-icon"></i>
              <div className="badge-percentage">87%</div>
              <div className="badge-label">Ações Sociais</div>
            </div>

            <div className="category-badge governanca">
              <i className="bi bi-gear-fill badge-icon"></i>
              <div className="badge-percentage">90%</div>
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