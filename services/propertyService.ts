import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const approveProperty = async (id: string) => {
  const ref = doc(db,"properties", id);

  await updateDoc(ref, {
    status: "approved",
  });
};

export const rejectProperty = async (id: string) => {
  const ref = doc(db, "properties", id);

  await updateDoc(ref, {
    status: "rejected",
  });
};