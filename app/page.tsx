"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./blink.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { logins } from "@/components/login/server/action";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const login = async () => {
    if (!isMounted) return;

    // const url = "http://192.168.1.2/GaisanoCarmen/app/api/login.php";
    // const jsonData = { username, password, role };

    try {
      // const response = await axios.post(
      //   url,
      //   new URLSearchParams({
      //     json: JSON.stringify(jsonData),
      //     operation: "login",
      //   })
      // );

      logins(username, password, role).then((data) => {
        if (data) {
          alert("Invalid username, password, or role!");
        } else {
          alert("Successfully login.");
          setTimeout(() => {
            window.location.reload();
          }, 1500); // 1500 milliseconds = 1.5 seconds
        }
        console.log(login);
      });

      // if (response.data.length > 0) {
      //   const cashierInfo = response.data[0];
      //   // Store cashier info in session storage
      //   sessionStorage.setItem("cashier", JSON.stringify(cashierInfo));

      //   if (role === "Admin") {
      //     router.push("/admin");
      //   } else if (role === "Cashier") {
      //     router.push("/grocery");
      //   }
      // } else {
      //   alert("Invalid username, password, or role!");
      // }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 h-screen background-cons flex items-start justify-start">
      <Card className="w-full max-w-md h-[450px] sm:h-[450px] md:h-[450px] border-2 border-green-500 mt-40 ml-20">
        <CardHeader className="text-center">
          {/* <CardTitle className="font-bold text-xl">Login</CardTitle> */}
        </CardHeader>
        <div className="flex justify-center items-center mb-4 animate-pulse">
          <img src="/ayal.png" alt="Logo" className="w-2/3 h-auto" />
        </div>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setRole(value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="default" className="w-full" onClick={login}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
