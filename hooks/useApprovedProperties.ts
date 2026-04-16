import useFirebaseProperties from "./useFirebaseProperties";

export default function useApprovedProperties() {
  const { properties, loading } = useFirebaseProperties();

  const approved = properties.filter(
    (property) => property.status === "approved"
  );

  return { properties: approved, loading };
}