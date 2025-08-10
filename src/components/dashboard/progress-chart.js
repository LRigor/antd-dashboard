import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { Row, Col, Typography, Dropdown, Button, Progress } from "antd";
import { MoreOutlined } from "@ant-design/icons";
const { Text } = Typography;

export default function ProgressChart() {
  const [selectedStore, setSelectedStore] = useState("Stores 7");
  const [visibleStores, setVisibleStores] = useState([]);
  const [storeMenuVisible, setStoreMenuVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const storesRowRef = useRef(null);
  const smoothScrollTo = useCallback((targetScrollLeft) => {
    if (!storesRowRef.current) return;

    const container = storesRowRef.current;
    const startScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    container.scrollLeft = startScrollLeft + distance;
  }, []);

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      if (storesRowRef.current) {
        const scrollAmount = e.deltaY;
        smoothScrollTo(storesRowRef.current.scrollLeft + scrollAmount);
      }
    },
    [smoothScrollTo]
  );

  const handleScroll = useCallback(() => {
    updateVisibleStores();
  }, []);

  useEffect(() => {
    const container = storesRowRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel, handleScroll]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateVisibleStores();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Initial update of visible stores
  useLayoutEffect(() => {
    if (storesRowRef.current) {
      const container = storesRowRef.current;
      const storeItems = container.querySelectorAll("[data-store-item]");
      
      if (storeItems.length === storesData.length) {
        updateVisibleStores();
        setIsReady(true);
      } else {
        const timer = setTimeout(() => {
          updateVisibleStores();
          setIsReady(true);
        }, 50);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);


  const updateVisibleStores = () => {
    if (storesRowRef.current) {
      const container = storesRowRef.current;
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;

      const storeItems = container.querySelectorAll("[data-store-item]");
      if (storeItems.length === 0) return;

      const itemWidth = 100;

      const visibleStores = [];
      storeItems.forEach((item, index) => {
        const itemLeft = item.offsetLeft;
        const itemRight = itemLeft + itemWidth;

        const isVisible =
          itemLeft < scrollLeft + containerWidth && itemRight > scrollLeft;

        if (isVisible) {
          visibleStores.push(storesData[index].name);
        }
      });

      setVisibleStores(visibleStores);
      setStoreMenuVisible(visibleStores.length < storesData.length);
    }
  };

  const storesData = [
    { name: "Stores 0", conversionRate: 65 },
    { name: "Stores 1", conversionRate: 45 },
    { name: "Stores 2", conversionRate: 35 },
    { name: "Stores 3", conversionRate: 55 },
    { name: "Stores 4", conversionRate: 75 },
    { name: "Stores 5", conversionRate: 25 },
    { name: "Stores 6", conversionRate: 50 },
    { name: "Stores 7", conversionRate: 80 },
    { name: "Stores 8", conversionRate: 40 },
    { name: "Stores 9", conversionRate: 70 },
  ];

  const storeMenuItems = storesData
    .filter((store) => !visibleStores.includes(store.name))
    .map((store) => ({
      key: store.name,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "200px",
          }}
        >
          <span>{store.name}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>转化率</span>
            <Progress
              type="circle"
              percent={store.conversionRate}
              size={24}
              strokeColor="#1890ff"
              trailColor="#f0f0f0"
              showInfo={false}
            />
          </div>
        </div>
      ),
    }));

  const handleStoreSelect = ({ key }) => {
    setSelectedStore(key);
    scrollToStore(key);
  };

  const scrollToStore = (storeName) => {
    const storeIndex = storesData.findIndex(
      (store) => store.name === storeName
    );
    if (storeIndex !== -1 && storesRowRef.current) {
      const itemWidth = 100;
      const margin = 0;
      const targetScrollLeft = storeIndex * (itemWidth + margin);
      smoothScrollTo(targetScrollLeft);
    }
  };

  return (
    <div
      style={{
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        width: storeMenuVisible ? "auto" : "100%",
      }}
    >
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--border-color);
          }
        `}
      </style>
      <Row
        gutter={[16, 16]}
        ref={storesRowRef}
        style={{
          overflow: "auto",
          justifyContent: "flex-start",
          flexWrap: "nowrap",
          paddingBottom: "16px",
          boxShadow:
            "inset 20px 0 20px -20px rgba(0,0,0,0.1), inset -20px 0 30px -20px rgba(0,0,0,0.1)",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border-color) transparent",
          width: storeMenuVisible ? "auto" : "100%",
          justifyContent: "space-between",
        }}
        className="custom-scrollbar"
      >
        {storesData.map((store, index) => (
          <Col
            key={store.name}
            data-store-item
            style={{
              flex: "0 0 auto",
              minWidth: "120px",
              margin: "12px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <Text
                    strong
                    style={{
                      color:
                        store.name === selectedStore ? "#1890ff" : "inherit",
                    }}
                  >
                    {store.name}
                  </Text>
                </div>
                <div style={{ marginBottom: "4px" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    转化率
                  </Text>
                </div>
              </div>
              <Progress
                type="circle"
                percent={store.conversionRate}
                size={60}
                strokeWidth={12}
                strokeColor="#69b0f3"
                trailColor="#e9eff5"
                showInfo={false}
                style={{ paddingTop: "30px" }}
              />
            </div>
          </Col>
        ))}
      </Row>
      {storeMenuVisible && (
        <Col style={{ flex: "0 0 auto", marginLeft: "8px" }}>
          <Dropdown
            menu={{
              items: storeMenuItems,
              onClick: handleStoreSelect,
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <MoreOutlined />
              </div>
            </Button>
          </Dropdown>
        </Col>
      )}
    </div>
  );
}
