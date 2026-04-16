import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import axios from "../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileText, CalendarDays, Printer, Filter } from "lucide-react";
import logo1png from "../assets/logo1png.png"; 

function DashboardReportsPanel() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isDirector = user?.role === "DIRECTOR";
  const isDepartmentManager = user?.role === "DEPARTMENT_MANAGER";
  const canViewReports = isDirector || isDepartmentManager;
  const canExportOrPrint = isDirector || isDepartmentManager;

  const [activeTab, setActiveTab] = useState(
    isDirector ? "global_history" : "department_history"
  );

  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [departmentHistory, setDepartmentHistory] = useState([]);
  const [departmentApproved, setDepartmentApproved] = useState([]);
  const [globalHistory, setGlobalHistory] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const printRef = useRef(null);

  const [filters, setFilters] = useState({
    status: "",
    leaveTypeId: "",
    start: "",
    end: "",
  });

  const reportTitle = (() => {
    switch (activeTab) {
      case "department_history":
        return "Historique du Département";
      case "department_approved":
        return "Liste des Congés Approuvés";
      case "global_history":
        return "Historique Global des Congés";
      case "calendar":
        return "Calendrier des Congés";
      default:
        return "Rapport des Congés";
    }
  })();

  const formattedPrintDate = new Date().toLocaleString("fr-FR");

  const currentDepartmentName =
    employeeProfile?.department?.name || "Tous les départements";

  const displayedTabs = useMemo(() => {
    if (isDepartmentManager) {
      return [
        {
          key: "department_history",
          label: "Historique Département",
          icon: <FileText size={16} />,
        },
        {
          key: "department_approved",
          label: "Congés Approuvés",
          icon: <FileText size={16} />,
        },
        {
          key: "calendar",
          label: "Calendrier",
          icon: <CalendarDays size={16} />,
        },
      ];
    }

    if (isDirector) {
      return [
        {
          key: "global_history",
          label: "Historique Global",
          icon: <FileText size={16} />,
        },
        {
          key: "calendar",
          label: "Calendrier",
          icon: <CalendarDays size={16} />,
        },
      ];
    }

    return [];
  }, [isDepartmentManager, isDirector]);

  const currentData = useMemo(() => {
    switch (activeTab) {
      case "department_history":
        return departmentHistory;
      case "department_approved":
        return departmentApproved;
      case "global_history":
        return globalHistory;
      case "calendar":
        return calendarData;
      default:
        return [];
    }
  }, [activeTab, departmentHistory, departmentApproved, globalHistory, calendarData]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: reportTitle.replaceAll(" ", "_"),
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 12mm;
      }

      @media print {
        html, body {
          background: #ffffff !important;
          color: #000000 !important;
          font-family: Arial, Helvetica, sans-serif !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        body * {
          visibility: hidden;
        }

        .print-area,
        .print-area * {
          visibility: visible;
        }

        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: white !important;
          color: black !important;
        }

        table {
          width: 100% !important;
          border-collapse: collapse !important;
        }

        thead {
          display: table-header-group !important;
        }

        tr, td, th {
          page-break-inside: avoid !important;
        }
      }
    `,
  });

  const handleExportExcel = () => {
    if (!currentData || currentData.length === 0) return;

    const formattedData = currentData.map((row) => ({
      Employe: row.employee?.user?.fullName || "-",
      Type: row.leaveType?.name || "-",
      Departement: row.employee?.department?.name || "-",
      DateDebut: row.startDate || "-",
      DateFin: row.endDate || "-",
      Jours: row.numberOfDays || "-",
      Statut: row.status || "-",
      CreeLe: row.createdAt?.slice(0, 10) || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Conges");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileNameMap = {
      department_history: "historique_departement.xlsx",
      department_approved: "conges_approuves.xlsx",
      global_history: "historique_global.xlsx",
      calendar: "calendrier_conges.xlsx",
    };

    saveAs(file, fileNameMap[activeTab] || "historique_conges.xlsx");
  };

  useEffect(() => {
    if (!canViewReports) return;

    const loadData = async () => {
      setLoading(true);

      try {
        let resolvedEmployeeProfile = null;

        if (user?.id) {
          try {
            const employeeRes = await axios.get(`/employees/user/${user.id}`);
            resolvedEmployeeProfile = employeeRes.data;
            setEmployeeProfile(employeeRes.data);
          } catch (error) {
            setEmployeeProfile(null);
          }
        }

        const departmentId = resolvedEmployeeProfile?.department?.id;

        const requests = [
          isDepartmentManager && departmentId
            ? axios.get(`/dashboard/department-history/${departmentId}`)
            : Promise.resolve({ data: [] }),

          isDepartmentManager && departmentId
            ? axios.get(`/dashboard/department-approved/${departmentId}`)
            : Promise.resolve({ data: [] }),

          isDirector
            ? axios.get("/dashboard/global-history")
            : Promise.resolve({ data: [] }),

          axios.get("/leave-types"),
        ];

        const results = await Promise.allSettled(requests);

        const departmentHistoryRes =
          results[0].status === "fulfilled" ? results[0].value.data || [] : [];
        const departmentApprovedRes =
          results[1].status === "fulfilled" ? results[1].value.data || [] : [];
        const globalHistoryRes =
          results[2].status === "fulfilled" ? results[2].value.data || [] : [];
        const leaveTypesRes =
          results[3].status === "fulfilled" ? results[3].value.data || [] : [];

        setDepartmentHistory(Array.isArray(departmentHistoryRes) ? departmentHistoryRes : []);
        setDepartmentApproved(Array.isArray(departmentApprovedRes) ? departmentApprovedRes : []);
        setGlobalHistory(Array.isArray(globalHistoryRes) ? globalHistoryRes : []);
        setLeaveTypes(Array.isArray(leaveTypesRes) ? leaveTypesRes : []);
      } catch (error) {
        console.error("Error loading dashboard reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [canViewReports, isDepartmentManager, isDirector, user?.id]);

  useEffect(() => {
    if (!canViewReports) return;

    const loadCalendarData = async () => {
      try {
        const params = new URLSearchParams();

        if (filters.status) params.append("status", filters.status);
        if (filters.leaveTypeId) params.append("leaveTypeId", filters.leaveTypeId);
        if (filters.start) params.append("start", filters.start);
        if (filters.end) params.append("end", filters.end);

        const response = await axios.get(`/dashboard/calendar?${params.toString()}`);
        let data = response.data || [];

        if (isDepartmentManager && employeeProfile?.department?.id) {
          data = data.filter(
            (item) =>
              String(item.employee?.department?.id) ===
              String(employeeProfile.department.id)
          );
        }

        setCalendarData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading calendar data:", error);
      }
    };

    loadCalendarData();
  }, [filters, canViewReports, isDepartmentManager, employeeProfile]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const statusLabel = (status) => {
    const labels = {
      APPROVED: "Approuvé",
      REJECTED: "Rejeté",
      PENDING_SERVICE: "Service",
      PENDING_DIVISION: "Division",
      PENDING_DEPARTMENT: "Département",
      PENDING_HR: "RH",
      PENDING_DIRECTOR: "Directeur",
    };

    return labels[status] || status || "-";
  };

  const statusBadge = (status) => {
    const styles = {
      APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      PENDING_SERVICE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      PENDING_DIVISION: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      PENDING_DEPARTMENT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      PENDING_HR: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      PENDING_DIRECTOR: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    return styles[status] || "bg-white/5 text-stone-300 border-white/10";
  };

  if (!canViewReports) return null;

  return (
    <div className="glass-card p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 print:hidden">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
            Historique & Impression
          </h3>
          <p className="text-stone-400 text-sm mt-2">
            Consultation des congés, historique et calendrier imprimable
          </p>
        </div>

        {canExportOrPrint && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-emerald-600/90 hover:bg-emerald-700 border border-emerald-500/40 transition-colors"
            >
              <FileText size={16} />
              Export Excel
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-stone-50 bg-[#4a3b32]/90 hover:bg-[#3d312a] border border-[#5c493d]/50 transition-colors"
            >
              <Printer size={16} />
              Impression
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-8 print:hidden">
        {displayedTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
              activeTab === tab.key
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-stone-100/5 border border-white/10 text-stone-300 shadow-sm backdrop-blur-md hover:bg-stone-100/10"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "calendar" && (
        <div className="glass-card p-6 mb-8 print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-inner">
              <Filter size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-stone-300">
                Filtres Calendrier
              </h4>
              <p className="text-stone-500 text-xs font-medium mt-1">
                Filtrer par statut, type et intervalle de dates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
                Statut
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner"
              >
                <option value="">Tous</option>
                <option value="APPROVED">Approuvé</option>
                <option value="REJECTED">Rejeté</option>
                <option value="PENDING_SERVICE">Pending Service</option>
                <option value="PENDING_DIVISION">Pending Division</option>
                <option value="PENDING_DEPARTMENT">Pending Department</option>
                <option value="PENDING_HR">Pending HR</option>
                <option value="PENDING_DIRECTOR">Pending Director</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
                Type
              </label>
              <select
                name="leaveTypeId"
                value={filters.leaveTypeId}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner"
              >
                <option value="">Tous</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
                Date Début
              </label>
              <input
                type="date"
                name="start"
                value={filters.start}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner [color-scheme:dark]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
                Date Fin
              </label>
              <input
                type="date"
                name="end"
                value={filters.end}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-600/50 rounded-xl focus:outline-none focus:border-amber-700/80 focus:ring-1 focus:ring-amber-700/50 text-stone-100 transition-all shadow-inner [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      )}

      <div ref={printRef} className="print-area bg-white text-black">
        <div className="hidden print:block w-full mb-8">
          <div className="flex items-start justify-between border-b-2 border-black pb-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                <img src={logo1png} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>

              <div className="text-black">
                <h1 className="text-2xl font-bold uppercase tracking-wide">
                  Gestion des Congés
                </h1>
                <h2 className="text-lg font-semibold mt-1">
                  {reportTitle}
                </h2>
                <div className="mt-4 space-y-1 text-sm">
                  <p><span className="font-semibold">Utilisateur :</span> {user?.fullName || "-"}</p>
                  <p><span className="font-semibold">Rôle :</span> {user?.role?.replaceAll("_", " ") || "-"}</p>
                  <p><span className="font-semibold">Département :</span> {isDirector ? "Global" : currentDepartmentName}</p>
                  <p><span className="font-semibold">Date d'impression :</span> {formattedPrintDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white text-center text-black border border-gray-300 p-10 rounded-none">
            Chargement...
          </div>
        ) : currentData.length === 0 ? (
          <div className="bg-white text-center text-black border border-gray-300 p-10 rounded-none">
            Aucune donnée trouvée pour cette section.
          </div>
        ) : (
          <div className="bg-white text-black border border-gray-400 overflow-hidden rounded-none shadow-none">
            <div className="overflow-visible">
              <table className="w-full text-sm border-collapse min-w-0">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 px-3 py-3 text-[11px] font-bold uppercase text-left text-black">
                      Employé
                    </th>
                    <th className="border border-gray-400 px-3 py-3 text-[11px] font-bold uppercase text-left text-black">
                      Type
                    </th>
                    <th className="border border-gray-400 px-3 py-3 text-[11px] font-bold uppercase text-left text-black">
                      Département
                    </th>
                    <th className="border border-gray-400 px-3 py-3 text-[11px] font-bold uppercase text-left text-black">
                      Dates
                    </th>
                    <th className="border border-gray-400 px-3 py-3 text-[11px] font-bold uppercase text-center text-black">
                      Jours
                    </th>
                    <th className="border border-gray-400 px-3 py-3 text-[11px] font-bold uppercase text-center text-black">
                      Statut
                    </th>
                    <th className="border border-gray-400 px-3 py-3 text-[11px] font-bold uppercase text-center text-black">
                      Créée le
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.map((row) => (
                    <tr key={row.id}>
                      <td className="border border-gray-300 px-3 py-3 text-black align-top">
                        {row.employee?.user?.fullName || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-black align-top">
                        {row.leaveType?.name || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-black align-top">
                        {row.employee?.department?.name || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-black align-top whitespace-nowrap">
                        {row.startDate} → {row.endDate}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-black text-center align-top">
                        {row.numberOfDays || "-"}
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-center align-top">
                        <span className="inline-block px-2 py-1 text-[10px] font-bold border border-gray-400 text-black rounded-none">
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-3 text-black text-center align-top whitespace-nowrap">
                        {row.createdAt?.slice(0, 10) || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="hidden print:flex justify-end mt-6 text-xs text-black px-2 pb-2">
              Document généré par le système de gestion des congés
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardReportsPanel;