-- Create Database
CREATE DATABASE IF NOT EXISTS RailwaySystem;
USE RailwaySystem;

CREATE TABLE Reservations (
    pnr_no INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_no INT NOT NULL,
    from_station_code VARCHAR(10) NOT NULL,
    to_station_code VARCHAR(10) NOT NULL,
    journey_date DATE NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    class_type VARCHAR(20) NOT NULL,
    total_passengers INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    seat_no VARCHAR(20),
    coach_no VARCHAR(20)
);

CREATE TABLE Cancellations (
    cancellation_id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_no INT NOT NULL,
    cancellation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    cancellation_fee DECIMAL(10, 2) NOT NULL,
    refund_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pnr_no) REFERENCES Reservations(pnr_no)
);

CREATE TABLE Daily_Cash_Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_no INT NOT NULL,
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('PAYMENT', 'REFUND')),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pnr_no) REFERENCES Reservations(pnr_no)
);