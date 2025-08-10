"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import SystemLayout from "@/components/system";
import DataTable from "@/components/system/DataTable";
import { columns } from "@/components/columns/menu";
import { fields as formFields } from "@/components/fields/menu";
import { menusAPI } from "@/api-fetch";

export default function MenuPage() {
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    loadMenusData();
  }, []);

  const loadMenusData = async () => {
    setTableLoading(true);
    try {
      const result = await menusAPI.getMenusList();
      setDataSource(result.list);
    } catch (error) {
      console.error("Error loading menus:", error);
      message.error("加载菜单列表失败");
    } finally {
      setTableLoading(false);
    }
  };
  
  const handleAdd = async (values) => {
    try {
      await menusAPI.createMenu(values);
      message.success("菜单添加成功");
      loadMenusData();
    } catch (error) {
      console.error("Error adding menu:", error);
      message.error("添加菜单失败");
    }
  };

  const handleEdit = async (values) => {
    try {
      await menusAPI.updateMenu(values);
      message.success("菜单更新成功");
      loadMenusData();
    } catch (error) {
      console.error("Error updating menu:", error);
      message.error("更新菜单失败");
    }
  };

  const handleDelete = async (record) => {
    try {
      await menusAPI.deleteMenu(record.id);
      message.success("菜单删除成功");
      loadMenusData();
    } catch (error) {
      console.error("Error deleting menu:", error);
      message.error("删除菜单失败");
    }
  };

  return (
    <SystemLayout title="菜单管理" subtitle="Menu Management">
      <DataTable
        dataSource={dataSource}
        columns={columns}
        title="菜单列表"
        formFields={formFields}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
      />
    </SystemLayout>
  );
}
