USE [RailAdminDB];
GO

SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;
GO


/* =========================================================
   1. USERS
   ========================================================= */
   SET IDENTITY_INSERT dbo.Tickets OFF;
GO

SET IDENTITY_INSERT [dbo].[Users] ON;

INSERT INTO [dbo].[Users]
(
    [Id],
    [Name],
    [Email],
    [PasswordHash],
    [Role],
    [CreatedAt]
)
VALUES
(1001, N'Nguyễn Văn An',    N'an.nguyen@example.com',    N'$2a$12$TestHash1001', N'CUSTOMER', '2026-08-01 08:00:00'),
(1002, N'Trần Thị Bình',    N'binh.tran@example.com',   N'$2a$12$TestHash1002', N'CUSTOMER', '2026-08-02 09:00:00'),
(1003, N'Lê Văn Cường',     N'cuong.le@example.com',    N'$2a$12$TestHash1003', N'CUSTOMER', '2026-08-03 10:00:00'),
(1004, N'Phạm Thị Dung',    N'dung.pham@example.com',    N'$2a$12$TestHash1004', N'CUSTOMER', '2026-08-04 11:00:00'),
(1005, N'Hoàng Văn Em',     N'em.hoang@example.com',    N'$2a$12$TestHash1005', N'CUSTOMER', '2026-08-05 12:00:00'),
(1006, N'Vũ Thị Hoa',        N'hoa.vu@example.com',      N'$2a$12$TestHash1006', N'CUSTOMER', '2026-08-06 13:00:00'),
(1007, N'Đỗ Văn Khánh',      N'khanh.do@example.com',    N'$2a$12$TestHash1007', N'CUSTOMER', '2026-08-07 14:00:00');

SET IDENTITY_INSERT [dbo].[Users] OFF;
GO


/* =========================================================
   2. STATIONS
   ========================================================= */

SET IDENTITY_INSERT [dbo].[Stations] ON;

INSERT INTO [dbo].[Stations]
(
    [Id],
    [Code],
    [Name],
    [City]
)
VALUES
(1001, N'HAN', N'Hà Nội',       N'Hà Nội'),
(1002, N'VDO', N'Vinh',         N'Nghệ An'),
(1003, N'HUE', N'Huế',          N'Thừa Thiên Huế'),
(1004, N'DAD', N'Đà Nẵng',      N'Đà Nẵng'),
(1005, N'NTR', N'Nha Trang',    N'Khánh Hòa'),
(1006, N'SGN', N'Sài Gòn',      N'TP. Hồ Chí Minh'),
(1007, N'BMT', N'Buôn Ma Thuột',N'Đắk Lắk');

SET IDENTITY_INSERT [dbo].[Stations] OFF;
GO


/* =========================================================
   3. TRAINS
   ========================================================= */

SET IDENTITY_INSERT [dbo].[Trains] ON;

INSERT INTO [dbo].[Trains]
(
    [Id],
    [TrainNo],
    [TrainName],
    [TrainType],
    [TotalCoaches],
    [IsActive],
    [CreatedAt]
)
VALUES
(1001, N'SE1', N'Thống Nhất 1', N'EXPRESS', 10, 1, '2026-07-01 08:00:00'),
(1002, N'SE2', N'Thống Nhất 2', N'EXPRESS', 10, 1, '2026-07-01 08:10:00'),
(1003, N'SE3', N'Thống Nhất 3', N'EXPRESS', 12, 1, '2026-07-01 08:20:00'),
(1004, N'SE4', N'Thống Nhất 4', N'EXPRESS', 12, 1, '2026-07-01 08:30:00'),
(1005, N'SE5', N'Thống Nhất 5', N'EXPRESS', 10, 1, '2026-07-01 08:40:00'),
(1006, N'SE6', N'Thống Nhất 6', N'EXPRESS', 10, 1, '2026-07-01 08:50:00'),
(1007, N'SP1', N'Sapa Express',  N'LOCAL',   8,  1, '2026-07-01 09:00:00');

SET IDENTITY_INSERT [dbo].[Trains] OFF;
GO


/* =========================================================
   4. COACHES
   ========================================================= */

