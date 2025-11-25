import type { Route } from "./+types/swinemeeper";
import { SwineMeeperComponent } from "../swinemeeper/SwineMeeperComponent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SwineMeeper App" },
    { name: "description", content: "Welcome to SwineMeeper!" },
  ];
}

export default function Home() {
  return <SwineMeeperComponent />;
}
