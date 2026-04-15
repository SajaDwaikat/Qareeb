import { router } from "expo-router";

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(auth)/user-type" />;
}