SET IDENTITY_INSERT [dbo].[Coaches] ON;

INSERT INTO [dbo].[Coaches]
(
    [Id],
    [TrainId],
    [CoachNo],
    [ClassType],
    [TotalSeats],
    [FareMultiplier]
)
VALUES
(1001, 1001, N'C01', N'SOFT_SEAT', 64, 1.00),
(1002, 1002, N'C01', N'SOFT_SEAT', 64, 1.00),
(1003, 1003, N'C01', N'AC_SEAT',   64, 1.10),
(1004, 1004, N'C01', N'AC_SEAT',   64, 1.10),
(1005, 1005, N'C01', N'AC_SEAT',   64, 1.15),
(1006, 1006, N'C01', N'SLEEPER',   40, 1.50),
(1007, 1007, N'C01', N'SLEEPER',   40, 1.60);

SET IDENTITY_INSERT [dbo].[Coaches] OFF;
GO


/* =========================================================
   5. SEATS
   ========================================================= */

SET IDENTITY_INSERT [dbo].[Seats] ON;

INSERT INTO [dbo].[Seats]
(
    [Id],
    [CoachId],
    [SeatNo]
)
VALUES
(1001, 1001, N'01A'),
(1002, 1002, N'02A'),
(1003, 1003, N'03A'),
(1004, 1004, N'04A'),
(1005, 1005, N'05A'),
(1006, 1006, N'06A'),
(1007, 1007, N'07A');

SET IDENTITY_INSERT [dbo].[Seats] OFF;
GO


/* =========================================================
   6. TRIPS
   ========================================================= */

SET IDENTITY_INSERT [dbo].[Trips] ON;

INSERT INTO [dbo].[Trips]
(
    [Id],
    [TrainId],
    [FromStationId],
    [ToStationId],
    [JourneyDate],
    [DepartureTime],
    [ArrivalTime],
    [Status],
    [TotalCapacity],
    [AvailableSeats],
    [CreatedAt]
)
VALUES
(
    1001, 1001, 1001, 1006,
    '2026-09-01',
    '2026-09-01 19:30:00',
    '2026-09-02 05:30:00',
    N'SCHEDULED',
    640, 500,
    '2026-08-01 08:00:00'
),
(
    1002, 1002, 1006, 1001,
    '2026-09-02',
    '2026-09-02 19:00:00',
    '2026-09-03 05:00:00',
    N'SCHEDULED',
    640, 580,
    '2026-08-01 08:10:00'
),
(
    1003, 1003, 1001, 1004,
    '2026-09-05',
    '2026-09-05 20:00:00',
    '2026-09-06 08:00:00',
    N'SCHEDULED',
    768, 700,
    '2026-08-02 08:00:00'
),
(
    1004, 1004, 1004, 1001,
    '2026-09-07',
    '2026-09-07 18:30:00',
    '2026-09-08 06:30:00',
    N'SCHEDULED',
    768, 650,
    '2026-08-02 08:10:00'
),
(
    1005, 1005, 1001, 1005,
    '2026-09-10',
    '2026-09-10 18:00:00',
    '2026-09-11 07:00:00',
    N'SCHEDULED',
    640, 600,
    '2026-08-03 08:00:00'
),
(
    1006, 1006, 1005, 1006,
    '2026-09-12',
    '2026-09-12 17:30:00',
    '2026-09-13 05:30:00',
    N'SCHEDULED',
    400, 350,
    '2026-08-03 08:10:00'
),
(
    1007, 1007, 1001, 1007,
    '2026-09-15',
    '2026-09-15 07:00:00',
    '2026-09-15 15:00:00',
    N'SCHEDULED',
    320, 300,
    '2026-08-04 08:00:00'
);

SET IDENTITY_INSERT [dbo].[Trips] OFF;
GO


/* =========================================================
   7. TRIP STOPS
   ========================================================= */

SET IDENTITY_INSERT [dbo].[TripStops] ON;

