"use client";

import { useState, useCallback } from "react";
import { App } from "antd";

/**
 * 通用系統頁面 Hook
 * 封裝了系統管理頁面的通用邏輯：數據加載、CRUD操作、分頁、篩選等
 * 
 * @param {Object} api - API 對象，包含 getList, create, update, delete 方法
 * @param {Object} options - 配置選項
 * @param {Object} options.initialFilters - 初始篩選條件
 * @param {Function} options.transformData - 數據轉換函數
 * @param {Function} options.onError - 錯誤處理函數
 * @returns {Object} 返回狀態和方法
 */
export function useSystemPage(api, options = {}) {
  const {
    initialFilters = {},
    transformData = (data) => data,
    onError = (error) => console.error(error)
  } = options;

  const { message } = App.useApp();

  // 統一的狀態管理
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    pageSizeOptions: ["10", "20", "50", "100"],
    position: ["bottomCenter"],
  });

  // 統一的數據加載邏輯
  const loadData = useCallback(async (page = 1, size = 10, cond = filters) => {
    setTableLoading(true);
    try {
      const result = await api.getList({ page, size, ...cond });
      const transformedData = transformData(result?.list || result || []);
      setDataSource(transformedData);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size,
        total: result?.total || 0,
      }));
    } catch (error) {
      onError(error);
      message.error("加载数据失败");
    } finally {
      setTableLoading(false);
    }
  }, [api, filters, transformData, onError, message]);

  // 統一的 CRUD 操作
  const createHandler = useCallback(async (values, successMsg = "添加成功", errorMsg = "添加失败") => {
    try {
      await api.create(values);
      message.success(successMsg);
      loadData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(error?.message || errorMsg);
    }
  }, [api, pagination, filters, loadData, message]);

  const updateHandler = useCallback(async (values, successMsg = "更新成功", errorMsg = "更新失败") => {
    try {
      await api.update(values);
      message.success(successMsg);
      loadData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(error?.message || errorMsg);
    }
  }, [api, pagination, filters, loadData, message]);

  const deleteHandler = useCallback(async (record, successMsg = "删除成功", errorMsg = "删除失败") => {
    try {
      await api.delete(record.id);
      message.success(successMsg);
      loadData(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(error?.message || errorMsg);
    }
  }, [api, pagination, filters, loadData, message]);

  // 統一的表格變更處理
  const handleTableChange = useCallback((paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    const nextPage = pageSize !== pagination.pageSize ? 1 : current;
    setPagination(prev => ({ ...prev, pageSize, current: nextPage }));
    loadData(nextPage, pageSize, filters);
  }, [pagination, loadData, filters]);

  // 搜尋處理
  const handleSearch = useCallback((searchForm, processSearchValues) => {
    return async () => {
      const v = await searchForm.validateFields();
      const next = processSearchValues ? processSearchValues(v) : v;
      setFilters(next);
      setPagination(p => ({ ...p, current: 1 }));
      loadData(1, pagination.pageSize, next);
    };
  }, [pagination, loadData]);

  // 重置處理
  const handleReset = useCallback((searchForm, resetFilters = initialFilters) => {
    return () => {
      searchForm.resetFields();
      setFilters(resetFilters);
      setPagination(p => ({ ...p, current: 1 }));
      loadData(1, pagination.pageSize, resetFilters);
    };
  }, [pagination, loadData, initialFilters]);

  return {
    // 狀態
    dataSource,
    tableLoading,
    filters,
    pagination,
    
    // 狀態更新方法
    setFilters,
    setPagination,
    
    // 數據操作方法
    loadData,
    createHandler,
    updateHandler,
    deleteHandler,
    handleTableChange,
    handleSearch,
    handleReset,
  };
}
