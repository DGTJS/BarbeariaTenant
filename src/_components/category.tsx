import { Button } from "./ui/button";

interface CategorySearchProps {
  name: string;
  IconUrl: string;
}

const Category = ({ name, IconUrl }: CategorySearchProps) => {
  return (
    <Button variant="outline" className="columns h-[50px] justify-center">
      <img src={IconUrl} alt="Logo" width={16} height={16} />
      <span className="justify-center text-center text-sm">{name}</span>
    </Button>
  );
};

export default Category;
