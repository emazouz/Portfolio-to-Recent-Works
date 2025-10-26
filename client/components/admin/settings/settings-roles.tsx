"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Users, Plus, Edit, Trash2, Crown, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
  isSystem: boolean;
}

const PERMISSIONS: Permission[] = [
  // Content Management
  {
    id: "content.create",
    name: "Create Content",
    description: "Create new blog posts, projects, and templates",
    category: "Content",
  },
  {
    id: "content.edit",
    name: "Edit Content",
    description: "Edit existing content",
    category: "Content",
  },
  {
    id: "content.delete",
    name: "Delete Content",
    description: "Delete content permanently",
    category: "Content",
  },
  {
    id: "content.publish",
    name: "Publish Content",
    description: "Publish and unpublish content",
    category: "Content",
  },

  // User Management
  {
    id: "users.view",
    name: "View Users",
    description: "View user profiles and information",
    category: "Users",
  },
  {
    id: "users.create",
    name: "Create Users",
    description: "Create new user accounts",
    category: "Users",
  },
  {
    id: "users.edit",
    name: "Edit Users",
    description: "Edit user profiles and information",
    category: "Users",
  },
  {
    id: "users.delete",
    name: "Delete Users",
    description: "Delete user accounts",
    category: "Users",
  },
  {
    id: "users.ban",
    name: "Ban Users",
    description: "Ban and unban user accounts",
    category: "Users",
  },

  // Orders & Payments
  {
    id: "orders.view",
    name: "View Orders",
    description: "View order details and history",
    category: "Orders",
  },
  {
    id: "orders.edit",
    name: "Edit Orders",
    description: "Edit order status and details",
    category: "Orders",
  },
  {
    id: "orders.refund",
    name: "Process Refunds",
    description: "Process order refunds",
    category: "Orders",
  },

  // Settings
  {
    id: "settings.general",
    name: "General Settings",
    description: "Manage general site settings",
    category: "Settings",
  },
  {
    id: "settings.payments",
    name: "Payment Settings",
    description: "Configure payment gateways",
    category: "Settings",
  },
  {
    id: "settings.email",
    name: "Email Settings",
    description: "Configure email settings",
    category: "Settings",
  },
  {
    id: "settings.security",
    name: "Security Settings",
    description: "Manage security configurations",
    category: "Settings",
  },

  // System
  {
    id: "system.backup",
    name: "System Backup",
    description: "Create and restore system backups",
    category: "System",
  },
  {
    id: "system.logs",
    name: "View Logs",
    description: "View system and audit logs",
    category: "System",
  },
  {
    id: "system.maintenance",
    name: "Maintenance Mode",
    description: "Enable/disable maintenance mode",
    category: "System",
  },

  // Roles & Permissions
  {
    id: "roles.view",
    name: "View Roles",
    description: "View roles and permissions",
    category: "Roles",
  },
  {
    id: "roles.create",
    name: "Create Roles",
    description: "Create new roles",
    category: "Roles",
  },
  {
    id: "roles.edit",
    name: "Edit Roles",
    description: "Edit existing roles",
    category: "Roles",
  },
  {
    id: "roles.delete",
    name: "Delete Roles",
    description: "Delete roles",
    category: "Roles",
  },
  {
    id: "roles.assign",
    name: "Assign Roles",
    description: "Assign roles to users",
    category: "Roles",
  },
];

