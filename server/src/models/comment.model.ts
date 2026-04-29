import mongoose, { Document, Model, Schema } from "mongoose";

interface IReplySchema extends Document {
  author: mongoose.Types.ObjectId;
  comment: string;
  createdAt?: Date;
}

interface ICommentSchema extends Document {
  author: mongoose.Types.ObjectId;
  comment: string;
  replies: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  animeId: string;
  toggleLike(userId: string): void;
  isSpoiler: boolean;
}

const replySchema = new mongoose.Schema<IReplySchema>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentSchema = new Schema<ICommentSchema>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    isSpoiler: {
      type: Boolean,
      default: false
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
    animeId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

CommentSchema.methods.toggleLike = function (userId: string): void {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const index = this.likes.findIndex((id: mongoose.Types.ObjectId) =>
    id.equals(userObjectId)
  );

  if (index === -1) {
    this.likes.push(userObjectId);
  } else {
    this.likes.splice(index, 1);
  }
};

const Reply: Model<IReplySchema> = mongoose.model<IReplySchema>(
  "Reply",
  replySchema
);

const Comment: Model<ICommentSchema> = mongoose.model<ICommentSchema>(
  "Comment",
  CommentSchema
);

export { Comment, Reply };
