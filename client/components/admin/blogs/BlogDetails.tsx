"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Heart,
  MessageCircle,
  User,
  Calendar,
  Globe,
  Clock,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { BlogParamsProps } from "@/types/BlogType";
import { getLocalizedContent, useBlogsData } from "@/hooks/blogs/useBlogsData";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NotFound from "@/components/ui/NotFound";
import { Blog } from "@/store/blogStore";
import { MarkdownContent } from "@/components/markdown/markdown-content";

export function BlogDetails({ blogId }: { blogId: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { blog, isLoading, error, getBlog, handleDeleteBlog } = useBlogsData();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (blogId) {
      getBlog(Number(blogId));
    }
  }, [blogId, getBlog]);

  const onDeleteBlog = async () => {
    await handleDeleteBlog(Number(blogId), String(blog?.title_en));
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };


  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error or not found state
  if (error || !blog) {
    return <NotFound />;
  }

  const currentLanguage = "en"; // You might want to get this from context

  const localizedContent = getLocalizedContent(blog, currentLanguage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back", "admin.form.back")}
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {blog.title_en}
            </h1>
            <p className="text-muted-foreground" dir="rtl">
              {blog.title_ar}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/blog/${blog.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              {t("View Post", "admin.blogs.viewPost")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/blogs/edit/${blogId}`}>
              <Edit className="mr-2 h-4 w-4" />
              {t("Edit", "admin.blogs.edit")}
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("Delete", "admin.blogs.delete")}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">
                {t("Overview", "admin.blogs.overview")}
              </TabsTrigger>
              <TabsTrigger value="content">
                {t("Content", "admin.blogs.content")}
              </TabsTrigger>
              <TabsTrigger value="seo">
                {t("SEO", "admin.blogs.seo")}
              </TabsTrigger>
              <TabsTrigger value="comments">
                {t("Comments", "admin.blogs.comments")}
                {blog.comments && blog.comments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {blog.comments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Blog Information", "admin.blogs.information")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Category", "admin.blogs.category")}
                      </p>
                      <Badge variant="secondary">{blog.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Author", "admin.blogs.author")}
                      </p>
                      <p className="text-sm">
                        {blog.author?.name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Status", "admin.blogs.status")}
                      </p>
                      <Badge variant={blog.published ? "default" : "secondary"}>
                        {blog.published
                          ? t("Published", "admin.blogs.published")
                          : t("Draft", "admin.blogs.draft")}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Featured", "admin.blogs.featured")}
                      </p>
                      <Badge variant={blog.featured ? "default" : "secondary"}>
                        {blog.featured
                          ? t("Yes", "admin.blogs.yes")
                          : t("No", "admin.blogs.no")}
                      </Badge>
                    </div>
                    {blog.readTime && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("Read Time", "admin.blogs.readTime")}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {blog.readTime} {t("min", "common.minutes")}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {blog.tags && blog.tags.length > 0 && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          {t("Tags", "admin.blogs.tags")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {blog.keywords && blog.keywords.length > 0 && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          {t("Keywords", "admin.blogs.keywords")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {blog.keywords.map((keyword) => (
                            <Badge key={keyword} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("Excerpts", "admin.blogs.excerpts")}
                    </p>
                    <div className="space-y-2">
                      {blog.excerpt_en && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t("English", "admin.blogs.english")}
                          </p>
                          <p className="text-sm">{blog.excerpt_en}</p>
                        </div>
                      )}
                      {blog.excerpt_ar && (
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {t("Arabic", "admin.blogs.arabic")}
                          </p>
                          <p className="text-sm" dir="rtl">
                            {blog.excerpt_ar}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Blog Content", "admin.blogs.blogContent")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("English Content", "admin.blogs.englishContent")}
                    </p>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{blog.content_en}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("Arabic Content", "admin.blogs.arabicContent")}
                    </p>
                    <div className="prose prose-sm max-w-none" dir="rtl">
                      <p className="whitespace-pre-wrap">{blog.content_ar}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("SEO Information", "admin.blogs.seoInformation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("URL Slug", "admin.blogs.urlSlug")}
                    </p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {blog.slug}
                    </p>
                  </div>

                  <Separator />

                  {(blog.metaTitle_en || blog.metaTitle_ar) && (
                    <>
                      {blog.metaTitle_en && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {t(
                              "Meta Title (English)",
                              "admin.blogs.metaTitleEn"
                            )}
                          </p>
                          <p className="text-sm">{blog.metaTitle_en}</p>
                        </div>
                      )}
                      {blog.metaTitle_ar && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {t(
                              "Meta Title (Arabic)",
                              "admin.blogs.metaTitleAr"
                            )}
                          </p>
                          <p className="text-sm" dir="rtl">
                            {blog.metaTitle_ar}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <Separator className="my-12" />
                  <div className="text-lg leading-relaxed">
                    {localizedContent.metaDesc && (
                      <div className="prose prose-lg max-w-none py-4 md:py-6">
                        <MarkdownContent content={localizedContent.metaDesc} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Comments Management", "admin.blogs.commentsManagement")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Manage comments for this blog post",
                      "admin.blogs.commentsDescription"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {blog.comments && blog.comments.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>
                              {t("Author", "admin.blogs.commentAuthor")}
                            </TableHead>
                            <TableHead>
                              {t("Comment", "admin.blogs.comment")}
                            </TableHead>
                            <TableHead>
                              {t("Status", "admin.blogs.commentStatus")}
                            </TableHead>
                            <TableHead>
                              {t("Date", "admin.blogs.commentDate")}
                            </TableHead>
                            <TableHead className="text-right">
                              {t("Actions", "admin.blogs.commentActions")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* {blog.comments.map((comment) => (
                            <TableRow key={comment.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {comment.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {comment.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm max-w-xs truncate">
                                  {comment.content}
                                </p>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    comment.approved ? "default" : "secondary"
                                  }
                                >
                                  {comment.approved ? (
                                    <>
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      {t("Approved", "admin.blogs.approved")}
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="mr-1 h-3 w-3" />
                                      {t("Pending", "admin.blogs.pending")}
                                    </>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {formatDate(comment.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {!comment.approved && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleCommentAction(
                                          comment.id,
                                          "approve"
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCommentAction(comment.id, "delete")
                                    }
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))} */}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {t("No comments yet", "admin.blogs.noComments")}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Featured Image", "admin.blogs.featuredImage")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={blog.imageUrl || "/placeholder.svg"}
                alt={blog.title_en}
                width={400}
                height={300}
                className="w-full rounded-lg border object-cover"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Engagement", "admin.blogs.engagement")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("Views", "admin.blogs.views")}
                  </span>
                </div>
                <Badge variant="secondary">
                  {blog.views?.toLocaleString() || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("Likes", "admin.blogs.likes")}
                  </span>
                </div>
                <Badge variant="secondary">{blog.likes || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("Comments", "admin.blogs.comments")}
                  </span>
                </div>
                <Badge variant="secondary">{blog.comments?.length || 0}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("Publication", "admin.blogs.publication")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Author", "admin.blogs.author")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {blog.author?.name || "Unknown"}
                  </p>
                </div>
              </div>
              {blog.publishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {t("Published", "admin.blogs.published")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(String(blog?.publishDate))}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Last Updated", "admin.blogs.lastUpdated")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(String(blog?.updatedAt))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Actions", "admin.blogs.actions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/blog/${blog.slug}`} target="_blank">
                  <Globe className="mr-2 h-4 w-4" />
                  {t("View Live Post", "admin.blogs.viewLivePost")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("Are you sure?", "common.areYouSure")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "This action cannot be undone. This will permanently delete the blog post and all associated comments.",
                "admin.blogs.deleteWarning"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {t("Cancel", "common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteBlog}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading
                ? t("Deleting...", "admin.blogs.deleting")
                : t("Delete", "admin.blogs.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
