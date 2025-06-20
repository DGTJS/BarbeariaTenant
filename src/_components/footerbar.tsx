"use client";

const FooterBar = () => {
  return (
    <footer className="flex h-24 w-full items-center justify-center border-t p-4">
      <p className="text-sm">
        © {new Date().getFullYear()} Desenvolvido por Diego Martins
      </p>
    </footer>
  );
};

export default FooterBar;
