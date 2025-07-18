/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { getUsers, getLeaves } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPortalLayout } from "@/components/layouts/AdminPortalLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, UserPlus, Settings, Shield, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useRef } from "react";
import axios from "axios";

const translations = {
  en: {
    userManagement: "User Management",
    userManagementDesc: "Manage employee profiles, roles, and permissions",
    addUser: "Add User",
    totalUsers: "Total Users",
    totalUsersDesc: "+12 from last month",
    activeUsers: "Active Users",
    activeUsersDesc: "91% active rate",
    pendingApprovals: "Pending Approvals",
    pendingApprovalsDesc: "Require action",
    newThisMonth: "New This Month",
    newThisMonthDesc: "+20% vs last month",
    userDirectory: "User Directory",
    userDirectoryDesc: "Manage employee profiles, contracts, and permissions",
    searchUsers: "Search users...",
    filter: "Filter",
    role: "Role",
    department: "Department",
    status: "Status",
    edit: "Edit",
    active: "Active",
    inactive: "Inactive",
    pendingLeaveRequests: "Pending Leave Requests",
  },
  fr: {
    userManagement: "Gestion des utilisateurs",
    userManagementDesc: "Gérer les profils, rôles et permissions des employés",
    addUser: "Ajouter un utilisateur",
    totalUsers: "Nombre total d'utilisateurs",
    totalUsersDesc: "+12 depuis le mois dernier",
    activeUsers: "Utilisateurs actifs",
    activeUsersDesc: "91% taux d'activité",
    pendingApprovals: "Approbations en attente",
    pendingApprovalsDesc: "Action requise",
    newThisMonth: "Nouveaux ce mois-ci",
    newThisMonthDesc: "+20% vs le mois dernier",
    userDirectory: "Annuaire des utilisateurs",
    userDirectoryDesc:
      "Gérer les profils, contrats et permissions des employés",
    searchUsers: "Rechercher des utilisateurs...",
    filter: "Filtrer",
    role: "Rôle",
    department: "Département",
    status: "Statut",
    edit: "Modifier",
    active: "Actif",
    inactive: "Inactif",
    pendingLeaveRequests: "Demandes de congé en attente",
  },
};

