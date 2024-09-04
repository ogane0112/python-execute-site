// types.ts

import { MutableRefObject } from "react";

export type EditorRefType = MutableRefObject<{
  getValue: () => string;
} | null>;

export type MonacoType = {
  editor: {
    defineTheme: (name: string, theme: any) => void;
    setTheme: (name: string) => void;
  };
};

export type EditorType = {
  getValue: () => string;
};

export type HandleEditorDidMountType = (
  editor: EditorType,
  monaco: MonacoType,
) => void;

export interface HomeProps {}
