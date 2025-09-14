import { Container, Row, Col } from "react-bootstrap"
import Sidebar from "./Sidebar"
import FilterButton from "../Filter/FilterButton"
import AppRouter from "../../router/AppRouter"

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <FilterButton />
        <Container fluid>
          <Row>
            <Col>
              <AppRouter />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default Layout
