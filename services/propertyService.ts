import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NOTIFICATION_TYPES } from "@/constants/notifications";
import { createNotification } from "@/services/notificationService";

export const approveProperty = async (id: string) => {
  const ref = doc(db,"properties", id);

  await updateDoc(ref, {
    status: "approved",
  });

  try {
    const propertySnap = await getDoc(ref);

    if (propertySnap.exists()) {
      const property = propertySnap.data();
      const ownerId = property.ownerId;

      if (typeof ownerId === "string" && ownerId.length > 0) {
        await createNotification({
          receiverId: ownerId,
          title: "Property approved",
          message: `${property.title ?? "Your property"} has been approved and is now visible.`,
          type: NOTIFICATION_TYPES.PROPERTY_APPROVED,
          relatedId: id,
        });
      }
    }
  } catch (notificationError) {
    console.log("PROPERTY APPROVAL NOTIFICATION ERROR:", notificationError);
  }
};

export const rejectProperty = async (id: string) => {
  const ref = doc(db, "properties", id);

  await updateDoc(ref, {
    status: "rejected",
  });
};
