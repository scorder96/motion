import React from "react";
import DocumentCard from "~/components/documentCard";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/dashboard";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const res = await fetch("https://motion-worker.scorder96.workers.dev/get-user", {
    method: "GET",
    credentials: "include",
    mode: "no-cors",
  });
  return res;
}

export default function dashboard({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);

  return (
    <div className="h-dvh px-16">
      <h1 className="text-2xl pt-16">Welcome, firstName</h1>
      <Input className="mt-8" />
      <div className="grid grid-cols-4 gap-4 mt-8">
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
        <DocumentCard />
      </div>
    </div>
  );
}
