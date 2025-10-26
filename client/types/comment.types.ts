export interface CommentType {
  id: number;
  blogId: number;
  userId: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  parentId: number | null;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  replies: CommentType[];
}



export interface CommentSectionProps {
  blogId: number;
  comments: CommentType[];
}

export interface CommentFormData {
  name: string;
  email: string;
  content: string;
}
