import SideBarButton from "./sidebar-button";
import { CardContent, Card } from "./ui/card";
import Image from "next/image";
import { getCategories } from "@/_lib/getCategories";
import Link from "next/link";

const Header = async () => {
  const category = await getCategories();
  return (
    <Card className="text-gray-800">
      <CardContent className="flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Logo" width={120} height={120} />
        </Link>
        <SideBarButton category={category} />
      </CardContent>
    </Card>
  );
};

export default Header;
