import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

function NewLeaveRequest() {
  const { employeeId } = useAuth();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await api.get("/leave-types");
        setLeaveTypes(response.data);
      } catch (error) {
        console.error("Error loading leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      await api.post("/leave-requests", {
        employeeId: Number(employeeId),
        leaveTypeId: Number(formData.leaveTypeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      setMessage("Leave request submitted successfully.");
      setFormData({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to submit leave request."
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="New Leave Request"
        subtitle="Submit a new leave or absence request"
      />

      <div className="bg-white rounded-[14px] p-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-[20px] text-gray-900">
        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-sm">Leave Type</label>
            <select
              name="leaveTypeId"
              value={formData.leaveTypeId}
              onChange={handleChange}
              className="w-full px-[14px] py-[12px] border border-gray-300 rounded-[10px] outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">Select leave type</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium text-sm">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-[14px] py-[12px] border border-gray-300 rounded-[10px] outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium text-sm">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-[14px] py-[12px] border border-gray-300 rounded-[10px] outline-none focus:ring-2 focus:ring-green-500 bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-sm">Reason</label>
            <textarea
              name="reason"
              rows="4"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Write the reason for your request"
              className="resize-y w-full px-[14px] py-[12px] border border-gray-300 rounded-[10px] outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
          </div>

          {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
          {errorMessage && <p className="text-red-600 text-sm font-medium">{errorMessage}</p>}

          <button type="submit" className="inline-block border-none py-[10px] px-[14px] rounded-lg cursor-pointer text-white bg-green-600 hover:bg-green-700 font-semibold mt-2">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewLeaveRequest;