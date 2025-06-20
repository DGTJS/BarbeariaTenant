import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarImage } from "./ui/avatar";
import { MenuIcon, Calendar, HomeIcon } from "lucide-react";

interface CategoryProps {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  IconUrl: string;
}

interface SideBarButtonProps {
  category: CategoryProps[];
}

const SideBarButton = ({ category }: SideBarButtonProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="border-none hover:bg-gray-700"
        >
          <MenuIcon className="h-10 w-10 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="px-5 pt-5 text-left">Menu</SheetTitle>
        <SheetHeader className="p-4 text-left">
          <div className="flex flex-row items-center gap-3 border-b border-solid border-gray-700 pb-5">
            <Avatar>
              <AvatarImage
                src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Avatar"
                width={100}
                height={100}
                className="rounded-2xl border-2 border-solid border-purple-500 object-cover"
              />
            </Avatar>{" "}
            <div className="flex flex-col text-start">
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-xs text-gray-400">teste@gmail.com</p>
            </div>
          </div>
        </SheetHeader>
        <div className="mx-5 flex flex-col gap-2 border-b border-solid border-gray-700 pb-5">
          <Button variant="default" className="flex justify-start gap-2">
            <HomeIcon className="h-6 w-6 text-white" />
            <p className="text-sm text-white">Ínicio</p>
          </Button>
          <Button variant="ghost" className="flex justify-start gap-2">
            <Calendar className="h-6 w-6" />
            <p className="text-sm">Agendamentos</p>
          </Button>
        </div>
        <div className="mx-5 flex flex-col gap-4 py-2 text-left">
          {category.map((item) => (
            <Button
              variant="ghost"
              key={item.id}
              className="flex items-center justify-start gap-3 py-3"
            >
              <img src={item.IconUrl} alt="Logo" />
              <p className="text-sm">{item.name}</p>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideBarButton;
