import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

function RequestCard({ request, showActions = false, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-[14px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] mb-5 text-gray-900 flex flex-col h-full">
      <div className="flex justify-between gap-4 items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-[6px]">{request.leaveType?.name || "-"}</h3>
          <p className="text-sm font-medium text-gray-500">
            {request.startDate} → {request.endDate}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="flex flex-col gap-2 flex-grow text-gray-700 text-sm mb-4">
        <p>
          <strong>Employee:</strong> {request.employee?.user?.fullName || "-"}
        </p>
        <p>
          <strong>Days:</strong> {request.numberOfDays}
        </p>
        <p>
          <strong>Reason:</strong> {request.reason || "-"}
        </p>
      </div>

      <div className="flex flex-wrap gap-[10px] mt-4">
        <Link to={`/leave-request-details/${request.id}`} className="inline-block border-none py-[10px] px-[14px] rounded-lg cursor-pointer text-white bg-gray-600 hover:bg-gray-700 text-sm font-medium text-center flex-1">
          Details
        </Link>

        {showActions && (
          <>
            <button className="inline-block border-none py-[10px] px-[14px] rounded-lg cursor-pointer text-white bg-green-600 hover:bg-green-700 text-sm font-medium flex-1" onClick={() => onApprove(request.id)}>
              Approve
            </button>
            <button className="inline-block border-none py-[10px] px-[14px] rounded-lg cursor-pointer text-white bg-red-600 hover:bg-red-700 text-sm font-medium flex-1" onClick={() => onReject(request.id)}>
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RequestCard;