INSERT INTO [dbo].[TripStops]
(
    [Id],
    [TripId],
    [StationId],
    [StopSequence],
    [ArrivalTime],
    [DepartureTime]
)
VALUES
(
    1001, 1001, 1001, 1,
    '2026-09-01 19:00:00',
    '2026-09-01 19:30:00'
),
(
    1002, 1002, 1006, 1,
    '2026-09-02 18:30:00',
    '2026-09-02 19:00:00'
),
(
    1003, 1003, 1001, 1,
    '2026-09-05 19:30:00',
    '2026-09-05 20:00:00'
),
(
    1004, 1004, 1004, 1,
    '2026-09-07 18:00:00',
    '2026-09-07 18:30:00'
),
(
    1005, 1005, 1001, 1,
    '2026-09-10 17:30:00',
    '2026-09-10 18:00:00'
),
(
    1006, 1006, 1005, 1,
    '2026-09-12 17:00:00',
    '2026-09-12 17:30:00'
),
(
    1007, 1007, 1001, 1,
    '2026-09-15 06:30:00',
    '2026-09-15 07:00:00'
);

SET IDENTITY_INSERT [dbo].[TripStops] OFF;
GO


/* =========================================================
   8. FARE RULES
   ========================================================= */

SET IDENTITY_INSERT [dbo].[FareRules] ON;

INSERT INTO [dbo].[FareRules]
(
    [Id],
    [SeatClass],
    [TrainType],
    [BasePrice],
    [IsActive],
    [CreatedAt]
)
VALUES
(1001, N'SOFT_SEAT', N'EXPRESS', 500000, 1, '2026-08-01 08:00:00'),
(1002, N'AC_SEAT',   N'EXPRESS', 600000, 1, '2026-08-01 08:10:00'),
(1003, N'SLEEPER',   N'EXPRESS', 900000, 1, '2026-08-01 08:20:00'),
(1004, N'SOFT_SEAT', N'LOCAL',   300000, 1, '2026-08-01 08:30:00'),
(1005, N'AC_SEAT',   N'LOCAL',   400000, 1, '2026-08-01 08:40:00'),
(1006, N'SLEEPER',   N'LOCAL',   650000, 1, '2026-08-01 08:50:00'),
(1007, N'VIP',        N'EXPRESS', 1200000, 1, '2026-08-01 09:00:00');

SET IDENTITY_INSERT [dbo].[FareRules] OFF;
GO


/* =========================================================
   9. CANCELLATION RULES
   ========================================================= */


SET IDENTITY_INSERT [dbo].[CancellationRules] ON;

INSERT INTO [dbo].[CancellationRules]
(
    [Id],
    [HoursBeforeDeparture],
    [FeeType],
    [FeeValue],
    [MinFee]
)
VALUES
(1001, 72, N'PERCENT', 10.00, 50000),
(1002, 48, N'PERCENT', 15.00, 50000),
(1003, 24, N'PERCENT', 20.00, 75000),
(1004, 12, N'PERCENT', 30.00, 100000),
(1005,  6, N'PERCENT', 40.00, 100000),
(1006,  3, N'PERCENT', 50.00, 150000),
(1007,  0, N'PERCENT', 80.00, 200000);

SET IDENTITY_INSERT [dbo].[CancellationRules] OFF;
GO


/* =========================================================
   10. BOOKINGS
   ========================================================= */

INSERT INTO [dbo].[Bookings]
(
    [PNR],
    [UserId],
    [TripId],
    [TotalPassengers],
    [TotalAmount],
    [BookingStatus],
    [BookingDate]
)
VALUES
(
    N'PNR100001', 1001, 1001, 1, 500000,
    N'CONFIRMED', '2026-08-20 09:15:00'
),
(
    N'PNR100002', 1002, 1002, 1, 600000,
    N'CONFIRMED', '2026-08-20 10:20:00'
),
(
    N'PNR100003', 1003, 1003, 1, 900000,
    N'CONFIRMED', '2026-08-21 11:30:00'
),
(
    N'PNR100004', 1004, 1004, 1, 600000,
    N'CONFIRMED', '2026-08-21 13:00:00'
),
(
    N'PNR100005', 1005, 1005, 1, 690000,
    N'CONFIRMED', '2026-08-22 14:10:00'
),
(
    N'PNR100006', 1006, 1006, 1, 975000,
    N'CONFIRMED', '2026-08-22 15:30:00'
),
(
    N'PNR100007', 1007, 1007, 1, 960000,
    N'CONFIRMED', '2026-08-23 16:45:00'
);
GO


