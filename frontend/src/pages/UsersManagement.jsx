import { useEffect, useState } from "react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import UserForm from "../components/UserForm";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, userId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.userId) return;

    try {
      await api.delete(`/users/${deleteModal.userId}`);
      if (editingUser?.id === deleteModal.userId) {
        setEditingUser(null);
      }
      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          "Erreur lors de la suppression de l'utilisateur."
      );
    } finally {
      setDeleteModal({ isOpen: false, userId: null });
    }
  };

  const actionButtonClass =
    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-200";

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "fullName",
      label: "Nom Complet",
      render: (row) => (
        <span className="font-bold text-white">{row.fullName}</span>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Rôle",
      render: (row) => (
        <span className="bg-white/5 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-amber-500/20 uppercase tracking-widest">
          {row.role?.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "active",
      label: "Statut",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest ${
            row.active
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {row.active ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingUser(row)}
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
        title="Gestion des Utilisateurs"
        subtitle="Gérer les accès système et l'authentification"
      />

      <UserForm
        onUserSaved={fetchUsers}
        editingUser={editingUser}
        onCancelEdit={() => setEditingUser(null)}
      />

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
          Utilisateurs Enregistrés
        </h3>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loading />
          </div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Supprimer l'Utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera toutes les données associées à ce compte."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, userId: null })}
      />
    </div>
  );
}

export default UsersManagement;