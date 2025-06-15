import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { CardContent, Card } from "./ui/card";
import Image from "next/image";

const Header = () => {
  return (
    <Card className="text-gray-800">
      <CardContent className="flex items-center justify-between">
        <Image src="/logo.png" alt="Logo" width={120} height={120} />
        <Button
          size="icon"
          variant="outline"
          className="border-none hover:bg-gray-700"
        >
          <MenuIcon className="h-10 w-10 text-white" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Header;
