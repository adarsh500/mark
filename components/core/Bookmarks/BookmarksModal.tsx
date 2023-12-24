'use client';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiXMark } from 'react-icons/hi2';
import * as z from 'zod';

//TODO:
// 1. add fav option to bookmark
// 2. add import option

const formSchema = z.object({
  collection: z.string().optional(),
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
  tags: z.array(z.string()).optional(),
});

const BookmarksModal = (props: any) => {
  const { toast } = useToast();
  const { trigger, userId } = props;
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [file, setFile] = useState<File>();

  const { mutate: createBookmark, isLoading } = useMutation(
    async (inputs: any) => {
      const { collection = '', url = '' } = inputs;

      try {
        const data = await fetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            user_id: userId,
            collection_id: collection,
            tags,
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

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (key === ',' && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput('');
    }

    if (key === 'Backspace' && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const { data } = useQuery({
    queryKey: ['collections-flatlist'],
    queryFn: () =>
      fetch(`/api/collections/${userId}?type=flat`).then((res) => res.json()),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, reset } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createBookmark(values);
    reset();
  };

  const uploadFile = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);
      console.log('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <Tabs defaultValue="account">
          <TabsList className="w-full mt-2">
            <TabsTrigger value="account" className="w-full">
              Create
            </TabsTrigger>
            <TabsTrigger value="password" className="w-full">
              Import
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <>
              <DialogHeader className="mt-4">
                <DialogTitle>Add a new bookmark</DialogTitle>
                <DialogDescription>
                  Create a new bookmark or import an existing one.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 mt-4"
                >
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
                          <FormLabel>Collection</FormLabel>

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
                                <SelectItem
                                  value={collection._id}
                                  key={collection?._id}
                                >
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

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>

                          {!!tags.length && (
                            <div className="flex flex-wrap gap-2">
                              {tags?.map((tag, index) => (
                                <Badge
                                  key={index}
                                  onClick={() => deleteTag(index)}
                                  className="gap-2"
                                >
                                  # {tag}
                                  <HiXMark />
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Input
                            className="mt-[-6px]"
                            placeholder="comma seperated tags"
                            onKeyDown={onKeyDown}
                            onChange={onChange}
                            onKeyUp={onKeyUp}
                            value={input}
                          />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <div className="flex justify-start gap-3">
                    <Button type="submit" disabled={isLoading}>
                      Submit
                    </Button>
                    <Button variant="secondary">Cancel</Button>
                  </div>
                </form>
              </Form>
            </>
          </TabsContent>
          <TabsContent value="password">
            {' '}
            <>
              <DialogHeader className="mt-4">
                <DialogTitle>Import your bookmark</DialogTitle>
                <DialogDescription>
                  Import bookmarks from your browser.
                </DialogDescription>
              </DialogHeader>
              <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                <Input
                  id="picture"
                  type="file"
                  onChange={(e) => {
                    console.log('tar', e.target);
                    setFile(e.target.files?.[0]);
                  }}
                />
              </div>
              <div className="flex justify-start gap-3 mt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={(e) => uploadFile(e)}
                >
                  Submit
                </Button>
                <Button variant="secondary">Cancel</Button>
              </div>
            </>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default memo(BookmarksModal);
