import React from "react"

const QuestionNavigationESG = ({ activeQuestion, setActiveQuestion }) => {
  const questions = [
    {
      id: "percepcao-atuacao",
      title: "Percepção Atuação ESG",
      subtitle: "Avaliação das práticas sustentáveis",
      icon: "leaf"
    },
    {
      id: "nivel-comprometimento",
      title: "Comprometimento ESG",
      subtitle: "Nível de engajamento da empresa",
      icon: "graph-up"
    },
    {
      id: "conhecimento-acoes",
      title: "Conhecimento das Ações",
      subtitle: "Iniciativas ESG da Eldorado",
      icon: "info-circle"
    },
    {
      id: "participacao-iniciativas",
      title: "Participação em Programas",
      subtitle: "Engajamento em iniciativas",
      icon: "people"
    },
    {
      id: "uso-linha-etica",
      title: "Canal Linha Ética",
      subtitle: "Utilização do canal 0800",
      icon: "telephone"
    },
    {
      id: "programa-compliance",
      title: "Compliance",
      subtitle: "Avaliação do programa",
      icon: "shield-check"
    }
  ]

  return (
    <>
      <style jsx>{`
        .navigation-esg {
          background: white;
          padding: 15px 10px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .nav-title {
          text-align: center;
          margin-bottom: 15px;
          color: #2e8b57;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .question-buttons {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
          overflow-x: auto;
          padding: 5px;
        }

        .question-button {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          color: #495057;
          padding: 10px 12px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 170px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }

        .question-button.active {
          background: #2e8b57;
          border-color: #2e8b57;
          color: white;
          transform: translateY(-1px);
        }

        .question-button:hover:not(.active) {
          background: #e9ecef;
          border-color: #dee2e6;
        }

        .button-icon {
          font-size: 1rem;
          opacity: 0.8;
        }

        .button-content {
          flex: 1;
          min-width: 0;
        }

        .button-title {
          font-weight: 600;
          font-size: 0.8rem;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .button-subtitle {
          font-size: 0.65rem;
          opacity: 0.7;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      <div className="navigation-esg">
        <div className="nav-title">Perguntas sobre Pilares ESG</div>
        <div className="question-buttons">
          {questions.map((question) => (
            <button
              key={question.id}
              className={`question-button ${activeQuestion === question.id ? "active" : ""}`}
              onClick={() => setActiveQuestion(question.id)}
            >
              <i className={`bi bi-${question.icon} button-icon`}></i>
              <div className="button-content">
                <div className="button-title">{question.title}</div>
                <div className="button-subtitle">{question.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default QuestionNavigationESG