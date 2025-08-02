import { Card, Space, Typography, Progress } from "antd";
import {
  InfoCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const twoColors = {
  "0%": "#108ee9",
  "100%": "#87d068",
};
export default function Effects() {
  return (
    <Card
      title={
        <Space>
          <Text
            style={{ fontSize: "16px", fontWeight: "600" }}
          >
            运营活动效果
          </Text>
        </Space>
      }
      style={{
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        border: "1px solid var(--border-color)",
      }}
      styles={{
        header: {
          borderBottom: "1px solid var(--border-color)",
          padding: "16px 20px 12px",
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div style={{ height: 180 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
          }}
        >
          <Text
            style={{ fontSize: "14px", color: "#8c8c8c", fontWeight: "500" }}
          >
            运营活动效果
          </Text>
          <InfoCircleOutlined
            style={{
              color: "#8c8c8c",
              fontSize: "16px",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#262626")}
            onMouseLeave={(e) => (e.target.style.color = "#8c8c8c")}
          />
        </div>

        <div style={{ padding: "5px 20px" }}>
          <Text
            style={{
              fontSize: "32px",
              lineHeight: "1.2"
            }}
          >
            78%
          </Text>

          <div style={{ marginTop: 36 }}>
            <Progress percent={78} strokeColor={twoColors} />
          </div>
        </div>
      </div>

      <div
        style={{
          height: 50,
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 20px 16px",
        }}
      >
        <Space
          direction="horizontal"
          size={8}
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
              周同比 12%
              <CaretUpOutlined style={{ color: "#f5222d", marginRight: 4 }} />
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
              日同比 11%
              <CaretDownOutlined style={{ color: "#52c41a", marginRight: 4 }} />
            </Text>
          </div>
        </Space>
      </div>
    </Card>
  );
}