const UserManagement = () => {
  const { language } = useLanguage();
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key];

  const [users, setUsers] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [pendingApprovals, setPendingApprovals] = useState<number>(0);
  const [newThisMonth, setNewThisMonth] = useState<number>(0);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({
    Names: "",
    Email: "",
    password: "",
    role: "admin",
    department: ""
  });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    getUsers().then((res: any) => {
      const userList = res.data || [];
      setUsers(userList);

      setActiveUsers(userList.filter((u: any) => u.status === "active").length);
      setPendingApprovals(userList.filter((u: any) => u.status === "pending").length);

      const now = new Date();
      setNewThisMonth(
        userList.filter((u: any) => {
          const created = new Date(u.createdAt);
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length
      );
    });

    getLeaves().then((res: any) => {
      // API returns { success, message, data: [...] }
      const leaves = res.data || [];
      // Only leaves with status "Pending"
      setPendingLeaves(leaves.filter((l: any) => l.status === "Pending"));
    });
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.Names.toLowerCase().includes(search.toLowerCase()) ||
        user.Email.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "" || user.role === roleFilter;
      const matchesDepartment =
        departmentFilter === "" || user.department === departmentFilter;
      const matchesStatus =
        statusFilter === "" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [users, search, roleFilter, departmentFilter, statusFilter]);

  // Get unique roles and departments for filter dropdowns
  const roles = useMemo(() => Array.from(new Set(users.map(u => u.role))), [users]);
  const departments = useMemo(() => Array.from(new Set(users.map(u => u.department))), [users]);
  const statuses = ["active", "pending", "inactive"];

  // Add user handler
  const handleAddUser = async () => {
    setAddLoading(true);
    try {
      await axios.post("/auth/register", form);
      toast({ title: "User added successfully" });
      setAddModalOpen(false);
      setForm({ Names: "", Email: "", password: "", role: "admin", department: "" });
      // Refresh users
      getUsers().then((res: any) => {
        const userList = res.data || [];
        setUsers(userList);
        setActiveUsers(userList.filter((u: any) => u.status === "active").length);
        setPendingApprovals(userList.filter((u: any) => u.status === "pending").length);
        const now = new Date();
        setNewThisMonth(
          userList.filter((u: any) => {
            const created = new Date(u.createdAt);
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length
        );
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to add user", variant: "destructive" });
    } finally {
      setAddLoading(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeleteLoading(userId);
    try {
      await axios.delete(`/auth/user/${userId}`);
      toast({ title: "User deleted successfully" });
      // Refresh users
      getUsers().then((res: any) => {
        const userList = res.data || [];
        setUsers(userList);
        setActiveUsers(userList.filter((u: any) => u.status === "active").length);
        setPendingApprovals(userList.filter((u: any) => u.status === "pending").length);
        const now = new Date();
        setNewThisMonth(
          userList.filter((u: any) => {
            const created = new Date(u.createdAt);
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length
        );
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || err.message || "Failed to delete user", variant: "destructive" });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <AdminPortalLayout>
      <div className="space-y-4 md:space-y-6 p-2 md:p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("userManagement")}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("userManagementDesc")}
            </p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto" onClick={() => setAddModalOpen(true)}>
            <UserPlus className="h-4 w-4" />
            <span className="sm:inline">{t("addUser")}</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("totalUsers")}
              </CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {t("totalUsersDesc")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("activeUsers")}
              </CardTitle>
              <Shield className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {t("activeUsersDesc")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("pendingApprovals")}
              </CardTitle>
              <Settings className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                {t("pendingApprovalsDesc")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">
                {t("pendingLeaveRequests")}
              </CardTitle>
              <Settings className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{pendingLeaves.length}</div>
              <p className="text-xs text-muted-foreground">
                {t("pendingApprovalsDesc")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("userDirectory")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("userDirectoryDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                  placeholder={t("searchUsers")}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                >
                  <option value="">{t("role")}</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={departmentFilter}
                  onChange={e => setDepartmentFilter(e.target.value)}
                >
                  <option value="">{t("department")}</option>
                  {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">{t("status")}</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === "active"
                        ? t("active")
                        : status === "inactive"
                        ? t("inactive")
                        : status === "pending"
                        ? t("pendingApprovals")
                        : status}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    setRoleFilter("");
                    setDepartmentFilter("");
                    setStatusFilter("");
                    setSearch("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-4"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-medium">
                        {user.Names
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-sm md:text-base truncate">
                        {user.Names}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {user.Email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-xs md:text-sm font-medium">
                        {t("role")}: {user.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("department")}: {user.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {t(user.status === "active" ? "active" : "inactive")}
                      </Badge>
                      <Button variant="outline" size="sm" className="text-xs">
                        {t("edit")}
                      </Button>
                      <Button variant="destructive" size="sm" className="text-xs" onClick={() => handleDeleteUser(user._id)} disabled={deleteLoading === user._id}>
                        {deleteLoading === user._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No users found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              {t("pendingLeaveRequests")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("pendingApprovalsDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">{t("role")}</th>
                    <th className="px-2 py-1 text-left">{t("department")}</th>
                    <th className="px-2 py-1 text-left">Name</th>
                    <th className="px-2 py-1 text-left">Email</th>
                    <th className="px-2 py-1 text-left">Type</th>
                    <th className="px-2 py-1 text-left">Start</th>
                    <th className="px-2 py-1 text-left">End</th>
                    <th className="px-2 py-1 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-4 text-muted-foreground">
                        No pending leave requests.
                      </td>
                    </tr>
                  )}
                  {pendingLeaves.map((leave: any) => (
                    <tr key={leave._id}>
                      <td className="px-2 py-1">{leave.employee?.role || "-"}</td>
                      <td className="px-2 py-1">{leave.employee?.department || "-"}</td>
                      <td className="px-2 py-1">{leave.employee?.Names || "-"}</td>
                      <td className="px-2 py-1">{leave.employee?.Email || "-"}</td>
                      <td className="px-2 py-1">{leave.type}</td>
                      <td className="px-2 py-1">{leave.startDate?.slice(0, 10)}</td>
                      <td className="px-2 py-1">{leave.endDate?.slice(0, 10)}</td>
                      <td className="px-2 py-1">{leave.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Names"
              value={form.Names}
              onChange={e => setForm(f => ({ ...f, Names: e.target.value }))}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.Email}
              onChange={e => setForm(f => ({ ...f, Email: e.target.value }))}
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            <select
              className="border rounded px-2 py-1 w-full"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option value="admin">admin</option>
              <option value="employee">employee</option>
              <option value="manager">manager</option>
            </select>
            <Input
              placeholder="Department"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddUser} disabled={addLoading}>
              {addLoading ? "Adding..." : "Add User"}
            </Button>
            <Button variant="outline" onClick={() => setAddModalOpen(false)} disabled={addLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPortalLayout>
  );
};

export default UserManagement;