/* =========================================================
   11. TICKETS
   ========================================================= */
   SET IDENTITY_INSERT dbo.Refunds OFF;
GO
SET IDENTITY_INSERT [dbo].[Tickets] ON;

INSERT INTO [dbo].[Tickets]
(
    [Id],
    [PNR],
    [SeatId],
    [PassengerName],
    [Age],
    [Gender],
    [Fare],
    [Status],
    [CancelReason],
    [CancelledAt]
)
VALUES
(
    1001, N'PNR100001', 1001,
    N'Nguyễn Văn An', 30, N'MALE',
    500000, N'CONFIRMED', NULL, NULL
),
(
    1002, N'PNR100002', 1002,
    N'Trần Thị Bình', 28, N'FEMALE',
    600000, N'CONFIRMED', NULL, NULL
),
(
    1003, N'PNR100003', 1003,
    N'Lê Văn Cường', 35, N'MALE',
    900000, N'CONFIRMED', NULL, NULL
),
(
    1004, N'PNR100004', 1004,
    N'Phạm Thị Dung', 31, N'FEMALE',
    600000, N'CONFIRMED', NULL, NULL
),
(
    1005, N'PNR100005', 1005,
    N'Hoàng Văn Em', 42, N'MALE',
    690000, N'CONFIRMED', NULL, NULL
),
(
    1006, N'PNR100006', 1006,
    N'Vũ Thị Hoa', 26, N'FEMALE',
    975000, N'CONFIRMED', NULL, NULL
),
(
    1007, N'PNR100007', 1007,
    N'Đỗ Văn Khánh', 39, N'MALE',
    960000, N'CONFIRMED', NULL, NULL
);

SET IDENTITY_INSERT [dbo].[Tickets] OFF;
GO


/* =========================================================
   12. PAYMENTS
   ========================================================= */

SET IDENTITY_INSERT [dbo].[Payments] ON;

INSERT INTO [dbo].[Payments]
(
    [Id],
    [PNR],
    [Amount],
    [Method],
    [Status],
    [TransactionId],
    [PaidAt]
)
VALUES
(
    1001, N'PNR100001', 500000,
    N'BANKING', N'SUCCESS',
    N'TXN-20260820-001',
    '2026-08-20 09:16:00'
),
(
    1002, N'PNR100002', 600000,
    N'MOMO', N'SUCCESS',
    N'TXN-20260820-002',
    '2026-08-20 10:21:00'
),
(
    1003, N'PNR100003', 900000,
    N'VNPAY', N'SUCCESS',
    N'TXN-20260821-003',
    '2026-08-21 11:31:00'
),
(
    1004, N'PNR100004', 600000,
    N'BANKING', N'SUCCESS',
    N'TXN-20260821-004',
    '2026-08-21 13:01:00'
),
(
    1005, N'PNR100005', 690000,
    N'MOMO', N'SUCCESS',
    N'TXN-20260822-005',
    '2026-08-22 14:11:00'
),
(
    1006, N'PNR100006', 975000,
    N'VNPAY', N'SUCCESS',
    N'TXN-20260822-006',
    '2026-08-22 15:31:00'
),
(
    1007, N'PNR100007', 960000,
    N'BANKING', N'SUCCESS',
    N'TXN-20260823-007',
    '2026-08-23 16:46:00'
);

SET IDENTITY_INSERT [dbo].[Payments] OFF;
GO


/* =========================================================
   13. REFUNDS
   ========================================================= */
   SET IDENTITY_INSERT dbo.Refunds ON;
GO

SET IDENTITY_INSERT dbo.CancellationRules OFF;
GO

SET IDENTITY_INSERT [dbo].[Refunds] ON;

