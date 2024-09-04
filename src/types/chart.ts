// types.ts

export type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export type CopyButtonProps = {
  text: string;
};

export type AIChatComponentProps = {};

export type CustomComponentsType = {
  [key: string]: React.ComponentType<any>;
};

export type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
};
