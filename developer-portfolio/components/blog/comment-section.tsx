"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Reply, Send, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CommentType } from "@/types/CommentType";
import { commentStore } from "@/store/commentStore";

interface CommentSectionProps {
  blogId: number;
  comments: CommentType[];
}

interface CommentFormData {
  name: string;
  email: string;
  content: string;
}

export function CommentSection({ blogId, comments = [] }: CommentSectionProps) {
  const { currentLanguage, t } = useTranslation();
  const [newComment, setNewComment] = useState<CommentFormData>({
    name: "",
    email: "",
    content: "",
  });
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [isReply, setIsReply] = useState(false);
  const { addComment, isLoading, errorMsg, successMsg } = commentStore();
  const formRef = useRef<HTMLFormElement>(null);
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    // Validation
    if (
      !newComment.name.trim() ||
      !newComment.email.trim() ||
      !newComment.content.trim()
    ) {
      toast({
        title: t("Error", "common.error"),
        description: t("Please fill in all fields", "validation.fillAllFields"),
        variant: "error",
      });
      return;
    }

    if (!validateEmail(newComment.email)) {
      toast({
        title: t("Error", "common.error"),
        description: t("Please enter a valid email", "validation.invalidEmail"),
        variant: "error",
      });
      return;
    }

    try {
      const ok = await addComment({
        ...newComment,
        blogId,
        parentId: replyTo || null,
      });

      if (!ok) {
        toast({
          title: t("Error", "common.error"),
          description: t(errorMsg as string, "comment.submitError"),
          variant: "error",
        });
      }

      toast({
        title: t("Success", "common.success"),
        description: t(successMsg as string, "comment.submitSuccess"),
      });

      setNewComment({ name: "", email: "", content: "" });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: t("Error", "common.error"),
        description:
          error instanceof Error
            ? error.message
            : t("Failed to submit comment", "comment.submitError"),
        variant: "error",
      });
    }
  };

  const formatDate = (date: string | Date): string => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString(
        currentLanguage === "ar" ? "ar-SA" : "en-US",
        { year: "numeric", month: "short", day: "numeric" }
      );
    } catch {
      return date.toString();
    }
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: CommentType;
    isReply?: boolean;
  }) => (
    <div
      className={`${
        isReply ? "ml-8 mt-4 border-l-2 border-muted pl-4" : "mb-6"
      }`}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            {comment.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-medium text-sm">{comment.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
              {!comment.approved && (
                <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">
                  {t("Pending approval", "comment.pending")}
                </span>
              )}
            </div>
            <p className="text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {!isReply && comment.approved && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsReply(true);
                  setReplyTo(comment.id);
                }}
                className="text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                {currentLanguage === "ar" ? "رد" : "Reply"}
              </Button>
            </div>
          )}

          {/* Render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies
                .filter((reply) => reply.approved)
                .map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Filter only approved top-level comments
  const approvedComments = comments.filter(
    (comment) => comment.approved && !comment.parentId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {currentLanguage === "ar" ? "التعليقات" : "Comments"} (
          {approvedComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Comment Form */}
        <form ref={formRef} onSubmit={handleSubmitComment} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {currentLanguage === "ar" ? "أضف تعليقاً" : "Add a Comment"}
          </h3>

          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {currentLanguage === "ar"
                ? "سيتم نشر تعليقك بعد الموافقة عليه من قبل المشرف."
                : "Your comment will be published after approval by the moderator."}
            </AlertDescription>
          </Alert>

          <div>
            {isReply && replyTo ? (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Send className="h-3 w-3 mt-2 text-gray-600" />
                  <span className="text-sm font-medium">
                    {currentLanguage === "ar"
                      ? "الرد على التعليق"
                      : "Replying to comment"}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-xs hover:text-red-600 transition-colors"
                  onClick={() => setIsReply(false)}
                >
                  <Reply className="h-3 w-3" />
                  <span>
                    {currentLanguage === "ar" ? "إلغاء الرد" : "Cancel Reply"}
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center mb-2 gap-3">
                <Send className="h-3 w-3 mr-t text-gray-600" />
                <span className="text-sm font-medium">
                  {currentLanguage === "ar"
                    ? "إضافة تعليق جديد"
                    : "Add a new comment"}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder={currentLanguage === "ar" ? "الاسم" : "Name"}
              value={newComment.name}
              onChange={(e) =>
                setNewComment({ ...newComment, name: e.target.value })
              }
              required
              disabled={isLoading}
            />
            <Input
              type="email"
              placeholder={
                currentLanguage === "ar" ? "البريد الإلكتروني" : "Email"
              }
              value={newComment.email}
              onChange={(e) =>
                setNewComment({ ...newComment, email: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>
          <Textarea
            placeholder={
              currentLanguage === "ar"
                ? "اكتب تعليقك..."
                : "Write your comment..."
            }
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            className="mb-4"
            rows={4}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            {isLoading
              ? currentLanguage === "ar"
                ? "جاري الإرسال..."
                : "Posting..."
              : currentLanguage === "ar"
              ? "إرسال التعليق"
              : "Post Comment"}
          </Button>
        </form>

        {/* Comments List */}
        <div>
          {approvedComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {currentLanguage === "ar"
                  ? "لا توجد تعليقات بعد. كن أول من يعلق!"
                  : "No comments yet. Be the first to comment!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
