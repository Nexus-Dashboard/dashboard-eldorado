import { Container, Row, Col } from "react-bootstrap"
import Sidebar from "./Sidebar"
import MobileMenu from "./MobileMenu"
import FilterButton from "../Filter/FilterButton"
import AppRouter from "../../router/AppRouter"

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <div className="mobile-controls d-lg-none">
          <MobileMenu />
          <FilterButton />
        </div>
        <div className="desktop-filter d-none d-lg-block">
          <FilterButton />
        </div>
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
