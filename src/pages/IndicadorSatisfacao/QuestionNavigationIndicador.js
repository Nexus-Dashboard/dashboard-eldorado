import React from "react"

const QuestionNavigationIndicador = ({ activeQuestion, setActiveQuestion }) => {
  const questions = [
    {
      id: "indicador-geral",
      title: "Indicador Geral",
      subtitle: "Visão geral do Indicador de Satisfação",
      icon: "speedometer2"
    },
    {
      id: "media-atributos",
      title: "Média de Atributos dos Benefícios",
      subtitle: "Pontuação média dos atributos",
      icon: "clipboard-check"
    },
    {
      id: "indicadores",
      title: "Indicadores de Satisfação",
      subtitle: "Indicadores de Satisfação & Bem-Estar Eldorado",
      icon: "hand-thumbs-up"
    }
  ]

  return (
    <>
      <style jsx>{`
        .question-navigation-beneficios {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .nav-title {
          text-align: center;
          margin-bottom: 20px;
          color: #2e8b57;
          font-weight: 600;
          font-size: 1rem;
        }

        .question-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .question-button {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          color: #495057;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 280px;
          max-width: 350px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .question-button.active {
          background: #2e8b57;
          border-color: #2e8b57;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(46, 139, 87, 0.3);
        }

        .question-button:hover:not(.active) {
          background: #e9ecef;
          border-color: #dee2e6;
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .button-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          opacity: 0.8;
        }

        .active .button-icon {
          opacity: 1;
        }

        .button-content {
          flex: 1;
        }

        .button-title {
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 2px;
          line-height: 1.2;
        }

        .button-subtitle {
          font-size: 0.8rem;
          opacity: 0.7;
          line-height: 1.2;
        }

        .active .button-subtitle {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .question-buttons {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          
          .question-button {
            width: 100%;
            max-width: 400px;
            min-width: auto;
          }

          .question-navigation-beneficios {
            padding: 15px;
          }

          .nav-title {
            font-size: 0.95rem;
            margin-bottom: 15px;
          }
        }
      `}</style>

      <div className="question-navigation-beneficios">
        <div className="nav-title">
          Indicadores de Satisfação & Bem-Estar Eldorado
        </div>
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

export default QuestionNavigationIndicador