import React from "react";
import { Form, Link, redirect, useActionData } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/login";
import { Camera, Check, TriangleAlertIcon } from "lucide-react";

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  const res = await fetch("https://motion-worker.scorder96.workers.dev/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });
  if (res.ok) {
    return redirect("/dashboard");
  } else {
    const error = await res.text();
    return error;
  }
}

export default function login({ actionData }: Route.ComponentProps) {
  return (
    <div>
      <h2 className="text-2xl">Sign in to your account</h2>
      <p className="text-sm opacity-50 mb-4">Enter your details below</p>
      <Form method="post">
        <Input placeholder="Email" type="email" name="email" className="mb-2 w-3/4" />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          className="mb-4 w-3/4"
        />
        <div className="flex justify-between items-end w-3/4">
          <Link to={"/signup"} className="text-sm opacity-50 hover:underline">
            No account? Register here.
          </Link>
          <Button>Continue</Button>
        </div>
      </Form>

      {actionData && (
        <div className="flex items-center mt-4 text-red-400">
          <TriangleAlertIcon size={20} />
          &nbsp;
          <p>{actionData}</p>
        </div>
      )}
    </div>
  );
}
