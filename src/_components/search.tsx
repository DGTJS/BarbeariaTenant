"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { Form, FormField, FormItem, FormControl } from "./ui/form";

const formSchema = z.object({
  search: z.string().trim().min(1, { message: "Digite algo para pesquisar" }),
});

const Search = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const router = useRouter();

  const handleSubmit = (data: { search: string }) => {
    router.push(`/search?search=${data.search}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full gap-2"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="O que você quer fazer hoje?" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">
          <SearchIcon className="text-white" />
        </Button>
      </form>
    </Form>
  );
};

export default Search;
