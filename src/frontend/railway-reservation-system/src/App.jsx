import React, { useEffect, useState } from 'react';

export default function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/schedules')
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi kết nối API Server');
        return res.json();
      })
      .then((data) => {
        setSchedules(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🚆 Hệ Thống Đặt Vé Tàu Hỏa</h2>
      <h3>Danh Sách Chuyến Tàu</h3>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      {!loading && !error && (
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {schedules.length === 0 ? (
            <p>Không có chuyến tàu nào.</p>
          ) : (
            schedules.map((item) => (
              <div 
                key={item.schedule_id} 
                style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}
              >
                <h4>{item.train_name}</h4>
                <p><b>Hành trình:</b> {item.departure_station} ➔ {item.arrival_station}</p>
                <p><b>Giờ khởi hành:</b> {new Date(item.departure_time).toLocaleString('vi-VN')}</p>
                <p><b>Giá vé:</b> <span style={{ color: 'green', fontWeight: 'bold' }}>{Number(item.price).toLocaleString('vi-VN')} VNĐ</span></p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}