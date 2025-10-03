import { BlogList } from "@/components/blog/blog-list";

export const metadata = {
  title: "Blog - Developer Portfolio",
  description:
    "Technical articles, tutorials, and insights about web development, design patterns, and industry trends.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <BlogList />
      </main>
    </div>
  );
}
