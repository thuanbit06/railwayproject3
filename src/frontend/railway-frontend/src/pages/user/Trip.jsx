import useSearch from '../../hooks/useSearch';
import SearchBar from '../../components/SearchBar';
import tripService from '../../services/tripService';
export default function Trip() {
  const {
    keyword,
    setKeyword,
    filters,
    updateFilter,
    clearFilters,
    data: trips,
    loading,
    pagination,
    changePage,
  } = useSearch({
    fetchFn: tripService.getTrips,
    defaultFilters: {
      status: '',
      fromStationId: '',
      journeyDate: '',
    },
  });

  const filterConfig = [
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'Scheduled', label: 'Scheduled' },
        { value: 'Departed', label: 'Departed' },
        { value: 'Cancelled', label: 'Cancelled' },
      ],
    },
    {
      key: 'journeyDate',
      label: 'Ngày chạy',
      type: 'date',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý chuyến tàu</h1>

      <SearchBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        placeholder="Tìm theo mã tàu, ga đi, ga đến..."
        filters={filterConfig}
        filterValues={filters}
        onFilterChange={updateFilter}
        onClear={clearFilters}
        loading={loading}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Mã chuyến</th>
              <th className="px-4 py-3 text-left">Ngày</th>
              <th className="px-4 py-3 text-left">Ga đi - Ga đến</th>
              <th className="px-4 py-3 text-left">Giờ khởi hành</th>
              <th className="px-4 py-3 text-left">Ghế trống</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{trip.id}</td>
                <td className="px-4 py-3">{trip.journeyDate?.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  {trip.fromStation?.name} → {trip.toStation?.name}
                </td>
                <td className="px-4 py-3">{trip.departureTime}</td>
                <td className="px-4 py-3">{trip.availableSeats}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}