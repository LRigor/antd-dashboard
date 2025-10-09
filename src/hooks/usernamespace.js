"use client";
import { useEffect, useState, useCallback } from "react";
import {  namespacesAPI } from "@/api-fetch/namespaces";

export function useNamespaceList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await namespacesAPI.getNamespacesList?.();

      // 依你回傳格式做容錯：優先 data.list
      const arr =
        Array.isArray(res?.data?.list) ? res.data.list :
        Array.isArray(res?.list)       ? res.list :
        Array.isArray(res?.data)       ? res.data :
        Array.isArray(res)             ? res :
        [];

      setList(arr);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { list, loading, refresh };
}
