"use client";

import { Button } from "./ui/button";
import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
// import { Avatar, AvatarImage } from "./ui/avatar";
import { MenuIcon, Calendar, HomeIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";

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
  const { data } = useSession();
  const handleLoginGoogleClick = () => signIn("google");
  const handleLogoutClick = () => signOut();


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="cursor-pointer border-none hover:bg-gray-700"
        >
          <MenuIcon className="h-10 w-10 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-background border-border">
        <SheetTitle className="mx-5 pt-5 pl-3 text-left text-2xl">
          Menu
        </SheetTitle>
        <SheetHeader className="mx-4 border-b border-solid border-gray-700 pb-8 text-left">
          {data?.user === undefined && (
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Olá Faça seu login!
              </h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="cursor-pointer">
                    <LogOutIcon className="text-white" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      Faça login
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="text-center">
                    Faça login para acessar sua conta
                  </DialogDescription>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={handleLoginGoogleClick}
                    >
                      <Image
                        src="/IconGoogle.svg"
                        alt="Fazer login com Google"
                        width={20}
                        height={20}
                      />
                      Google
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {data?.user && (
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={data?.user?.image ?? ""}
                  alt="Avatar"
                  className="rounded-2xl border-3 border-solid border-purple-500 object-cover"
                />
              </Avatar>{" "}
              <div className="flex flex-col text-start">
                <p className="text-sm font-bold">{data?.user?.name}</p>
                <p className="text-xs text-gray-400">{data?.user?.email}</p>
              </div>
            </div>
          )}
        </SheetHeader>
        <div className="mx-5 flex flex-col gap-2 border-b border-solid border-gray-700 pb-5">
          <Button
            variant="ghost"
            className="flex cursor-pointer justify-start gap-2"
            asChild
          >
            <Link href="/">
              <HomeIcon className="text-white" width={15} height={15} />
              <p className="text-sm font-normal text-white">Ínicio</p>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="flex cursor-pointer justify-start gap-2"
          >
            <Calendar className="text-white" width={15} height={15} />
            <p className="text-sm font-normal">Agendamentos</p>
          </Button>
        </div>
        <div className="mx-5 flex flex-col gap-4 border-b border-solid border-gray-700 py-5 text-left">
          {category.map((item) => (
            <Button
              variant="ghost"
              key={item.id}
              className="flex cursor-pointer items-center justify-start gap-3 py-3 font-normal"
              asChild
            >
              <Link href={`/search?category=${item.id}`}>
                <img src={item.IconUrl} alt="Logo" width={15} height={15} />
                <p className="text-sm">{item.name}</p>
              </Link>
            </Button>
          ))}
        </div>
        <div className="mx-5 flex flex-col gap-4 px-2 py-2 text-left">
          <Button
            variant="ghost"
            className="flex cursor-pointer items-center justify-start gap-3"
            onClick={handleLogoutClick}
          >
            <LogOutIcon width={15} height={15} />
            <p className="text-sm font-normal">Sair da conta</p>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideBarButton;
