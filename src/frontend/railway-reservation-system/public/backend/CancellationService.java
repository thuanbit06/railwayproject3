import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class CancellationService {

    public boolean cancelTicket(int pnrNo) {
        String selectSql = "SELECT total_amount, status FROM Reservations WHERE pnr_no = ?";
        String updateReservationSql = "UPDATE Reservations SET status = 'CANCELLED' WHERE pnr_no = ?";
        String insertCancellationSql = "INSERT INTO Cancellations (pnr_no, cancellation_fee, refund_amount) VALUES (?, ?, ?)";

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement pstmtSelect = conn.prepareStatement(selectSql);
            pstmtSelect.setInt(1, pnrNo);
            ResultSet rs = pstmtSelect.executeQuery();

            if (rs.next()) {
                String currentStatus = rs.getString("status");
                if ("CANCELLED".equalsIgnoreCase(currentStatus)) {
                    System.out.println("Vé này đã được hủy trước đó rồi!");
                    return false;
                }

                double totalAmount = rs.getDouble("total_amount");
                double cancellationFee = totalAmount * 0.20;
                double refundAmount = totalAmount - cancellationFee;

                PreparedStatement pstmtUpdate = conn.prepareStatement(updateReservationSql);
                pstmtUpdate.setInt(1, pnrNo);
                pstmtUpdate.executeUpdate();

                PreparedStatement pstmtInsert = conn.prepareStatement(insertCancellationSql);
                pstmtInsert.setInt(1, pnrNo);
                pstmtInsert.setDouble(2, cancellationFee);
                pstmtInsert.setDouble(3, refundAmount);
                pstmtInsert.executeUpdate();

                System.out.println("Hủy vé thành công cho PNR: " + pnrNo);
                System.out.println("Phí hủy vé: " + cancellationFee + " VNĐ | Số tiền hoàn trả: " + refundAmount + " VNĐ");
                return true;
            } else {
                System.out.println("Không tìm thấy thông tin vé với mã PNR: " + pnrNo);
            }
        } catch (SQLException e) {
            System.out.println("Lỗi trong quá trình hủy vé!");
            e.printStackTrace();
        }
        return false;
    }

    public static void main(String[] args) {
        CancellationService cancellationService = new CancellationService();
        // Test hủy vé có mã PNR = 1 vừa tạo
        cancellationService.cancelTicket(1);
    }
}