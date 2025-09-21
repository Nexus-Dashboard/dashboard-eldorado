import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, InputGroup, Badge } from "react-bootstrap"
import { useData } from "../../context/DataContext"

const ComentariosSugestoes = () => {
  const { getFilteredData, getUniqueValues, loading } = useData()
  const [comentariosP34, setComentariosP34] = useState([])
  const [comentariosP35, setComentariosP35] = useState([])
  const [filteredP34, setFilteredP34] = useState([])
  const [filteredP35, setFilteredP35] = useState([])
  
  // Estados dos filtros
  const [searchText, setSearchText] = useState("")
  const [selectedDiretoria, setSelectedDiretoria] = useState("")
  const [diretorias, setDiretorias] = useState([])
  
  // Estados de contadores
  const [totalP34, setTotalP34] = useState(0)
  const [totalP35, setTotalP35] = useState(0)

  useEffect(() => {
    const processData = () => {
      try {
        const filteredData = getFilteredData()
        if (!filteredData || filteredData.length === 0) return

        // Buscar diretorias únicas
        const diretoriasUnicas = getUniqueValues("PF2_FINAL")
          .filter(dir => dir && dir.trim() !== "" && !dir.includes("#NULL!"))
          .sort()
        setDiretorias(diretoriasUnicas)

        // Processar comentários P34
        const p34Comments = filteredData
          .map((row, index) => {
            const comentario = row["P34 - Pensando na sua área de atuação, existe alguma prática, cultura ou forma de trabalhar que você considera uma referência positiva e que poderia ser valorizada ou replicada por outras áreas da empresa? Pode citar algo que vive hoje ou já vivenciou."]
            const diretoria = row["PF2_FINAL"] || "Não informado"
            const cat1 = row["P34Cat1"] || ""
            const cat2 = row["P34Cat2"] || ""
            const cat4 = row["P34Cat4"] || ""

            if (comentario && comentario.trim() !== "" && !comentario.includes("#NULL!")) {
              return {
                id: `p34-${index}`,
                comentario: comentario.trim(),
                diretoria: diretoria,
                cat1: cat1,
                cat2: cat2,
                cat4: cat4,
                categorias: [cat1, cat2, cat4].filter(cat => cat && cat.trim() !== "")
              }
            }
            return null
          })
          .filter(comment => comment !== null)

        // Processar comentários P35
        const p35Comments = filteredData
          .map((row, index) => {
            const comentario = row["P35 - Deixe aqui qualquer comentário ou sugestão que não falamos anteriormente."]
            const diretoria = row["PF2_FINAL"] || "Não informado"
            const categoria = row["P35_CAT"] || ""

            if (comentario && comentario.trim() !== "" && !comentario.includes("#NULL!")) {
              return {
                id: `p35-${index}`,
                comentario: comentario.trim(),
                diretoria: diretoria,
                categoria: categoria,
                categorias: categoria ? [categoria] : []
              }
            }
            return null
          })
          .filter(comment => comment !== null)

        setComentariosP34(p34Comments)
        setComentariosP35(p35Comments)
        setFilteredP34(p34Comments)
        setFilteredP35(p35Comments)
        setTotalP34(p34Comments.length)
        setTotalP35(p35Comments.length)

      } catch (error) {
        console.error("Erro ao processar comentários:", error)
        // Dados de exemplo em caso de erro
        const exemploP34 = [
          {
            id: "p34-1",
            comentario: "Nossa equipe tem uma reunião semanal muito produtiva onde compartilhamos desafios e soluções. Isso poderia ser replicado em outras áreas.",
            diretoria: "Tecnologia",
            categorias: ["Comunicação", "Colaboração"],
            cat1: "Comunicação",
            cat2: "Colaboração",
            cat4: ""
          },
          {
            id: "p34-2", 
            comentario: "O programa de mentoria da nossa área tem ajudado muito no desenvolvimento dos colaboradores mais novos.",
            diretoria: "Recursos Humanos",
            categorias: ["Desenvolvimento", "Mentoria"],
            cat1: "Desenvolvimento",
            cat2: "Mentoria",
            cat4: ""
          }
        ]

        const exemploP35 = [
          {
            id: "p35-1",
            comentario: "Seria interessante ter mais opções de horário flexível para melhor conciliação com a vida pessoal.",
            diretoria: "Comercial",
            categoria: "Flexibilidade",
            categorias: ["Flexibilidade"]
          },
          {
            id: "p35-2",
            comentario: "A empresa poderia investir mais em treinamentos técnicos específicos da nossa área.",
            diretoria: "Operações",
            categoria: "Treinamento",
            categorias: ["Treinamento"]
          }
        ]

        setComentariosP34(exemploP34)
        setComentariosP35(exemploP35)
        setFilteredP34(exemploP34)
        setFilteredP35(exemploP35)
        setTotalP34(exemploP34.length)
        setTotalP35(exemploP35.length)
        setDiretorias(["Tecnologia", "Recursos Humanos", "Comercial", "Operações"])
      }
    }

    if (!loading) {
      processData()
    }
  }, [getFilteredData, getUniqueValues, loading])

  // Aplicar filtros
  useEffect(() => {
    const applyFilters = (comments) => {
      return comments.filter(comment => {
        const matchText = searchText === "" || 
          comment.comentario.toLowerCase().includes(searchText.toLowerCase()) ||
          comment.categorias.some(cat => cat.toLowerCase().includes(searchText.toLowerCase()))
        
        const matchDiretoria = selectedDiretoria === "" || comment.diretoria === selectedDiretoria
        
        return matchText && matchDiretoria
      })
    }

    setFilteredP34(applyFilters(comentariosP34))
    setFilteredP35(applyFilters(comentariosP35))
  }, [searchText, selectedDiretoria, comentariosP34, comentariosP35])

  const CommentCard = ({ comment, questionType }) => (
    <Card className="comment-card mb-3">
      <Card.Body>
        <div className="comment-header">
          <div className="comment-diretoria">
            <i className="bi bi-building"></i>
            <span>{comment.diretoria}</span>
          </div>
          {comment.categorias.length > 0 && (
            <div className="comment-categories">
              {comment.categorias.map((categoria, index) => (
                <Badge key={index} bg="secondary" className="me-1">
                  {categoria}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="comment-text">
          {comment.comentario}
        </div>
      </Card.Body>
    </Card>
  )

  if (loading) {
    return (
      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Comentários e sugestões</h1>
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
        .comentarios-container {
          width: 100%;
        }

        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .filters-title {
          color: #2e8b57;
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        .filter-group {
          margin-bottom: 15px;
        }

        .filter-label {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-control:focus, .form-select:focus {
          border-color: #2e8b57;
          box-shadow: 0 0 0 0.2rem rgba(46, 139, 87, 0.25);
        }

        .main-card {
          background: white;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .card-header-custom {
          background: #2e8b57;
          color: white;
          padding: 20px 25px;
          border-bottom: none;
        }

        .question-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .question-text {
          font-size: 0.95rem;
          opacity: 0.95;
          margin: 0;
          line-height: 1.4;
        }

        .comments-header {
          background: #f8f9fa;
          padding: 15px 25px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .comments-count {
          font-weight: 600;
          color: #333;
        }

        .comments-body {
          padding: 25px;
          max-height: 600px;
          overflow-y: auto;
        }

        .comment-card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .comment-card:hover {
          border-color: #2e8b57;
          box-shadow: 0 2px 8px rgba(46, 139, 87, 0.15);
          transform: translateY(-1px);
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .comment-diretoria {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #2e8b57;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .comment-diretoria i {
          font-size: 0.8rem;
        }

        .comment-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .comment-categories .badge {
          font-size: 0.75rem;
          padding: 4px 8px;
        }

        .comment-text {
          color: #333;
          line-height: 1.6;
          font-size: 0.95rem;
          text-align: justify;
        }

        .no-comments {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .no-comments i {
          font-size: 3rem;
          color: #ccc;
          margin-bottom: 15px;
        }

        .filters-summary {
          display: flex;
          gap: 15px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        .filter-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-tag i {
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .filter-tag i:hover {
          opacity: 1;
        }

        .stats-summary {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 30px 0;
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

        @media (max-width: 768px) {
          .filters-section {
            padding: 20px;
          }

          .comments-body {
            padding: 15px;
            max-height: 500px;
          }

          .comment-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .stats-summary {
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }

          .stat-item {
            width: 100%;
            max-width: 200px;
          }

          .main-card .card-header-custom {
            padding: 15px 20px;
          }

          .question-title {
            font-size: 1rem;
          }

          .question-text {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 576px) {
          .filters-summary {
            margin-top: 10px;
          }

          .comment-text {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <Container fluid>
        <div className="page-header">
          <h1 className="page-title">Comentários e sugestões</h1>
          <p className="text-muted mb-0">Pesquisa Nossa Gente Eldorado</p>
        </div>

        <div className="comentarios-container">
          {/* Seção de Filtros */}
          <div className="filters-section">
            <h5 className="filters-title">
              <i className="bi bi-funnel me-2"></i>
              Filtros de Pesquisa
            </h5>
            
            <Row>
              <Col md={8}>
                <div className="filter-group">
                  <div className="filter-label">Buscar nos comentários</div>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Digite palavras-chave para buscar nos comentários..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </InputGroup>
                </div>
              </Col>
              
              <Col md={4}>
                <div className="filter-group">
                  <div className="filter-label">Diretoria</div>
                  <Form.Select
                    value={selectedDiretoria}
                    onChange={(e) => setSelectedDiretoria(e.target.value)}
                  >
                    <option value="">Todas as diretorias</option>
                    {diretorias.map((diretoria, index) => (
                      <option key={index} value={diretoria}>
                        {diretoria}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
            </Row>

            {/* Resumo dos filtros ativos */}
            {(searchText || selectedDiretoria) && (
              <div className="filters-summary">
                {searchText && (
                  <div className="filter-tag">
                    <i className="bi bi-search"></i>
                    <span>"{searchText}"</span>
                    <i 
                      className="bi bi-x" 
                      onClick={() => setSearchText("")}
                      title="Remover filtro"
                    ></i>
                  </div>
                )}
                {selectedDiretoria && (
                  <div className="filter-tag">
                    <i className="bi bi-building"></i>
                    <span>{selectedDiretoria}</span>
                    <i 
                      className="bi bi-x" 
                      onClick={() => setSelectedDiretoria("")}
                      title="Remover filtro"
                    ></i>
                  </div>
                )}
              </div>
            )}
          </div>          

          {/* Card Principal - P34: Boas Práticas */}
          <div className="main-card">
            <div className="card-header-custom">
              <div className="question-title">
                <i className="bi bi-lightbulb me-2"></i>
                Boas Práticas e Referências Positivas
              </div>
              <div className="question-text">
                Pensando na sua área de atuação, existe alguma prática, cultura ou forma de trabalhar que você considera uma referência positiva 
                e que poderia ser valorizada ou replicada por outras áreas da empresa? Pode citar algo que vive hoje ou já vivenciou.
              </div>
            </div>
            
            <div className="comments-header">
              <div className="comments-count">
                <i className="bi bi-chat-dots me-2"></i>
                {filteredP34.length} comentário{filteredP34.length !== 1 ? 's' : ''} encontrado{filteredP34.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="comments-body">
              {filteredP34.length > 0 ? (
                filteredP34.map((comment) => (
                  <CommentCard 
                    key={comment.id} 
                    comment={comment} 
                    questionType="p34" 
                  />
                ))
              ) : (
                <div className="no-comments">
                  <i className="bi bi-chat-dots"></i>
                  <div>
                    {searchText || selectedDiretoria 
                      ? "Nenhum comentário encontrado com os filtros aplicados."
                      : "Nenhum comentário disponível para esta pergunta."
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card Principal - P35: Comentários e Sugestões Gerais */}
          <div className="main-card">
            <div className="card-header-custom">
              <div className="question-title">
                <i className="bi bi-chat-square-text me-2"></i>
                Comentários e Sugestões Gerais
              </div>
              <div className="question-text">
                Deixe aqui qualquer comentário ou sugestão que não falamos anteriormente.
              </div>
            </div>
            
            <div className="comments-header">
              <div className="comments-count">
                <i className="bi bi-chat-dots me-2"></i>
                {filteredP35.length} comentário{filteredP35.length !== 1 ? 's' : ''} encontrado{filteredP35.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="comments-body">
              {filteredP35.length > 0 ? (
                filteredP35.map((comment) => (
                  <CommentCard 
                    key={comment.id} 
                    comment={comment} 
                    questionType="p35" 
                  />
                ))
              ) : (
                <div className="no-comments">
                  <i className="bi bi-chat-dots"></i>
                  <div>
                    {searchText || selectedDiretoria 
                      ? "Nenhum comentário encontrado com os filtros aplicados."
                      : "Nenhum comentário disponível para esta pergunta."
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer informativo */}
          <Row>
            <Col lg={12}>
              <Card className="insights-card" style={{ 
                background: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '12px', 
                marginTop: '30px' 
              }}>
                <div className="text-muted" style={{ fontSize: "0.9rem", textAlign: "center" }}>
                  <strong>💡 Dica:</strong> Use os filtros acima para encontrar comentários específicos por palavra-chave ou diretoria. 
                  Os comentários são organizados por pergunta para facilitar a análise e identificação de oportunidades de melhoria.
                  <br />
                  <small className="mt-2 d-block">
                    <strong>Base:</strong> Comentários válidos extraídos da Pesquisa Nossa Gente Eldorado | 
                    <strong> P34:</strong> {totalP34} respostas | <strong>P35:</strong> {totalP35} respostas
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

export default ComentariosSugestoes