import { Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import { RoomScreen } from "./RoomScreen";

export default function RoomPage({ params }: PageProps<"/room/[id]">) {
  return (
    <Suspense
      fallback={
        <Center h="100dvh">
          <Loader size="sm" />
        </Center>
      }
    >
      <RoomScreen params={params} />
    </Suspense>
  );
}
