import { useState, useEffect } from "react"
import { Row, Col, Card } from "react-bootstrap"
import { useData } from "../../context/DataContext"

const Indicadores = () => {
  // O hook useData é mantido, mas seus dados não serão usados neste modo de exibição
  const { loading } = useData()
  const [indicadores, setIndicadores] = useState({})
  const [totalRespondentes, setTotalRespondentes] = useState(0)

  // Mapeamento para nomes mais amigáveis
  const nomesDiretorias = {
    INDUSTRIAL: "Industrial",
    RH_SUSTENTABILIDADE_E_COMUNICACAO: "RH, Sustentabilidade e Comunicação",
    JURIDICA: "Jurídica",
    TI: "TI",
    FLORESTAL: "Florestal",
    FINANCEIRA: "Financeira",
    COMERCIAL_E_LOGISTICA: "Comercial e Logística",
    TRANSPORTADORA: "Transportadora",
    PRESIDENCIA: "Presidência"
  }

  const getClassificacao = (pontuacao) => {
    if (pontuacao >= 80) return { classe: "otimo", label: "ÓTIMO", cor: "#2e7d32" }
    if (pontuacao >= 60) return { classe: "bom", label: "BOM", cor: "#4caf50" }
    if (pontuacao >= 40) return { classe: "regular", label: "REGULAR", cor: "#ff9800" }
    if (pontuacao >= 20) return { classe: "ruim", label: "RUIM", cor: "#f44336" }
    return { classe: "pessimo", label: "PÉSSIMO", cor: "#d32f2f" }
  }

  useEffect(() => {
    // Utiliza diretamente os dados de exemplo baseados na imagem, como solicitado.
    console.log("📊 Usando dados de exemplo para as diretorias Eldorado.")
    
    const eldoradoData = {
      GERAL: 86.9,
      DIRETORIAS: {
        INDUSTRIAL: 90.9,
        RH_SUSTENTABILIDADE_E_COMUNICACAO: 90.3,
        JURIDICA: 87.7,
        TI: 87.1,
        FLORESTAL: 86.9,
        FINANCEIRA: 85.6,
        COMERCIAL_E_LOGISTICA: 85.3,
        TRANSPORTADORA: 75.3,
        PRESIDENCIA: 74.6
      }
    };

    setIndicadores(eldoradoData);
    setTotalRespondentes(134); // Valor de exemplo, pode ser ajustado se necessário
  }, []) // O array vazio [] faz com que o efeito rode apenas uma vez.

  const TermometroComponent = ({ valor, titulo, icone }) => {
    const classificacao = getClassificacao(valor)

    return (
      <Card className="termometro-card">
        <Card.Body className="text-center">
          <div className="termometro-container">
            <div className="termometro">
              <div 
                className="termometro-fill" 
                style={{ 
                  height: `${valor}%`,
                  backgroundColor: classificacao.cor 
                }}
              ></div>
              <div className="termometro-marcas">
                <div className="marca" style={{ bottom: '80%' }}>80</div>
                <div className="marca" style={{ bottom: '60%' }}>60</div>
                <div className="marca" style={{ bottom: '40%' }}>40</div>
                <div className="marca" style={{ bottom: '20%' }}>20</div>
              </div>
            </div>
            
            <div className="valor-container">
              <div
                className="valor-principal"
                style={{ color: classificacao.cor }}
              >
                {typeof valor === 'number' ? valor.toFixed(1) : valor}
              </div>
              <div 
                className="classificacao"
                style={{ color: classificacao.cor }}
              >
                {classificacao.label}
              </div>
            </div>
          </div>
          
          <div className="titulo-indicador">
            <i className={`bi bi-${icone} icone-indicador`}></i>
            <span>{titulo}</span>
          </div>
        </Card.Body>
      </Card>
    )
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
        .page-title-container {
          display: flex;
          align-items: center;
          margin-bottom: 40px;
        }

        .indicador-icon {
          background: linear-gradient(135deg, #ff8c00 0%, #ffa726 100%);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          color: white;
          font-size: 24px;
        }

        .page-title-text h2 {
          color: #333;
          font-weight: 600;
          margin: 0;
          font-size: 1.8rem;
        }

        .page-subtitle {
          color: #666;
          font-size: 0.95rem;
          margin: 5px 0 0 0;
        }

        .termometros-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .termometro-card {
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 15px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: white;
        }

        .termometro-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .termometro-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 20px 0;
        }

        .termometro {
          width: 30px;
          height: 120px;
          background: #f0f0f0;
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          border: 2px solid #ddd;
        }

        .termometro-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-radius: 0 0 13px 13px;
          transition: height 0.8s ease;
        }

        .termometro-marcas {
          position: absolute;
          right: -25px;
          top: 0;
          height: 100%;
        }

        .marca {
          position: absolute;
          font-size: 10px;
          color: #666;
          font-weight: 500;
        }

        .valor-container {
          text-align: left;
        }

        .valor-principal {
          font-size: 32px;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 5px;
        }

        .classificacao {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .titulo-indicador {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
          color: #333;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .icone-indicador {
          font-size: 1.1rem;
          color: #666;
        }

        .escalas-info {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }

        .escalas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .escala-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .escala-otimo { background: #e8f5e9; color: #2e7d32; }
        .escala-bom { background: #f1f8e9; color: #4caf50; }
        .escala-regular { background: #fff3e0; color: #ff9800; }
        .escala-ruim { background: #ffebee; color: #f44336; }
        .escala-pessimo { background: #fce4ec; color: #d32f2f; }

        .escala-cor {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .termometros-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .page-title-text h2 {
            font-size: 1.5rem;
          }

          .escalas-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="page-title-container">
        <div className="indicador-icon">
          <i className="bi bi-speedometer2"></i>
        </div>
        <div className="page-title-text">
          <h2>Indicador de Satisfação & Bem-Estar Eldorado</h2>
          <p className="page-subtitle">
            Total e por Diretorias Eldorado
          </p>
        </div>
      </div>

      <div className="termometros-grid">
        {/* Indicadores por Diretoria (usando dados de exemplo) */}
        {indicadores.DIRETORIAS && Object.entries(indicadores.DIRETORIAS).map(([key, valor]) => (
          <TermometroComponent
            key={key}
            valor={valor}
            titulo={nomesDiretorias[key] || key}
            icone={"building-gear"} // Ícone genérico para diretorias
          />
        ))}
      </div>

      <div className="escalas-info">
        <h6 style={{ color: "#333", marginBottom: "15px", fontWeight: 600 }}>
          Zonas de Classificação
        </h6>
        <div className="escalas-grid">
          <div className="escala-item escala-otimo">
            <div className="escala-cor" style={{ background: "#2e7d32" }}></div>
            <span>ÓTIMO: 80 a 100</span>
          </div>
          <div className="escala-item escala-bom">
            <div className="escala-cor" style={{ background: "#4caf50" }}></div>
            <span>BOM: 60 a 79,9</span>
          </div>
          <div className="escala-item escala-regular">
            <div className="escala-cor" style={{ background: "#ff9800" }}></div>
            <span>REGULAR: 40 a 59,9</span>
          </div>
          <div className="escala-item escala-ruim">
            <div className="escala-cor" style={{ background: "#f44336" }}></div>
            <span>RUIM: 20 a 39,9</span>
          </div>
          <div className="escala-item escala-pessimo">
            <div className="escala-cor" style={{ background: "#d32f2f" }}></div>
            <span>PÉSSIMO: 0 a 19,9</span>
          </div>
        </div>
      </div>

      {/* A seção de metodologia pode ser mantida ou removida, conforme sua necessidade */}
      <Row>
        <Col lg={12}>
          <Card style={{ background: "#f8f9fa", padding: "25px", borderRadius: "12px" }}>
            <h6 style={{ color: "#2e8b57", marginBottom: "15px", fontWeight: 600 }}>
              Metodologia de Cálculo
            </h6>
            <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem", marginBottom: "15px" }}>
              O Indicador de Satisfação & Bem-Estar Eldorado foi construído a partir da análise das respostas 
              da pesquisa "Nossa Gente Eldorado".
            </p>
            <div className="text-muted mt-3" style={{ fontSize: "0.9rem", borderTop: "2px solid #ff8c00", paddingTop: "10px" }}>
              <strong>Base | {totalRespondentes.toLocaleString()} respondentes</strong>
              <br />
              <small>
                Pesquisa Nossa Gente Eldorado.
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Indicadores