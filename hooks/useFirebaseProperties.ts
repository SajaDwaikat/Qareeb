import { useEffect, useState } from "react";
import {collection,query,where,orderBy,onSnapshot,} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useFirebaseProperties(
  type?: string
) {

  const [properties, setProperties] =useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let q;
    if (type === "top") {

      q = query(collection(db, "properties"),

        where("rating", ">=", 4.5),
        orderBy("rating", "desc")
      );

    } else if (
      type &&type !== "All"
    ) {

      q = query(collection(db, "properties"),

        where("type","==",type.toLowerCase()
        )
      );

    } else {

      q = collection( db, "properties"
      );
    }

    const unsubscribe = onSnapshot( q,

        (snapshot) => {
          const data =
            snapshot.docs.map(
              (doc) => ({ id: doc.id,
                ...doc.data(),
              })
            );

          setProperties(data);
          setLoading(false);
        },

        (error) => {
          console.log( "Realtime error:",
            error
          );

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, [type]);

  return {
    properties,
    loading,
  };
}