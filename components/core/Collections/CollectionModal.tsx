'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  collection: z
    .string()
    .min(3, {
      message: 'Collection name must be at least 2 characters.',
    })
    .max(100, {
      message: 'Collection name must be less than 100 characters.',
    }),
});

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
const Modal = (props: any) => {
  const { trigger, open, onOpenChange, parentId, createCollection } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, reset } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCollection({
      collection_name: values.collection,
      parent_id: parentId,
    });
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new collection</DialogTitle>
          <DialogDescription>
            Create a new collection to organize your bookmarks.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="collection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Productivity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
