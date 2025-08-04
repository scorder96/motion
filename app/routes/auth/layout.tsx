import React from "react";
import { Outlet } from "react-router";

export default function layout() {
  return (
    <div className="grid grid-cols-2 h-dvh">
      <div className="flex flex-col justify-between p-4">
        <h1 className="text-2xl">Motion</h1>
        <img src="undraw_collaborative-writing.svg" alt="" className="h-1/2 opacity-20" />
        <p>Motion is the best collaborative note-taking platform on the planet.</p>
      </div>
      <div className="flex flex-col justify-center px-16 dark:bg-neutral-900">
        <Outlet />
      </div>
    </div>
  );
}
