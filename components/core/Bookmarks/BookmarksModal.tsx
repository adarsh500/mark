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
import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  collection: z.string().optional(),
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
});

const BookmarksModal = (props: any) => {
  const { toast } = useToast();
  const { trigger, userId } = props;

  const { mutate: createBookmark } = useMutation(
    async (inputs: any) => {
      const { collection = '', url = '' } = inputs;
      console.log('inputs', inputs);

      try {
        const data = await fetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            collection_id: collection,
            url,
          }),
        });
        if (data.ok) {
          return data.json();
        } else {
          throw new Error();
        }
      } catch (err) {
        throw err.response;
      }
    },
    {
      onSuccess: () => {
        toast({ description: 'Bookmark created successfully' });
        // refetchCollections();
      },
      onError: (err) => {
        console.log(err);
        toast({
          variant: 'destructive',
          title: 'Failed to create bookmark',
          description: 'shit',
        });
      },
    }
  );

  const { data } = useQuery({
    queryKey: ['collections-flatlist'],
    queryFn: () =>
      fetch(`/api/collections/${userId}?type=flat`).then((res) => res.json()),
    enabled: !!userId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, reset } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createBookmark(values);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new bookmark</DialogTitle>
          <DialogDescription>
            Create a new bookmark or import an existing one.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collection"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Collection Name</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Devtools" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent {...field}>
                        {data?.map((collection: any) => (
                          <SelectItem value={collection._id}>
                            {collection.collection_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(BookmarksModal);
