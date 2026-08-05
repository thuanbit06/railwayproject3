import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ReportService {

    public static void logTransaction(int pnrNo, String transactionType, double amount) {
        String sql = "INSERT INTO daily_cash_transactions (pnr_no, transaction_type, amount, transaction_date) " +
                     "VALUES (?, ?, ?, NOW())";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, pnrNo);
            pstmt.setString(2, transactionType);
            pstmt.setDouble(3, amount);
            pstmt.executeUpdate();
            System.out.println("Đã ghi nhận giao dịch (" + transactionType + ") cho PNR " + pnrNo + " vào CSDL.");

        } catch (SQLException e) {
            System.out.println("Lỗi khi ghi nhận giao dịch!");
            e.printStackTrace();
        }
    }

    public void generateDailyReport(String reportDate) {
        String sql = "SELECT transaction_type, COALESCE(SUM(amount), 0) AS total " +
                     "FROM daily_cash_transactions " +
                     "WHERE DATE(transaction_date) = ? " +
                     "GROUP BY transaction_type";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, reportDate);
            ResultSet rs = pstmt.executeQuery();

            double totalIncome = 0;
            double totalRefund = 0;

            while (rs.next()) {
                String type = rs.getString("transaction_type");
                double total = rs.getDouble("total");

                if ("PAYMENT".equalsIgnoreCase(type) || "THU".equalsIgnoreCase(type)) {
                    totalIncome = total;
                } else if ("REFUND".equalsIgnoreCase(type) || "CANCELLATION".equalsIgnoreCase(type) || "CHI".equalsIgnoreCase(type)) {
                    totalRefund = total;
                }
            }

            double netCash = totalIncome - totalRefund;

            System.out.println("\n==========================================");
            System.out.println("   BÁO CÁO DOANH THU NGÀY " + reportDate);
            System.out.println("==========================================");
            System.out.println("Tổng tiền thu (Đặt vé):     " + totalIncome + " VNĐ");
            System.out.println("Tổng tiền chi (Hoàn hủy):  " + totalRefund + " VNĐ");
            System.out.println("------------------------------------------");
            System.out.println("Thực thu (Net Cash):       " + netCash + " VNĐ");
            System.out.println("==========================================\n");

        } catch (SQLException e) {
            System.out.println("Lỗi khi tạo báo cáo!");
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        ReportService reportService = new ReportService();

        logTransaction(1, "PAYMENT", 500000.0);
        logTransaction(1, "REFUND", 400000.0);

        java.time.LocalDate today = java.time.LocalDate.now();
        reportService.generateDailyReport(today.toString());
    }
}