INSERT INTO [dbo].[Refunds]
(
    [Id],
    [TicketId],
    [CancellationRuleId],
    [AmountPaid],
    [CancellationFee],
    [RefundAmount],
    [RefundStatus],
    [RefundDate]
)
VALUES
(
    1001, 1001, 1001,
    500000, 50000, 450000,
    N'COMPLETED',
    '2026-08-21 09:00:00'
),
(
    1002, 1002, 1002,
    600000, 90000, 510000,
    N'COMPLETED',
    '2026-08-22 10:00:00'
),
(
    1003, 1003, 1003,
    900000, 180000, 720000,
    N'COMPLETED',
    '2026-08-23 11:00:00'
),
(
    1004, 1004, 1004,
    600000, 180000, 420000,
    N'COMPLETED',
    '2026-08-24 12:00:00'
),
(
    1005, 1005, 1005,
    690000, 276000, 414000,
    N'PENDING',
    '2026-08-24 12:00:00'
),
(
    1006, 1006, 1006,
    975000, 487500, 487500,
    N'PENDING',
    '2026-08-24 12:00:00'
),
(
    1007, 1007, 1007,
    960000, 768000, 192000,
    N'REJECTED',
    '2026-08-24 12:00:00'
);

SET IDENTITY_INSERT [dbo].[Refunds] OFF;
GO


/* =========================================================
   14. WAIT LISTS
   ========================================================= */

SET IDENTITY_INSERT [dbo].[WaitLists] ON;

INSERT INTO [dbo].[WaitLists]
(
    [Id],
    [TripId],
    [TicketId],
    [RequestedClass],
    [Position],
    [Status],
    [CreatedAt],
    [ExpiresAt]
)
VALUES
(
    1001, 1001, 1001,
    N'SOFT_SEAT', 1,
    N'WAITING',
    '2026-08-20 09:20:00',
    '2026-08-31 23:59:59'
),
(
    1002, 1002, 1002,
    N'SOFT_SEAT', 1,
    N'WAITING',
    '2026-08-20 10:25:00',
    '2026-09-01 23:59:59'
),
(
    1003, 1003, 1003,
    N'SLEEPER', 1,
    N'CONFIRMED',
    '2026-08-21 11:35:00',
    '2026-09-04 23:59:59'
),
(
    1004, 1004, 1004,
    N'AC_SEAT', 1,
    N'WAITING',
    '2026-08-21 13:05:00',
    '2026-09-06 23:59:59'
),
(
    1005, 1005, 1005,
    N'AC_SEAT', 1,
    N'WAITING',
    '2026-08-22 14:15:00',
    '2026-09-09 23:59:59'
),
(
    1006, 1006, 1006,
    N'SLEEPER', 1,
    N'CONFIRMED',
    '2026-08-22 15:35:00',
    '2026-09-11 23:59:59'
),
(
    1007, 1007, 1007,
    N'SLEEPER', 1,
    N'WAITING',
    '2026-08-23 16:50:00',
    '2026-09-14 23:59:59'
);

SET IDENTITY_INSERT [dbo].[WaitLists] OFF;
GO


/* =========================================================
   COMMIT
   ========================================================= */

COMMIT TRANSACTION;
GO


/* =========================================================
   KIỂM TRA SỐ LƯỢNG RECORD
   ========================================================= */

SELECT 'Users' AS TableName, COUNT(*) AS TotalRows
FROM dbo.Users
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Stations', COUNT(*)
FROM dbo.Stations
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Trains', COUNT(*)
FROM dbo.Trains
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Coaches', COUNT(*)
FROM dbo.Coaches
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Seats', COUNT(*)
FROM dbo.Seats
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Trips', COUNT(*)
FROM dbo.Trips
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'TripStops', COUNT(*)
FROM dbo.TripStops
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'FareRules', COUNT(*)
FROM dbo.FareRules
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'CancellationRules', COUNT(*)
FROM dbo.CancellationRules
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Bookings', COUNT(*)
FROM dbo.Bookings
WHERE PNR LIKE N'PNR100%'

UNION ALL

SELECT 'Tickets', COUNT(*)
FROM dbo.Tickets
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Payments', COUNT(*)
FROM dbo.Payments
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'Refunds', COUNT(*)
FROM dbo.Refunds
WHERE Id BETWEEN 1001 AND 1007

UNION ALL

SELECT 'WaitLists', COUNT(*)
FROM dbo.WaitLists
WHERE Id BETWEEN 1001 AND 1007;
GO