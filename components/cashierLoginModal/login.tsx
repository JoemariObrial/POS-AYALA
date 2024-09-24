import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

import { useToast } from "@/components/ui/use-toast";

interface Cashier {
  id: number;
  c_name: string;
}

export default function CashierLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: any) {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [cashierId, setCashierId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { toast } = useToast();

  const selectRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost/GaisanoCarmen/app/api/cashiers.php")
      .then((response) => response.json())
      .then((data) => setCashiers(data))
      .catch((error) => {
        console.error("Failed to fetch cashiers:", error);
        setError("Failed to load cashiers");
      });
  }, []);

  useEffect(() => {
    selectRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "F1":
          selectRef.current?.click();
          break;
        case "F2":
          inputRef.current?.focus();
          break;
        case "Enter":
          if (event.shiftKey) {
            handleLogin();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const formData = new FormData();

      const data = {
        cashierId: parseInt(cashierId),
        password: password,
      };

      formData.append("json", JSON.stringify(data));
      formData.append("operation", "login");

      axios({
        url: "http://localhost/GaisanoCarmen/app/api/login.php",
        method: "post",
        data: formData,
      }).then((response) => {
        console.log(response);
        if (!response.data) {
          throw new Error("Network response was not ok");
        }
        if (response.data.success) {
          onLoginSuccess({
            id: parseInt(cashierId),
            name: response.data.cashier.c_name,
          });
          setCashierId("");
          setPassword("");
          onClose();
        } else {
          toast({
            variant: "destructive",
            title: response.data.message,
          });
          // setError(response.data.message);
        }
      });
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-primary  bg-green-500 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-yellow-400">
            Login as Cashier
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <Label className="font-medium text-yellow-400">Cashier</Label>
          <Select value={cashierId} onValueChange={setCashierId}>
            <SelectTrigger ref={selectRef} className="border p-2 rounded-md">
              <SelectValue
                placeholder="Select Cashier"
                className="font-medium text-yellow-400"
              ></SelectValue>
            </SelectTrigger>
            <SelectContent
              ref={selectContentRef}
              className="mt-2 border rounded-md shadow-lg"
            >
              {cashiers.map((cashier) => (
                <SelectItem
                  key={cashier.id}
                  value={cashier.id.toString()}
                  data-value={cashier.id.toString()}
                  className="p-2 hover:bg-gray-100"
                >
                  {cashier.c_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label className="font-medium text-yellow-400">Password</Label>
          <Input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 rounded-md "
          />
          <Button
            className="mt-6 bg-primary text-white p-2 rounded-md hover:bg-primary-dark opacity-0"
            onClick={handleLogin}
          >
            Login
          </Button>
          {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
