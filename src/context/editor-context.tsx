"use client";
import { DataState, PatchState } from "@/types/editor-type";
import { createContext, useState } from "react";

type PostProviderProps = {
  children: React.ReactNode;
};

export const initialDataState: DataState = {
  selectedBlockId: null,
  children: [],
};

const initialPatchState: PatchState = {
  past: [],
  present: initialDataState,
  future: [],
};

const EditorContext = createContext({
  patch: {} as PatchState,
  data: {} as DataState,
  setData: (data: DataState) => {},
  handleSelectBlock: (id: string) => {},
  handleUndo: () => {},
  handleRedo: () => {},
  handleUpdatePatch: (payload: DataState) => {},
});

const EditorProvider: React.FC<PostProviderProps> = ({
  children,
}: PostProviderProps) => {
  const [data, setData] = useState<DataState>(initialDataState);

  const [patch, setPatch] = useState<PatchState>(initialPatchState);

  const handleSelectBlock = (id: string) => {
    setData({ ...data, selectedBlockId: id });
  };

  const handleUpdatePatch = (payload: DataState) => {
    setPatch({
      past: [patch.present, ...patch.past],
      present: payload,
      future: [],
    });
  };

  const handleUndo = () => {
    if (patch.past?.length > 0) {
      const past = patch.past.slice(0, 1);

      setPatch({
        present: past[0],
        past: patch.past.slice(1),
        future: [patch.present, ...patch.future],
      });
      setData(past[0]);
    }
  };

  const handleRedo = () => {
    if (patch.future?.length > 0) {
      const future = patch.future.slice(0, 1);

      setPatch({
        ...patch,
        present: future[0],
        past: [patch.present, ...patch.past],
        future: patch.future.slice(1),
      });
      setData(future[0]);
    }
  };

  const values = {
    data,
    setData,
    handleSelectBlock,
    patch,
    handleUndo,
    handleRedo,
    handleUpdatePatch,
  };

  return (
    <EditorContext.Provider value={{ ...values }}>
      {children}
    </EditorContext.Provider>
  );
};
export { EditorContext, EditorProvider };
