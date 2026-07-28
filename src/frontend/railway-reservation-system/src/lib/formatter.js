// frontend/src/lib/formatters.js

export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toLocaleString("en-IN")}`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr || timeStr === "-") return "-";
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "text-green-600 bg-green-50";
    case "WAITLIST":
      return "text-orange-600 bg-orange-50";
    case "CANCELLED":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
