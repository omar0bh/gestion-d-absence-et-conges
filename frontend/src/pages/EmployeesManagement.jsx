import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import EmployeeForm from "../components/EmployeeForm";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";

function EmployeesManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employeeId: null });

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, employeeId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.employeeId) return;

    try {
      await api.delete(`/employees/${deleteModal.employeeId}`);
      if (editingEmployee?.id === deleteModal.employeeId) {
        setEditingEmployee(null);
      }
      fetchEmployees();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Erreur lors de la suppression de l'employé."
      );
    } finally {
      setDeleteModal({ isOpen: false, employeeId: null });
    }
  };

  const actionButtonClass =
    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-200";

  const columns = [
    { key: "matricule", label: "Matricule" },
    {
      key: "fullName",
      label: "Nom Complet",
      render: (row) => (
        <span className="font-bold text-white">{row.user?.fullName || "-"}</span>
      ),
    },
    {
      key: "role",
      label: "Rôle",
      render: (row) => (
        <span className="bg-white/5 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-amber-500/20 uppercase tracking-widest whitespace-nowrap">
          {row.user?.role?.replace("_", " ") || "-"}
        </span>
      ),
    },
    { key: "positionTitle", label: "Poste" },
    {
      key: "department",
      label: "Département",
      render: (row) => row.department?.name || "-",
    },
    { key: "hireDate", label: "Date d'embauche" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingEmployee(row)}
            className={`${actionButtonClass} bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20`}
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className={`${actionButtonClass} bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20`}
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Gestion des Employés"
        subtitle="Maintenir et mettre à jour les dossiers des employés"
      />

      <EmployeeForm
        onEmployeeSaved={fetchEmployees}
        editingEmployee={editingEmployee}
        onCancelEdit={() => setEditingEmployee(null)}
      />

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          Annuaire des Employés
        </h3>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={employees} />
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer l'Employé"
        message="Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible et supprimera toutes les données associées à son dossier."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, employeeId: null })}
      />
    </div>
  );
}

export default EmployeesManagement;