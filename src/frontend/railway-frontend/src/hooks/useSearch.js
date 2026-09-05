import { useState, useEffect, useCallback } from 'react';

export default function useSearch({
  fetchFn,          // hàm gọi API: (params) => Promise
  defaultFilters = {},
  debounceMs = 400,
}) {
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  // Debounce keyword
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), debounceMs);
    return () => clearTimeout(timer);
  }, [keyword, debounceMs]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        keyword: debouncedKeyword || undefined,
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters,
      };

      // Xóa các filter rỗng
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const res = await fetchFn(params);
      setData(res.data || res.items || res || []);
      setPagination((prev) => ({
        ...prev,
        total: res.total || res.totalCount || 0,
      }));
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, filters, pagination.page, pagination.pageSize, fetchFn]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // reset về trang 1
  };

  const clearFilters = () => {
    setKeyword('');
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const changePage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return {
    keyword,
    setKeyword,
    filters,
    updateFilter,
    clearFilters,
    data,
    loading,
    error,
    pagination,
    changePage,
    reload: loadData,
  };
}