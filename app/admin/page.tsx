"use client";

import Charts from "@/components/chart/charts";
import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { signOut } from "next-auth/react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-green-100">
      <aside className="w-64 bg-green-900 text-white">
        <div className="p-4">
          <img src="/ayal.png" alt="" width={350} height={350} />
          <ul className="mt-8">
            <li className="p-2 hover:bg-green-200 rounded-lg text-black font-bold text-lg">
              Dashboard
            </li>
            <li className="p-2 hover:bg-green-200 rounded-lg text-black font-bold text-lg">
              <Link href="/product">Add Products</Link>
            </li>
            <li className="p-2 hover:bg-green-200 rounded-lg text-black font-bold text-lg">
              Tables
            </li>
            <li className="p-2 hover:bg-green-200 rounded-lg text-black font-bold text-lg">
              <Button
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white shadow p-4 rounded-lg">
            <h3 className="text-lg font-semibold">8,282</h3>
            <p className="text-gray-500">New Users</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h3 className="text-lg font-semibold">200,521</h3>
            <p className="text-gray-500">Total Orders</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h3 className="text-lg font-semibold">215,542</h3>
            <p className="text-gray-500">Available Products</p>
          </div>
        </div>
        <div className="mt-10">
          <Charts></Charts>
        </div>
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          {/* <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="py-2">Name</th>
                <th className="py-2">Title</th>
                <th className="py-2">Status</th>
                <th className="py-2">Role</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array(6)
                .fill()
                .map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">Joemari Obrial</td>
                    <td className="py-2">Software Engineer</td>
                    <td className="py-2 text-green-500">Active</td>
                    <td className="py-2">Owner</td>
                    <td className="py-2 text-blue-500">Edit</td>
                  </tr>
                ))}
            </tbody>
          </table> */}
        </div>
      </main>
    </div>
  );
}
