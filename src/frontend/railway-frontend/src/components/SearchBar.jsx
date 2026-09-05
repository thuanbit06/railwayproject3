export default function SearchBar({
  keyword,
  onKeywordChange,
  placeholder = 'Tìm kiếm...',
  filters = [],
  filterValues = {},
  onFilterChange,
  onClear,
  loading = false,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Ô tìm kiếm */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        {/* Các filter động */}
        {filters.map((filter) => (
          <div key={filter.key} className="min-w-[160px]">
            {filter.type === 'select' ? (
              <select
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full py-2.5 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{filter.label}</option>
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : filter.type === 'date' ? (
              <input
                type="date"
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full py-2.5 px-3 border rounded-lg"
              />
            ) : (
              <input
                type="text"
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                placeholder={filter.label}
                className="w-full py-2.5 px-3 border rounded-lg"
              />
            )}
          </div>
        ))}

        {/* Nút Clear */}
        <button
          onClick={onClear}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
        >
          Xóa lọc
        </button>
      </div>

      {loading && (
        <div className="mt-3 text-sm text-blue-600">Đang tìm kiếm...</div>
      )}
    </div>
  );
}