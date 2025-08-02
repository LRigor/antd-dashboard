import { Row, Col } from "antd";
import TotalSales from "./total-sales";
import TotalVisits from "./total-visits";
import Payments from "./payments";
import Effects from "./effects";
import SalesVisits from "./salesvisits";
import Popular from "./popular";
import SalesCategory from "./sales-category";
import Stores from "./stores";
export default function Dashboard() {
  return (
    <div
      style={{
        borderRadius: "6px",
        padding: "30px",
        minHeight: 280,
        overflowY: "auto",
        overflowX: "hidden",
        height: "calc(100vh - 70px)",
        width: "100%",
      }}
    >
      {/* Overview Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12} xl={6}>
          <TotalSales />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <TotalVisits />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Payments />
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Effects />
        </Col>
      </Row>

      {/* Sales/Visits Dashboard */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <SalesVisits />
        </Col>
      </Row>

      {/* Popular Products */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Popular />
        </Col>
        <Col xs={24} lg={12}>
          <SalesCategory />
        </Col>
      </Row>

      {/* Stores */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Stores />
        </Col>
      </Row>
    </div>
  );
}
