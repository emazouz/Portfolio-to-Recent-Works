import { BlogForm } from "@/components/admin/blogs/BlogForm";

interface ViewBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPage({ params }: ViewBlogPageProps) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const blogId = parseInt(resolvedParams.id, 10);

  // Handle invalid ID
  if (isNaN(blogId)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Invalid Blog ID</h2>
          <p className="text-muted-foreground">
            The blog ID {blogId} provided is not valid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground">Update blog post information</p>
      </div>
      <BlogForm blogId={blogId} />
    </div>
  );
}
