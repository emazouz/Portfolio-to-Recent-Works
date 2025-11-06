// Filename: components/Logo.tsx
import Link from "next/link";

function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center hover:opacity-80 transition-opacity duration-200"
      aria-label="eMazouz Home"
    >
      <span
        className="font-bold text-2xl md:text-3xl lg:text-4xl text-primary tracking-tight"
        style={{ fontFamily: "'Pacifico', 'Brush Script MT', cursive" }}
      >
        <span className="text-secondary">e</span>
        MA<span className="text-secondary">Z</span>OU
        <span className="text-secondary">Z</span>
      </span>
      <span
        className="text-primary text-xl md:text-2xl lg:text-3xl ml-0.5"
        style={{ fontFamily: "'Pacifico', 'Brush Script MT', cursive" }}
      >
        .
      </span>
    </Link>
  );
}

export default Logo;
