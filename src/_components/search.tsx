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
        className="relative w-full"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="O que você quer fazer hoje?" 
                    {...field}
                    className="h-12 rounded-xl border-border/50 bg-card/50 pl-12 pr-4 text-card-foreground placeholder:text-foreground-muted backdrop-blur-sm focus:border-primary/50 focus:bg-card/80 transition-all duration-200"
                  />
                  <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button 
          type="submit"
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg bg-primary p-0 hover:bg-primary/90"
        >
          <SearchIcon className="h-4 w-4 text-primary-foreground" />
        </Button>
      </form>
    </Form>
  );
};

export default Search;
