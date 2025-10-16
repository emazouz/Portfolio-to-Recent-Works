import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/footer";
import TopNavBar from "@/components/shared/top-navbar";

export default function LayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
