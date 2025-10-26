import { UserForm } from "@/components/admin/users/user-form";

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">
          Update user information and permissions
        </p>
      </div>
      <UserForm userId={params.id} />
    </div>
  );
}
