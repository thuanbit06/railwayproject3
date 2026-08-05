import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class PaymentService {

    public boolean processPaymentAndBookTicket(int userId, int trainNo, String fromStation, String toStation,
                                               String journeyDate, String classType, int totalPassengers, double totalAmount) {
        
        String sql = "INSERT INTO Reservations (user_id, train_no, from_station_code, to_station_code, journey_date, class_type, total_passengers, total_amount, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, userId);
            pstmt.setInt(2, trainNo);
            pstmt.setString(3, fromStation);
            pstmt.setString(4, toStation);
            pstmt.setString(5, journeyDate);
            pstmt.setString(6, classType);
            pstmt.setInt(7, totalPassengers);
            pstmt.setDouble(8, totalAmount);

            int affectedRows = pstmt.executeUpdate();

            if (affectedRows > 0) {
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    int pnrNo = rs.getInt(1);
                    System.out.println("Thanh toán thành công! Mã PNR của bạn là: " + pnrNo);
                }
                return true;
            }
        } catch (SQLException e) {
            System.out.println("Lỗi trong quá trình thanh toán!");
            e.printStackTrace();
        }
        return false;
    }

    public static void main(String[] args) {
        PaymentService paymentService = new PaymentService();
        // Test đặt vé thử nghiệm
        paymentService.processPaymentAndBookTicket(101, 2024, "HAN", "SGN", "2026-08-15", "Soft Seat", 2, 500000.0);
    }
}