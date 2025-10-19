import SideBarButton from "./sidebar-button";
import { CardContent, Card } from "./ui/card";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  IconUrl: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
}

interface HeaderProps {
  categories: Category[];
  onAppointmentsClick?: () => void;
}

const Header = ({ categories, onAppointmentsClick }: HeaderProps) => {
  return (
    <Card className="text-gray-800">
      <CardContent className="flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Logo" width={120} height={120} />
        </Link>
        <SideBarButton category={categories} onAppointmentsClick={onAppointmentsClick} />
      </CardContent>
    </Card>
  );
};

export default Header;
