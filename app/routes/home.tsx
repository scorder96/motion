import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Motion" }, { name: "description", content: "Collaborative Notes!" }];
}

export default function Home() {
  return <>Motion</>;
}
