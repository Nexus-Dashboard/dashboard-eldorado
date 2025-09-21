import { Container, Row, Col, Card } from "react-bootstrap"

const ConsideracoesFinais = () => {
  const consideracoes = [
    {
      id: 1,
      icon: "bi-graph-up-arrow",
      titulo: "Manter o Foco no Desenvolvimento de Carreira",
      texto: "Dada a alta motivação e intenção de permanência dos colaboradores em relação a oportunidades de desenvolvimento e carreira, é importante a Eldorado continuar investindo e aprimorando seus programas de capacitação e crescimento profissional.",
      color: "#2e8b57"
    },
    {
      id: 2,
      icon: "bi-award",
      titulo: "Fortalecer o Reconhecimento",
      texto: "O reconhecimento pelo trabalho é um dos pontos com menor concordância entre os fatores motivacionais. Estratégias para melhorar o reconhecimento formal e informal podem aumentar ainda mais a satisfação e o engajamento dos colaboradores.",
      color: "#4caf50"
    },
    {
      id: 3,
      icon: "bi-heart",
      titulo: "Aproveitar o Impacto Positivo na Saúde Emocional",
      texto: "Parcela significativa dos colaboradores percebe um impacto positivo do trabalho na saúde emocional. Isso pode ser comunicado e valorizado como um diferencial da Eldorado, atraindo e retendo talentos.",
      color: "#ff9800"
    },
    {
      id: 4,
      icon: "bi-chat-square-dots",
      titulo: "Aprimorar a Comunicação dos Benefícios",
      texto: "Embora a satisfação com os benefícios seja alta, há espaço para garantir que todos os colaboradores conheçam e entendam o valor de todos os benefícios oferecidos, especialmente aqueles com menor taxa de utilização.",
      color: "#1976d2"
    },
    {
      id: 5,
      icon: "bi-globe",
      titulo: "Continuar a Evolução ESG",
      texto: "A percepção positiva sobre o comprometimento ESG da Eldorado é um ativo valioso. Seguir comunicando as ações e resultados relacionados a esse pilar, de forma interna e externa, pode fortalecer ainda mais a confiança e o engajamento dos públicos da empresa.",
      color: "#8bc34a"
    },
    {
      id: 6,
      icon: "bi-eye",
      titulo: "Atenção às Diretorias com Indicador Mais Baixo",
      texto: "É importante olhar com atenção às diretorias que apresentaram as menores notas no Indicador de Satisfação e Bem-Estar Eldorado (Transportadora e Presidência), buscando compreender as causas e avaliar oportunidades para ações mais direcionadas.",
      color: "#d32f2f"
    }
  ]

  return (
    <>
      <style jsx>{`
        .consideracoes-container {
          width: 100%;
        }

        .intro-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 40px;
          text-align: center;
          border-left: 4px solid #ff8c00;
        }

        .intro-title {
          color: #2e8b57;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .intro-text {
          color: #666;
          font-size: 1rem;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }

        .consideracoes-grid {
          margin-bottom: 40px;
        }

        .consideracao-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          height: 100%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .consideracao-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .consideracao-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
        }

        .card-header-content {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          gap: 12px;
        }

        .card-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          background: var(--card-color);
          flex-shrink: 0;
        }

        .card-title {
          color: #333;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
        }

        .card-text {
          color: #666;
          line-height: 1.6;
          font-size: 0.95rem;
          text-align: justify;
        }

        .illustration-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }

        .illustration-title {
          color: #2e8b57;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .eldorado-illustration {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .footer-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          border-top: 2px solid #ff8c00;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .logo-section img {
          max-height: 50px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .footer-text {
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .highlight-box {
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
          border: 2px solid #4caf50;
          border-radius: 12px;
          padding: 20px;
          margin: 30px 0;
          text-align: center;
        }

        .highlight-title {
          color: #2e8b57;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .highlight-text {
          color: #333;
          font-size: 1rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .intro-section {
            padding: 20px;
          }

          .intro-title {
            font-size: 1.3rem;
          }

          .intro-text {
            font-size: 0.95rem;
          }

          .consideracao-card {
            padding: 20px;
            margin-bottom: 20px;
          }

          .card-header-content {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .card-title {
            font-size: 1rem;
            text-align: center;
          }

          .card-text {
            font-size: 0.9rem;
            text-align: left;
          }

          .illustration-section {
            padding: 20px;
          }

          .footer-content {
            flex-direction: column;
            text-align: center;
          }

          .logo-section {
            justify-content: center;
          }

          .highlight-title {
            font-size: 1.1rem;
          }

          .highlight-text {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 576px) {
          .card-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .card-title {
            font-size: 0.95rem;
          }

          .card-text {
            font-size: 0.85rem;
          }
        }
      `}</style>

      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Considerações finais</h1>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>

        <div className="consideracoes-container">
          {/* Seção de Introdução */}
          <div className="intro-section">
            <h2 className="intro-title">Principais Recomendações Estratégicas</h2>
            <p className="intro-text">
              Com base nos resultados da Pesquisa Nossa Gente Eldorado 2025, apresentamos as principais considerações 
              e recomendações para fortalecer ainda mais o ambiente organizacional e a experiência dos colaboradores.
            </p>
          </div>

          {/* Grid de Considerações */}
          <Row className="consideracoes-grid">
            {consideracoes.map((item, index) => (
              <Col lg={4} md={6} key={item.id} className="mb-4">
                <Card 
                  className="consideracao-card h-100"
                  style={{ '--card-color': item.color }}
                >
                  <div className="card-header-content">
                    <div className="card-icon">
                      <i className={item.icon}></i>
                    </div>
                    <h5 className="card-title">{item.titulo}</h5>
                  </div>
                  <p className="card-text">{item.texto}</p>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Box de destaque */}
          <div className="highlight-box">
            <h3 className="highlight-title">🎯 Foco na Melhoria Contínua</h3>
            <p className="highlight-text">
              A Eldorado demonstra excelente desempenho em diversos indicadores de satisfação e engajamento. 
              As recomendações acima visam potencializar ainda mais os pontos fortes e abordar oportunidades 
              específicas para uma experiência do colaborador ainda mais positiva.
            </p>
          </div>

          {/* Seção da Ilustração */}
          <div className="illustration-section">
            <h3 className="illustration-title">Eldorado Brasil - Sustentabilidade e Inovação</h3>
            <img
              src="eldorado-forest-illustration-with-trees-and-indust.jpg"
              alt="Ilustração da Eldorado com floresta e indústria representando sustentabilidade"
              className="eldorado-illustration"
            />
          </div>

          {/* Footer com logos */}
          <div className="footer-section">
            <div className="footer-content">
              <div className="logo-section">
                <img
                  src="eldorado_logo.png"
                  alt="Eldorado Brasil"
                />
                <img
                  src="nexus-logo-preta.png"
                  alt="Nexus - Pesquisa e Inteligência de Dados"
                />
              </div>
              <div className="footer-text">
                <strong>Pesquisa Nossa Gente Eldorado 2025</strong>
                <br />
                <small>Relatório de Resultados e Considerações Finais</small>
              </div>
            </div>
          </div>

          {/* Informações adicionais */}
          <Row className="mt-4">
            <Col lg={12}>
              <Card style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div className="text-muted text-center" style={{ fontSize: "0.9rem" }}>
                  <strong>📋 Próximos Passos:</strong> Recomenda-se o desenvolvimento de planos de ação específicos 
                  para cada área de melhoria identificada, com métricas claras e acompanhamento regular dos progressos.
                  <br />
                  <small className="mt-2 d-block">
                    Este relatório representa a voz de <strong>3.484 colaboradores</strong> e serve como base 
                    estratégica para o fortalecimento contínuo da cultura organizacional da Eldorado.
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

export default ConsideracoesFinais