import React from "react";
import { Form, Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/signup";

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  let password = formData.get("password");

  const res = fetch("https://motion-worker.scorder96.workers.dev/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, email: email, password: password }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
  return redirect("/dashboard");
}

export default function signup() {
  return (
    <div>
      <h2 className="text-2xl">Sign up for an account</h2>
      <p className="text-sm opacity-50 mb-4">Enter your details below</p>
      <Form method="post">
        <Input placeholder="Full name" type="text" name="name" className="mb-2 w-3/4" />
        <Input placeholder="Email" type="email" name="email" className="mb-2 w-3/4" />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          className="mb-4 w-3/4"
        />
        <div className="flex justify-between items-end w-3/4">
          <Link to={"/login"} className="text-sm opacity-50 hover:underline">
            Already have an account?
          </Link>
          <Button>Continue</Button>
        </div>
      </Form>
    </div>
  );
}
