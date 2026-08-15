import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Train, Clock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { searchTrains } from "../../services/trainService"; // Gọi API tìm tàu

const TrainResults = () => {
  const nav = useNavigate();
  const location = useLocation();

  // Lấy tham số tìm kiếm được truyền từ trang Search (state)
  const searchParams = location.state?.searchParams;

  // Các state quản lý dữ liệu và giao diện
  const [trains, setTrains] = useState([]); // Danh sách tàu
  const [loading, setLoading] = useState(true); // Đang tải?
  const [error, setError] = useState(""); // Thông báo lỗi

  /* =======================
     [1] TẢI DANH SÁCH TÀU
  ======================== */
  useEffect(() => {
    const fetchTrains = async () => {
      // Nếu không có tham số tìm kiếm → quay về trang tìm kiếm
      if (!searchParams) {
        nav("/search");
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Gọi API tìm kiếm tàu
        const res = await searchTrains(searchParams);
        setTrains(res.data); // Lưu kết quả vào state
      } catch (err) {
        console.error("Failed to fetch trains:", err);
        setError("Unable to load train schedules. Please try again.");
      } finally {
        setLoading(false); // Kết thúc tải (dù thành công hay lỗi)
      }
    };

    fetchTrains();
  }, [searchParams, nav]);

  /* =======================
     [2] XỬ LÝ KHI BẤM "VIEW DETAILS"
  ======================== */
  const handleViewDetails = (trainId) => {
    // Chuyển sang trang chi tiết tàu, truyền kèm tham số tìm kiếm
    nav(`/trains/${trainId}`, {
      state: { searchParams },
    });
  };

  /* =======================
     [3] HIỂN THỊ MÀN HÌNH ĐANG TẢI
  ======================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  /* =======================
     [4] HIỂN THỊ MÀN HÌNH LỖI
  ======================== */
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex flex-col items-center justify-center p-6">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => nav(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  /* =======================
     [5] HIỂN THỊ KẾT QUẢ TÌM KIẾM
  ======================== */
  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Tiêu đề & nút sửa tìm kiếm */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Available Trains</h1>
            {searchParams && (
              <p className="text-sm text-gray-500">
                {searchParams.from} → {searchParams.to} • {searchParams.date}
              </p>
            )}
          </div>
          <button
            onClick={() => nav(-1)}
            className="text-sm text-blue-600 font-semibold hover:underline">
            Modify Search
          </button>
        </div>

        {/* Nếu không có tàu nào */}
        {trains.length === 0 ?
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl shadow-sm">
            <Train size={40} className="mx-auto mb-3 opacity-50" />
            <p>No trains found for your route.</p>
            <p className="text-xs mt-1">
              Please try different dates or stations.
            </p>
          </div>
        : /* Nếu có tàu → Hiển thị danh sách */
          <div className="space-y-4">
            {trains.map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  {/* Bên trái: Thông tin tàu */}
                  <div>
                    <p className="font-bold text-lg">
                      {t.name}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        ({t.trainNo})
                      </span>
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} /> {t.departureTime}
                      </div>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} /> {t.arrivalTime}
                      </div>
                      <span className="text-gray-400 text-xs">
                        ({t.duration})
                      </span>
                    </div>
                  </div>

                  {/* Bên phải: Giá & Nút xem chi tiết */}
                  <div className="text-right">
                    <p className="font-bold text-xl text-[#003A8C]">
                      ${t.fare}
                    </p>
                    <button
                      onClick={() => handleViewDetails(t.id)}
                      className="mt-2 px-4 py-2 bg-[#003A8C] hover:bg-[#1677FF] text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition">
                      View Details <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default TrainResults;
