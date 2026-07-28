// src/features/admin/DailyCash.js
import React, { useState } from "react";
import { useTrain } from "../../hooks/useTrain";
import Button from "../../components/Button";
import * as XLSX from "xlsx";

const DailyCash = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const { getDailyCash, passengers } = useTrain();
  const [report, setReport] = useState(getDailyCash(selectedDate));

  const handleGenerate = () => {
    setReport(getDailyCash(selectedDate));
  };

  const exportToExcel = () => {
    const bookings = passengers.filter(
      (p) => p.dateOfTravel === selectedDate && !p.cancelled,
    );
    const cancellations = passengers.filter(
      (p) => p.cancellationDate === selectedDate,
    );

    const wb = XLSX.utils.book_new();

    const bookingData = bookings.map((p) => ({
      PNR: p.pnr,
      Name: p.name,
      TrainNo: p.trainNo,
      Class: p.class,
      Fare: p.fare,
      Seat: `${p.coachNo}/${p.seatNo}`,
    }));

    const cancellationData = cancellations.map((p) => ({
      PNR: p.pnr,
      Name: p.name,
      TrainNo: p.trainNo,
      RefundAmount: p.refundAmount,
      CancelledOn: p.cancellationDate,
    }));

    const summaryData = [
      {
        Date: report.date,
        TotalReceived: report.received,
        TotalRefunded: report.refunded,
        NetAmount: report.net,
      },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    const wsBookings = XLSX.utils.json_to_sheet(bookingData);
    const wsCancellations = XLSX.utils.json_to_sheet(cancellationData);

    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    XLSX.utils.book_append_sheet(wb, wsBookings, "Bookings");
    XLSX.utils.book_append_sheet(wb, wsCancellations, "Cancellations");

    XLSX.writeFile(wb, `DailyCash_${selectedDate}.xlsx`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Daily Cash Transaction</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <Button variant="primary" onClick={handleGenerate}>
            Generate Report
          </Button>
          <Button variant="success" onClick={exportToExcel}>
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">Money Received</p>
          <p className="text-2xl font-bold text-green-800">
            ₹{report.received}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">Money Refunded</p>
          <p className="text-2xl font-bold text-red-800">₹{report.refunded}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">Net Amount</p>
          <p className="text-2xl font-bold text-blue-800">₹{report.net}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">
          Transaction Summary for {report.date}
        </h3>
        <p className="text-sm text-gray-600">
          Total Bookings:{" "}
          {
            passengers.filter(
              (p) => p.dateOfTravel === selectedDate && !p.cancelled,
            ).length
          }{" "}
          | Total Cancellations:{" "}
          {passengers.filter((p) => p.cancellationDate === selectedDate).length}
        </p>
      </div>
    </div>
  );
};

export default DailyCash;
