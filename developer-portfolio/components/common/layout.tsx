"use client";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { usePathname } from "next/navigation";
const pathsNotToShowHeaders = ["/auth", "/admin"];

function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const showSection = !pathsNotToShowHeaders.some((currentPath) =>
    pathName.startsWith(currentPath)
  );

  return (
    <div className="min-h-screen">
      {showSection && <Navigation />}
      <main>
        {children}
        {showSection && <Footer />}
      </main>
    </div>
  );
}

export default CommonLayout;
