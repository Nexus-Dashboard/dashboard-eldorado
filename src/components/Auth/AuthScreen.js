import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"

const AuthScreen = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      if (password === "#Eldorado2025") {
        onAuthenticate()
      } else {
        setError("Senha incorreta. Tente novamente.")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="auth-screen-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img
                    src="eldorado_logo.png"
                    alt="Eldorado Brasil"
                    style={{ maxHeight: "80px", marginBottom: "20px" }}
                  />
                  <h2 className="fw-bold text-dark mb-2">Acesso</h2>
                  <p className="text-muted">Dashboard Eldorado - Pesquisa Nossa Gente</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Senha:</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Digite a senha de acesso"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control-lg"
                      disabled={isLoading}
                      autoFocus
                    />
                  </Form.Group>

                  {error && (
                    <Alert variant="danger" className="mb-3">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 mb-3"
                    disabled={isLoading || !password}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-lock me-2"></i>
                        Acessar Dashboard
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <small className="text-muted">
                    Sistema protegido - Acesso autorizado apenas para usuários credenciados
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .auth-screen-wrapper {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }

        .card {
          border-radius: 20px;
          border: 2px solid #2e8b57;
          box-shadow: 0 20px 40px rgba(46, 139, 87, 0.1);
        }

        .form-control-lg {
          border-radius: 10px;
          border: 2px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .form-control-lg:focus {
          border-color: #2e8b57;
          box-shadow: 0 0 0 0.2rem rgba(46, 139, 87, 0.25);
        }

        .btn-primary {
          background: #2e8b57;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: #246a43;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(46, 139, 87, 0.3);
        }

        .alert {
          border-radius: 10px;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default AuthScreen