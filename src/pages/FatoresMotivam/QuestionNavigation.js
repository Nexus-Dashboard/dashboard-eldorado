import React from "react"

const QuestionNavigation = ({ activeQuestion, setActiveQuestion }) => {
  const questions = [
    {
      id: "motivacao",
      title: "Fatores de Motivação",
      subtitle: "Principal motivação para trabalhar na Eldorado",
      icon: "briefcase"
    },
    {
      id: "reconhecimento",
      title: "Reconhecimento e Motivação",
      subtitle: "Concordância com atributos da empresa",
      icon: "star"
    },
    {
      id: "trajetoria-longa",
      title: "Construção de Trajetória Longa",
      subtitle: "Fatores para permanência na empresa",
      icon: "target"
    },
    {
      id: "influencia-familia",
      title: "Influência da Família",
      subtitle: "Peso familiar na decisão profissional",
      icon: "people"
    }
  ]

  return (
    <>
      <style jsx>{`
        .question-navigation {
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
          gap: 10px;
          justify-content: center;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 5px;
        }

        .question-buttons::-webkit-scrollbar {
          height: 4px;
        }

        .question-buttons::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .question-buttons::-webkit-scrollbar-thumb {
          background: #2e8b57;
          border-radius: 2px;
        }

        .question-button {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          color: #495057;
          padding: 10px 14px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 200px;
          max-width: 220px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
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
          font-size: 1.1rem;
          flex-shrink: 0;
          opacity: 0.8;
        }

        .active .button-icon {
          opacity: 1;
        }

        .button-content {
          flex: 1;
          min-width: 0;
        }

        .button-title {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 2px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .button-subtitle {
          font-size: 0.7rem;
          opacity: 0.7;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .active .button-subtitle {
          opacity: 0.9;
        }

        /* Para telas grandes - garantir que todos os 5 botões fiquem visíveis */
        @media (min-width: 1400px) {
          .question-buttons {
            gap: 12px;
          }
          
          .question-button {
            min-width: 240px;
            max-width: 260px;
            padding: 12px 16px;
          }

          .button-icon {
            font-size: 1.2rem;
          }

          .button-title {
            font-size: 0.9rem;
          }

          .button-subtitle {
            font-size: 0.75rem;
          }
        }

        /* Para telas médias - ajustar largura dos botões */
        @media (min-width: 1200px) and (max-width: 1399px) {
          .question-button {
            min-width: 210px;
            max-width: 230px;
          }
        }

        /* Para telas menores - permitir scroll horizontal suave */
        @media (max-width: 1199px) {
          .question-navigation {
            padding: 15px 10px;
          }

          .question-buttons {
            gap: 8px;
            padding: 0 10px 5px 10px;
            justify-content: flex-start;
          }
          
          .question-button {
            min-width: 180px;
            max-width: 200px;
            padding: 10px 12px;
          }

          .nav-title {
            font-size: 0.95rem;
            margin-bottom: 15px;
          }
        }

        /* Para tablets */
        @media (max-width: 768px) {
          .question-navigation {
            padding: 12px 8px;
            margin-bottom: 20px;
          }

          .nav-title {
            font-size: 0.9rem;
            margin-bottom: 12px;
          }

          .question-buttons {
            gap: 6px;
            padding: 0 5px 5px 5px;
          }
          
          .question-button {
            min-width: 160px;
            max-width: 180px;
            padding: 8px 10px;
          }

          .button-icon {
            font-size: 1rem;
          }

          .button-title {
            font-size: 0.8rem;
          }

          .button-subtitle {
            font-size: 0.65rem;
          }
        }

        /* Para mobile - garantir boa experiência de scroll */
        @media (max-width: 480px) {
          .question-navigation {
            padding: 10px 5px;
            border-radius: 8px;
          }

          .nav-title {
            font-size: 0.85rem;
            margin-bottom: 10px;
          }

          .question-buttons {
            gap: 5px;
            padding: 0 5px 8px 5px;
          }
          
          .question-button {
            min-width: 150px;
            max-width: 170px;
            padding: 8px;
            border-radius: 6px;
          }

          .button-icon {
            font-size: 0.9rem;
          }

          .button-title {
            font-size: 0.75rem;
          }

          .button-subtitle {
            font-size: 0.6rem;
          }

          .question-buttons::-webkit-scrollbar {
            height: 6px;
          }
        }

        /* Indicador visual de scroll disponível */
        @media (max-width: 1399px) {
          .question-navigation::after {
            content: '';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 30px;
            height: 30px;
            background: linear-gradient(90deg, transparent, white);
            pointer-events: none;
            opacity: 0.8;
          }
        }
      `}</style>

      <div className="question-navigation">
        <div className="nav-title">
          Perguntas sobre Fatores que Motivam
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

export default QuestionNavigation