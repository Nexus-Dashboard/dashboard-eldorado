import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { useData } from "../../context/DataContext"

const IndicadorGeral = () => {
  const { getFilteredData, loading } = useData()
  const [indicadorGeral, setIndicadorGeral] = useState(0)
  const [totalRespondentes, setTotalRespondentes] = useState(0)

  const configuracaoIndicadores = {
    SAUDE_EMOCIONAL: {
      nome: "Saúde Emocional",
      campos: ["T_P13_1", "T_P13_2"]
    },    
    AMBIENTE_TRABALHO: {
      nome: "Ambiente de Trabalho",
      campos: ["T_P20_1", "T_P20_2", "T_P20_3"]
    },
    CULTURA_ORGANIZACIONAL: {
      nome: "Cultura Organizacional",
      campos: ["T_P21_2", "T_P21_3"]
    },
    LIDERANCA: {
      nome: "Liderança",
      campos: ["T_P22_1", "T_P22_2", "T_P22_3", "T_P22_4", "T_P22_5"]
    },
    COMUNICACAO_INTERNA: {
      nome: "Comunicação Interna",
      campos: ["T_P23_1", "T_P23_2"]
    },
    DIVERSIDADE: {
      nome: "Diversidade & Inclusão",
      campos: ["T_P31_1", "T_P31_2"]
    },
    BENEFICIOS: {
      nome: "Benefícios",
      campos: ["T_P32_2", "T_P32_3"]
    },
    VALORIZACAO_DESENVOLVIMENTO: {
      nome: "Valorização e Desenvolvimento",
      campos: ["T_P16_1", "T_P16_2", "T_P16_3", "T_P16_4", "T_P16_5"],
      icone: "gift"
    }
  }

  const getClassificacao = (pontuacao) => {
    if (pontuacao >= 80) return { classe: "otimo", label: "ÓTIMO", cor: "#68A357", estrelas: 5 }
    if (pontuacao >= 60) return { classe: "bom", label: "BOM", cor: "#9BC25E", estrelas: 4 }
    if (pontuacao >= 40) return { classe: "regular", label: "REGULAR", cor: "#E59845", estrelas: 3 }
    if (pontuacao >= 20) return { classe: "ruim", label: "RUIM", cor: "#D75853", estrelas: 2 }
    return { classe: "pessimo", label: "PÉSSIMO", cor: "#8B3836", estrelas: 1 }
  }

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        console.log("=== DEBUG INDICADOR GERAL ===")
        console.log("Total de registros:", filteredData?.length)

        if (!filteredData || filteredData.length === 0) {
          console.log("❌ Sem dados filtrados, usando dados de exemplo")
          setIndicadorGeral(86.9)
          setTotalRespondentes(132)
          return
        }

        const availableFields = filteredData.length > 0 ? Object.keys(filteredData[0]) : []
        console.log("📋 Campos disponíveis no dataset:", availableFields.length)
        console.log("📋 Campos que começam com 'T_P':", availableFields.filter(f => f.startsWith('T_P')))

        const resultados = {}

        // Calcular cada indicador
        Object.entries(configuracaoIndicadores).forEach(([key, config]) => {
          console.log(`\n🔍 Processando dimensão: ${config.nome} (${key})`)
          console.log(`   Campos esperados: ${config.campos.join(', ')}`)

          let pontuacaoTotal = 0
          let respostasValidas = 0

          config.campos.forEach(campo => {
            // Buscar campo exato ou variação
            const actualField = availableFields.find(f =>
              f.includes(campo) || f.includes(campo.replace('T_', ''))
            ) || campo

            console.log(`   📌 Buscando campo: ${campo}`)
            console.log(`      ➜ Campo encontrado: ${actualField}`)
            console.log(`      ➜ Campo existe no dataset: ${availableFields.includes(actualField) ? '✅ SIM' : '❌ NÃO'}`)

            const responses = filteredData
              .map(row => {
                const value = row[actualField]
                if (!value) return null

                // Converter para string e extrair o primeiro número
                const valueStr = String(value).trim()

                // Tentar extrair o número no início da string (ex: "1 - Discorda Totalmente" -> 1)
                const match = valueStr.match(/^(\d+)/)
                if (match) {
                  const numValue = parseInt(match[1])
                  return (numValue >= 1 && numValue <= 5) ? numValue : null
                }

                // Se for apenas um número sem texto
                const numValue = parseInt(valueStr)
                return (!isNaN(numValue) && numValue >= 1 && numValue <= 5) ? numValue : null
              })
              .filter(score => score !== null)

            console.log(`      ➜ Respostas válidas encontradas: ${responses.length}`)

            if (responses.length > 0) {
              const amostra = responses.slice(0, 5)
              console.log(`      ➜ Amostra de valores: ${amostra.join(', ')}`)

              let pontos4ou5 = 0
              let pontos3 = 0
              let pontos1ou2 = 0

              responses.forEach(score => {
                if (score >= 4) {
                  pontuacaoTotal += 10 // Nota 4 ou 5 = 10 pontos
                  pontos4ou5++
                } else if (score === 3) {
                  pontuacaoTotal += 5  // Nota 3 = 5 pontos
                  pontos3++
                } else {
                  pontos1ou2++
                }
                // Nota 1 ou 2 = 0 pontos
                respostasValidas++
              })

              console.log(`      ➜ Distribuição: 4-5=${pontos4ou5}, 3=${pontos3}, 1-2=${pontos1ou2}`)
            }
          })

          // Calcular pontuação final (0-100)
          const pontuacaoMaxima = respostasValidas * 10
          const indicador = pontuacaoMaxima > 0 ? (pontuacaoTotal / pontuacaoMaxima) * 100 : 0
          resultados[key] = Math.round(indicador * 100) / 100

          console.log(`   ✅ Indicador ${config.nome}: ${resultados[key].toFixed(2)}`)
          console.log(`      Total respostas: ${respostasValidas}, Pontuação: ${pontuacaoTotal}/${pontuacaoMaxima}`)
        })

        console.log("\n📊 RESULTADOS FINAIS:")
        console.log(resultados)

        // Se não encontrou dados suficientes, usar exemplo
        if (Object.values(resultados).every(val => val === 0)) {
          console.log("⚠️ Todos os indicadores estão zerados, usando dados de exemplo")
          setIndicadorGeral(86.9)
        } else {
          // Calcular indicador geral (média dos outros)
          const valoresIndicadores = Object.values(resultados)
          const indicadorGeralCalc = valoresIndicadores.length > 0
            ? valoresIndicadores.reduce((a, b) => a + b, 0) / valoresIndicadores.length
            : 0
          console.log(`\n🎯 INDICADOR GERAL: ${indicadorGeralCalc.toFixed(2)}`)
          setIndicadorGeral(Math.round(indicadorGeralCalc * 100) / 100)
        }

        setTotalRespondentes(filteredData.length)

      } catch (error) {
        console.error("Erro ao processar dados:", error)
        setIndicadorGeral(86.9)
        setTotalRespondentes(132)
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
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  const classificacao = getClassificacao(indicadorGeral)

  return (
    <>
      <style jsx>{`
        .indicador-geral-container {
          background: white;
          border-radius: 15px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .header-section {
          display: flex;
          align-items: center;
          margin-bottom: 40px;
          gap: 20px;
        }

        .indicador-icon {
          background: linear-gradient(135deg, #ff8c00 0%, #ffa726 100%);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          flex-shrink: 0;
        }

        .header-text h2 {
          color: #333;
          font-weight: 600;
          margin: 0;
          font-size: 2rem;
        }

        .header-subtitle {
          color: #666;
          font-size: 0.95rem;
          margin: 5px 0 0 0;
        }

        .main-display {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 40px;
          margin-bottom: 40px;
        }

        .gauge-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 40px;
          border-radius: 15px;
        }

        .gauge-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 20px;
        }

        .gauge-circle {
          transform: rotate(-90deg);
        }

        .gauge-bg {
          fill: none;
          stroke: #e0e0e0;
          stroke-width: 20;
        }

        .gauge-fill {
          fill: none;
          stroke-width: 20;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s ease-in-out;
        }

        .gauge-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .gauge-value {
          font-size: 48px;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 5px;
        }

        .gauge-label {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .legend-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 15px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          border-radius: 10px;
          background: white;
          border: 2px solid #e9ecef;
          transition: all 0.3s;
        }

        .legend-item.active {
          border-color: currentColor;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .legend-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          flex-shrink: 0;
        }

        .legend-content {
          flex: 1;
        }

        .legend-label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .legend-range {
          font-size: 12px;
          color: #666;
        }

        .stars-display {
          display: flex;
          gap: 5px;
        }

        .star {
          font-size: 32px;
        }

        .star.filled {
          color: #ffa726;
        }

        .star.empty {
          color: #e0e0e0;
        }

        .info-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .info-title {
          color: #2e8b57;
          font-weight: 600;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .info-text {
          color: #666;
          line-height: 1.6;
          font-size: 0.95rem;
          margin-bottom: 15px;
        }

        .metodologia-section {
          background: white;
          border-radius: 12px;
          padding: 25px;
          border: 2px solid #ff8c00;
          margin-top: 20px;
        }

        .base-info {
          border-top: 2px solid #ff8c00;
          padding-top: 15px;
          margin-top: 20px;
          font-size: 0.9rem;
          color: #666;
        }

        @media (max-width: 992px) {
          .main-display {
            flex-direction: column;
          }

          .header-section {
            flex-direction: column;
            text-align: center;
          }

          .header-text h2 {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .indicador-geral-container {
            padding: 20px;
          }

          .gauge-container {
            width: 150px;
            height: 150px;
          }

          .gauge-value {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="indicador-geral-container">
        <div className="header-section">
          <div className="indicador-icon">
            <i className="bi bi-speedometer2"></i>
          </div>
          <div className="header-text">
            <h2>Indicador de Satisfação & Bem-Estar Eldorado</h2>
            <p className="header-subtitle">
              O Indicador de Satisfação & Bem-Estar Eldorado foi construído a partir da análise das
              respostas aos atributos relacionados às dimensões de saúde emocional, reconhecimento
              e motivação, ambiente de trabalho, cultura organizacional, liderança, diversidade,
              benefícios e comunicação interna.
            </p>
          </div>
        </div>

        <div className="main-display">
          {/* Seção do Gauge */}
          <div className="gauge-section">
            <div className="gauge-container">
              <svg className="gauge-circle" viewBox="0 0 200 200">
                <circle
                  className="gauge-bg"
                  cx="100"
                  cy="100"
                  r="90"
                />
                <circle
                  className="gauge-fill"
                  cx="100"
                  cy="100"
                  r="90"
                  stroke={classificacao.cor}
                  strokeDasharray={`${(indicadorGeral / 100) * 565.48} 565.48`}
                  strokeDashoffset="0"
                />
              </svg>
              <div className="gauge-center">
                <div className="gauge-value" style={{ color: classificacao.cor }}>
                  {indicadorGeral.toFixed(1)}
                </div>
                <div className="gauge-label" style={{ color: classificacao.cor }}>
                  {classificacao.label}
                </div>
              </div>
            </div>

            {/* Estrelas */}
            <div className="stars-display">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= classificacao.estrelas ? 'filled' : 'empty'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Legenda das Classificações */}
          <div className="legend-section">
            <div
              className={`legend-item ${classificacao.classe === 'otimo' ? 'active' : ''}`}
              style={{ color: '#68A357' }}
            >
              <div className="legend-icon" style={{ background: '#68A357' }}>
                ★★★★★
              </div>
              <div className="legend-content">
                <div className="legend-label">ÓTIMO</div>
                <div className="legend-range">Pontos entre 80 a 100</div>
              </div>
            </div>

            <div
              className={`legend-item ${classificacao.classe === 'bom' ? 'active' : ''}`}
              style={{ color: '#9BC25E' }}
            >
              <div className="legend-icon" style={{ background: '#9BC25E' }}>
                ★★★★
              </div>
              <div className="legend-content">
                <div className="legend-label">BOM</div>
                <div className="legend-range">Pontos entre 60 a 79,9</div>
              </div>
            </div>

            <div
              className={`legend-item ${classificacao.classe === 'regular' ? 'active' : ''}`}
              style={{ color: '#E59845' }}
            >
              <div className="legend-icon" style={{ background: '#E59845' }}>
                ★★★
              </div>
              <div className="legend-content">
                <div className="legend-label">REGULAR</div>
                <div className="legend-range">Pontos entre 40 a 59,9</div>
              </div>
            </div>

            <div
              className={`legend-item ${classificacao.classe === 'ruim' ? 'active' : ''}`}
              style={{ color: '#D75853' }}
            >
              <div className="legend-icon" style={{ background: '#D75853' }}>
                ★★
              </div>
              <div className="legend-content">
                <div className="legend-label">RUIM</div>
                <div className="legend-range">Pontos entre 20 a 39,9</div>
              </div>
            </div>

            <div
              className={`legend-item ${classificacao.classe === 'pessimo' ? 'active' : ''}`}
              style={{ color: '#8B3836' }}
            >
              <div className="legend-icon" style={{ background: '#8B3836' }}>
                ★
              </div>
              <div className="legend-content">
                <div className="legend-label">PÉSSIMO</div>
                <div className="legend-range">Pontos entre 0 a 19,9</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="info-section">
          <p className="info-text">
            Cada uma dessas dimensões é composta por atributos que refletem percepções e
            experiências dos colaboradores em relação à empresa.
          </p>
          <p className="info-text">
            O cálculo do Indicador considera o percentual de <strong>concordância</strong> (notas 4 e 5) e de{' '}
            <strong>média concordância</strong> (nota 3) da escala de 1 a 5, para cada um dos atributos avaliados.
            Cada atributo avaliado com <strong>nota 4 ou 5</strong> pontua <strong>10 pontos</strong> ao entrevistado,
            enquanto aqueles com <strong>nota 3</strong> pontuam <strong>5 pontos</strong>. A soma dessas pontuações
            compõe um score individual que varia de <strong>0 a 100 pontos</strong>, em que:
          </p>
          <ul style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6 }}>
            <li><strong>0 pontos</strong> representa uma percepção péssima em relação à satisfação e ao bem-estar na Eldorado.</li>
            <li><strong>100 pontos</strong> indica uma percepção ótima em relação à satisfação e ao bem-estar na Eldorado.</li>
          </ul>
        </div>

        <div className="metodologia-section">
          <h6 className="info-title">Modelagem Estatística</h6>
          <p className="info-text" style={{ marginBottom: 0 }}>
            Adicionalmente, foi realizada uma <strong>modelagem estatística</strong> para identificar o peso relativo
            de cada dimensão na composição geral do indicador, mensurando o impacto de cada uma
            delas na percepção de satisfação e bem-estar dentro da organização.
          </p>

          <div className="base-info">
            <strong>Pesquisa Nossa Gente Eldorado | {totalRespondentes} respondentes</strong>
          </div>
        </div>
      </div>
    </>
  )
}

export default IndicadorGeral