export function SettingsRoles() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Super Admin",
      description: "Full system access with all permissions",
      color: "red",
      permissions: PERMISSIONS.map((p) => p.id),
      userCount: 1,
      isDefault: false,
      isSystem: true,
    },
    {
      id: "2",
      name: "Admin",
      description: "Administrative access with most permissions",
      color: "blue",
      permissions: PERMISSIONS.filter((p) => !p.id.startsWith("system.")).map(
        (p) => p.id
      ),
      userCount: 3,
      isDefault: false,
      isSystem: false,
    },
    {
      id: "3",
      name: "Editor",
      description: "Content management and editing permissions",
      color: "green",
      permissions: PERMISSIONS.filter((p) => p.category === "Content").map(
        (p) => p.id
      ),
      userCount: 5,
      isDefault: false,
      isSystem: false,
    },
    {
      id: "4",
      name: "User",
      description: "Basic user permissions",
      color: "gray",
      permissions: [],
      userCount: 150,
      isDefault: true,
      isSystem: true,
    },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: "",
    description: "",
    color: "blue",
    permissions: [],
  });

  const roleColors = [
    {
      value: "red",
      label: "Red",
      class: "bg-red-100 text-red-800 border-red-200",
    },
    {
      value: "blue",
      label: "Blue",
      class: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      value: "green",
      label: "Green",
      class: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "yellow",
      label: "Yellow",
      class: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      value: "purple",
      label: "Purple",
      class: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      value: "gray",
      label: "Gray",
      class: "bg-gray-100 text-gray-800 border-gray-200",
    },
  ];

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {};
    PERMISSIONS.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const handleCreateRole = () => {
    if (!newRole.name) return;

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description || "",
      color: newRole.color || "blue",
      permissions: newRole.permissions || [],
      userCount: 0,
      isDefault: false,
      isSystem: false,
    };

    setRoles((prev) => [...prev, role]);
    setNewRole({ name: "", description: "", color: "blue", permissions: [] });
    setIsCreateDialogOpen(false);

    toast({
      title: t("Success"),
      description: t("Role created successfully"),
    });
  };

  const handleEditRole = () => {
    if (!selectedRole) return;

    setRoles((prev) =>
      prev.map((role) => (role.id === selectedRole.id ? selectedRole : role))
    );
    setIsEditDialogOpen(false);
    setSelectedRole(null);

    toast({
      title: t("Success"),
      description: t("Role updated successfully"),
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role || role.isSystem) return;

    setRoles((prev) => prev.filter((r) => r.id !== roleId));

    toast({
      title: t("Success"),
      description: t("Role deleted successfully"),
    });
  };

  const togglePermission = (
    permissionId: string,
    rolePermissions: string[],
    setPermissions: (permissions: string[]) => void
  ) => {
    if (rolePermissions.includes(permissionId)) {
      setPermissions(rolePermissions.filter((p) => p !== permissionId));
    } else {
      setPermissions([...rolePermissions, permissionId]);
    }
  };

  const getRoleIcon = (role: Role) => {
    if (role.name === "Super Admin") return <Crown className="h-4 w-4" />;
    if (role.name === "Admin") return <Shield className="h-4 w-4" />;
    if (role.name === "Editor") return <Edit className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getRoleColorClass = (color: string) => {
    return (
      roleColors.find((c) => c.value === color)?.class ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-2xl font-bold">{t("Roles & Permissions")}</h2>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("Create Role")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("Create New Role")}</DialogTitle>
              <DialogDescription>
                {t("Create a new role and assign permissions")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">{t("Role Name")}</Label>
                  <Input
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) =>
                      setNewRole((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t("Enter role name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-color">{t("Color")}</Label>
                  <div className="flex gap-2">
                    {roleColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          newRole.color === color.value
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : ""
                        } ${color.class}`}
                        onClick={() =>
                          setNewRole((prev) => ({
                            ...prev,
                            color: color.value,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-description">{t("Description")}</Label>
                <Textarea
                  id="role-description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder={t("Enter role description")}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {t("Permissions")}
                </Label>
                {Object.entries(getPermissionsByCategory()).map(
                  ([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        {t(category)}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start space-x-2"
                          >
                            <Checkbox
                              id={`new-${permission.id}`}
                              checked={newRole.permissions?.includes(
                                permission.id
                              )}
                              onCheckedChange={() =>
                                togglePermission(
                                  permission.id,
                                  newRole.permissions || [],
                                  (permissions) =>
                                    setNewRole((prev) => ({
                                      ...prev,
                                      permissions,
                                    }))
                                )
                              }
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={`new-${permission.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {t(permission.name)}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {t(permission.description)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                {t("Cancel")}
              </Button>
              <Button onClick={handleCreateRole} disabled={!newRole.name}>
                {t("Create Role")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("System Roles")}
          </CardTitle>
          <CardDescription>
            {t("Manage roles and their permissions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Role")}</TableHead>
                <TableHead>{t("Description")}</TableHead>
                <TableHead>{t("Users")}</TableHead>
                <TableHead>{t("Permissions")}</TableHead>
                <TableHead>{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <Badge className={getRoleColorClass(role.color)}>
                        {t(role.name)}
                      </Badge>
                      {role.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          {t("Default")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {t(role.description)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {role.userCount} {t("users")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {role.permissions.length} {t("permissions")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={isEditDialogOpen && selectedRole?.id === role.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (open) setSelectedRole({ ...role });
                          else setSelectedRole(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {t("Edit Role")}: {selectedRole?.name}
                            </DialogTitle>
                            <DialogDescription>
                              {t("Modify role permissions and settings")}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedRole && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-role-name">
                                    {t("Role Name")}
                                  </Label>
                                  <Input
                                    id="edit-role-name"
                                    value={selectedRole.name}
                                    onChange={(e) =>
                                      setSelectedRole((prev) =>
                                        prev
                                          ? { ...prev, name: e.target.value }
                                          : null
                                      )
                                    }
                                    disabled={selectedRole.isSystem}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-role-color">
                                    {t("Color")}
                                  </Label>
                                  <div className="flex gap-2">
                                    {roleColors.map((color) => (
                                      <button
                                        key={color.value}
                                        type="button"
                                        className={`w-8 h-8 rounded-full border-2 ${
                                          selectedRole.color === color.value
                                            ? "ring-2 ring-offset-2 ring-blue-500"
                                            : ""
                                        } ${color.class}`}
                                        onClick={() =>
                                          setSelectedRole((prev) =>
                                            prev
                                              ? { ...prev, color: color.value }
                                              : null
                                          )
                                        }
                                        disabled={selectedRole.isSystem}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit-role-description">
                                  {t("Description")}
                                </Label>
                                <Textarea
                                  id="edit-role-description"
                                  value={selectedRole.description}
                                  onChange={(e) =>
                                    setSelectedRole((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            description: e.target.value,
                                          }
                                        : null
                                    )
                                  }
                                  disabled={selectedRole.isSystem}
                                  rows={3}
                                />
                              </div>

                              <Separator />

                              <div className="space-y-4">
                                <Label className="text-base font-medium">
                                  {t("Permissions")}
                                </Label>
                                {Object.entries(getPermissionsByCategory()).map(
                                  ([category, permissions]) => (
                                    <div key={category} className="space-y-2">
                                      <h4 className="font-medium text-sm text-muted-foreground">
                                        {t(category)}
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {permissions.map((permission) => (
                                          <div
                                            key={permission.id}
                                            className="flex items-start space-x-2"
                                          >
                                            <Checkbox
                                              id={`edit-${permission.id}`}
                                              checked={selectedRole.permissions.includes(
                                                permission.id
                                              )}
                                              onCheckedChange={() =>
                                                togglePermission(
                                                  permission.id,
                                                  selectedRole.permissions,
                                                  (permissions) =>
                                                    setSelectedRole((prev) =>
                                                      prev
                                                        ? {
                                                            ...prev,
                                                            permissions,
                                                          }
                                                        : null
                                                    )
                                                )
                                              }
                                              disabled={
                                                selectedRole.isSystem &&
                                                selectedRole.name ===
                                                  "Super Admin"
                                              }
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                              <Label
                                                htmlFor={`edit-${permission.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                {t(permission.name)}
                                              </Label>
                                              <p className="text-xs text-muted-foreground">
                                                {t(permission.description)}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditDialogOpen(false)}
                            >
                              {t("Cancel")}
                            </Button>
                            <Button onClick={handleEditRole}>
                              {t("Save Changes")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {!role.isSystem && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
