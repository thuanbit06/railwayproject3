CREATE TABLE Passenger (
    PNR_No BIGINT PRIMARY KEY,
    Passenger_Name VARCHAR(100) NOT NULL,
    Age INT NOT NULL CHECK (Age > 0),
    Gender CHAR(1) NOT NULL CHECK (Gender IN ('M', 'F', 'O')),
    Total_Passengers INT NOT NULL CHECK (Total_Passengers > 0),
    Journey_Date DATE NOT NULL,
    Class VARCHAR(20) NOT NULL,
    Train_No INT NOT NULL
);

CREATE TABLE Fare (
    Fare_ID INT AUTO_INCREMENT PRIMARY KEY,
    Distance INT NOT NULL,
    Compartment_Type VARCHAR(20) NOT NULL,
    Train_Type VARCHAR(30) NOT NULL,
    Fare_Amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE Reservation (
    Reservation_ID INT AUTO_INCREMENT PRIMARY KEY,
    PNR_No BIGINT NOT NULL,
    Train_No INT NOT NULL,
    From_Station VARCHAR(50) NOT NULL,
    To_Station VARCHAR(50) NOT NULL,
    Coach_No VARCHAR(10) NOT NULL,
    Seat_No VARCHAR(10) NOT NULL,
    Reservation_Date DATE NOT NULL,
    Journey_Date DATE NOT NULL,
    Fare DECIMAL(10,2) NOT NULL,
    Status VARCHAR(20) DEFAULT 'Confirmed',

    CONSTRAINT FK_Reservation_Passenger
        FOREIGN KEY (PNR_No)
        REFERENCES Passenger(PNR_No),

    CONSTRAINT FK_Reservation_Train
        FOREIGN KEY (Train_No)
        REFERENCES Train(Train_No)
);
