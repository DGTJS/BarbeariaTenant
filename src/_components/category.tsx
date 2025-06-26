import Link from "next/link";
import { Button } from "./ui/button";

interface CategorySearchProps {
  name: string;
  IconUrl: string;
  id: string;
}

const Category = ({ id, name, IconUrl }: CategorySearchProps) => {
  return (
    <Link href={`/search?category=${id}`}>
      <Button variant="outline" className="columns h-[50px] justify-center w-full">
        <img src={IconUrl} alt="Logo" width={15} height={15} />
        <span className="justify-center text-center text-xs">{name}</span>
      </Button>
    </Link>
  );
};

export default Category;
