"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@uidotdev/usehooks";
import "../blink.css";

import BarcodeScanner from "@/components/barcodeScanner/scanner";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CashierLoginModal from "@/components/cashierLoginModal/login";
import ShiftReportModal from "@/components/shiftReportModal/shiftreport";

interface Product {
  barcode: string;
  p_name: string;
  price: number;
}

export default function Home() {
  const { toast } = useToast();

  const [productList, setProductList] = useState<Product[]>([]);

  const [orderList, setOrderList] = useState<any>([]);
  const [salesList, setSalesList] = useState<any>([]);
  const [qty, setQty] = useState(1);
  const [barCode, setBarCode] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState(1);
  const [total, setTotal] = useState(1);
  const [cash, setCash] = useState(0);
  const [change, setChange] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShiftReportOpen, setIsShiftReportOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedOrders, setPausedOrders] = useState<any[]>([]);
  const [isVoidDialogOpen, setIsVoidDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [productToVoid, setProductToVoid] = useState<string[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] =
    useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const qtyRef = useRef<HTMLInputElement>(null);
  const barCodeRef = useRef<HTMLInputElement>(null);
  const cashRef = useRef<HTMLInputElement>(null);

  const beepSound = useRef(new Audio("/scan.mp4"));

  const debounceBarCode = useDebounce(barCode, 200);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // const [cashier, setCashier] = useState<any>(null);

  const [cashier, setCashier] = useState<any>(null);

  useEffect(() => {
    const cashierData = sessionStorage.getItem("cashier");
    if (cashierData) {
      setCashier(JSON.parse(cashierData));
    }
  }, []);

  const handleVoidProduct = (product: string) => {
    setProductToVoid((prev) => [...prev, product]);
    setIsAdminPasswordModalOpen(true);
  };

  const voidProduct = (productToVoid: string) => {
    const updatedOrderList = orderList.filter(
      (order: any) => !productToVoid.includes(order.product)
    );
    setOrderList(updatedOrderList);
    toast({
      title: "Product Voided",
      description: "The product has been successfully voided.",
    });
  };

  const handleAdminPasswordSubmit = () => {
    if (adminPassword === "12345") {
      setIsAdminAuthenticated(true);
      setIsVoidDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Incorrect admin password.",
      });
    }
    setIsAdminPasswordModalOpen(false);
  };

  const groupSalesByCashier = (sales: any[]) => {
    return sales.reduce((acc: any, sale: any) => {
      const { cashierName, qty, product, price, amount, timestamp } = sale;
      if (!acc[cashierName]) {
        acc[cashierName] = {
          cashierName,
          totalQty: 0,
          totalAmount: 0,
          sales: [],
        };
      }
      acc[cashierName].totalQty += qty;
      acc[cashierName].totalAmount += amount;
      acc[cashierName].sales.push({ qty, product, price, amount, timestamp });
      return acc;
    }, {} as any);
  };

  const handleLoginSuccess = (cashierInfo: any) => {
    setCashier(cashierInfo);
    qtyRef.current?.focus();
    qtyRef.current?.select();
    toast({
      title: "Cashier Logged-in Successfully!",
      description: "WELCOME!",
    });

    console.log("Cashier logged in:", cashierInfo);
  };

  useEffect(() => {
    // URL to your PHP API
    const apiURL = "http://localhost/GaisanoCarmens/app/api/products.php";

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setProductList(data))
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Failed to fetch products",
          description: "Could not load product data from the server.",
        });
      });
  }, []);

  const findProductByBarCode = useCallback(
    (barcode: any) => {
      const product = productList.find((p) => p.barcode === barcode);
      if (product) {
        setProduct(product.p_name);
        setPrice(product.price);
        setTimeout(() => {
          qtyRef.current?.focus();
          qtyRef.current?.select();
        }, 0);
      } else {
        setProduct("");
        setPrice(0);
      }
    },
    [productList, toast]
  );

  useEffect(() => {
    if (debounceBarCode) {
      findProductByBarCode(debounceBarCode);
    }
  }, [debounceBarCode, findProductByBarCode]);

  const addOrder = useCallback(() => {
    if (isPaused) return; // Don't add orders if paused

    if (!cashier) {
      toast({
        variant: "destructive",
        title: "Cashier not logged in!",
        description: "Please log in as a cashier before adding orders.",
      });
      return;
    }
    if (!product || price <= 0 || qty <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid entry!",
        description: "Check the product details and quantity.",
      });
      return;
    }
    const existingOrderIndex = orderList.findIndex(
      (order: any) => order.product === product
    );
    if (existingOrderIndex >= 0) {
      const updatedOrderList = [...orderList];
      const existingOrder = updatedOrderList[existingOrderIndex];
      existingOrder.qty += qty;
      existingOrder.amount = existingOrder.qty * existingOrder.price;
      setOrderList(updatedOrderList);
    } else {
      const amt = qty * price;
      setOrderList([...orderList, { qty, product, price, amount: amt }]);
    }
  }, [product, price, qty, orderList, toast, isPaused]);

  const handleNewOrder = useCallback(() => {
    setOrderList([]);
    setQty(1);
    setBarCode("");
    setProduct("");
    setPrice(0);
    setCash(0);
    setChange(0);
    qtyRef.current?.focus();
    qtyRef.current?.select();
  }, []);

  const handlePause = () => {
    // Save current orders to pausedOrders state
    setPausedOrders([...orderList]);
    // Clear the current orders
    setOrderList([]);

    toast({
      title: "Transaction Paused",
      description:
        "You have paused the transaction. Orders have been saved and cleared.",
    });
  };

  const handleResume = () => {
    // Restore paused orders and clear pausedOrders state
    setOrderList([...orderList, ...pausedOrders]);
    setPausedOrders([]);

    toast({
      title: "Transaction Resumed",
      description:
        "You have resumed the transaction. Paused orders have been reloaded.",
    });
  };

  useEffect(() => {
    if (product && price > 0) {
      addOrder();
      beepSound.current.play();
      // audioRef.current.play();
      setBarCode("");
      setProduct("");
      setPrice(0);
      setQty(1);
      qtyRef.current?.focus();
      qtyRef.current?.select();
    }
  }, [product, price]);

  const getSalesTotal = () => {
    return salesList.reduce(
      (acc: number, sale: any) => acc + parseFloat(sale.amount),
      0
    );
  };

  const handleOrder = useCallback(() => {
    if (isPaused) return; // Don't process orders if paused

    if (!cashier) {
      toast({
        variant: "destructive",
        title: "Cashier not logged in!",
        description: "Please log in as a cashier before adding orders.",
      });
      return;
    }
    const totalAmount = orderList.reduce(
      (acc: any, order: any) => acc + parseFloat(order.amount),
      0
    );
    if (cash < totalAmount) {
      toast({
        variant: "destructive",
        title: "Not enough money!",
        description: "Please pay the given total amount sufficiently.",
      });
      return;
    }
    const changeAmount = cash - totalAmount;
    setChange(changeAmount);
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    setSalesList([
      ...salesList,
      ...orderList.map((order: any) => ({
        ...order,
        timestamp,
        cashierId: cashier.id,
        cashierName: cashier.name,
      })),
    ]);
    setCash(0);
    toast({
      title: "Order Success!",
      description: "Thank you for ordering! ^^",
    });
  }, [cash, orderList, salesList, cashier, isPaused]);

  useEffect(() => {
    setTotal(
      orderList.reduce(
        (acc: any, order: any) => acc + parseFloat(order.amount),
        0
      )
    );
  }, [orderList]);

  useEffect(() => {
    findProductByBarCode(barCode);
  }, [barCode, findProductByBarCode]);

  useEffect(() => {
    qtyRef.current?.focus();
    qtyRef.current?.select();
  }, []);

  const handleGlobalKeyPress = useCallback(
    (e: any) => {
      switch (e.code) {
        case "KeyQ":
          qtyRef.current?.focus();
          break;
        case "KeyW":
          barCodeRef.current?.focus();
          break;
        case "KeyE":
          cashRef.current?.focus();
          break;
        case "Enter":
          handleOrder();
          break;
        case "KeyP":
          setIsDialogOpen(true);
          break;
        case "KeyT": // Change to 'KeyT' for Pause
          handlePause();
          break;
        case "KeyR": // Change to 'KeyR' for Resume
          handleResume();
          break;
        case "KeyN":
          handleNewOrder();
          break;
        case "KeyV": // Handle the 'V' key for voiding
          e.preventDefault(); // Prevent the default action (e.g., typing 'V' into the input)
          if (orderList.length > 0) {
            setIsAdminPasswordModalOpen(true);
          }
          break;
        case "KeyA": // Handle the 'A' key for select all
          setSelectAll((prev) => !prev);
          break;
        case "Delete": // Handle the 'Delete' key to void all selected
          if (isVoidDialogOpen && productToVoid.length > 0) {
            productToVoid.forEach(voidProduct);
            setIsVoidDialogOpen(false);
            setProductToVoid([]);
            setSelectAll(false);
          }
          break;
        case "NumpadDecimal":
          if (document.activeElement === barCodeRef.current) {
            setBarCode((prev) => prev.slice(0, -1));
          } else if (document.activeElement === qtyRef.current) {
            setQty((prev) => {
              const newQty = prev.toString().slice(0, -1);
              return newQty.length > 0 ? parseInt(newQty) : 0;
            });
          } else if (document.activeElement === cashRef.current) {
            setCash((prev) => {
              const newCash = prev.toString().slice(0, -1);
              return newCash.length > 0 ? parseInt(newCash) : 0;
            });
          }
          break;
        case "KeyY":
          setIsShiftReportOpen(true);
          break;
        case "KeyL":
          setIsLoginModalOpen(true);
          break;
        case "KeyX":
          setIsLoginModalOpen(false);
          setIsDialogOpen(false);
          setIsShiftReportOpen(false);
          break;
        default:
          break;
      }
    },
    [
      addOrder,
      handleOrder,
      handleNewOrder,
      orderList,
      productToVoid,
      isVoidDialogOpen,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyPress);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyPress);
    };
  }, [handleGlobalKeyPress]);

  useEffect(() => {
    if (selectAll) {
      setProductToVoid(orderList.map((order: any) => order.product));
    } else {
      setProductToVoid([]);
    }
  }, [selectAll, orderList]);

  const handleNumericInput = (setter: any) => (e: any) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setter(numericValue);
  };

  const handleBarcodeDetected = (barcode: any) => {
    setBarCode(barcode);
    findProductByBarCode(barcode);
    if (debounceBarCode) {
      addOrder();
      setBarCode("");
    }
  };
  // useEffect(() => {
  //   // Auto-play and loop the background music
  //   if (audioRef.current) {
  //     audioRef.current.volume = 0.5; // Adjust volume as needed
  //     audioRef.current.loop = true;
  //     audioRef.current.play();
  //   }
  // }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 h-screen background-container">
      <CashierLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <div className="flex justify-between items-center mb-10">
        {cashier ? (
          <div className="flex items-center text-xl md:text-3xl font-bold mb-2 text-white">
            <Avatar className="mr-2">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <span className="text-right">Welcome! {cashier.name}</span>
          </div>
        ) : (
          <div className="">
            <div className="text-right text-xl md:text-3xl font-bold mb-2 text-white animate-bounce">
              PLEASE LOG IN FIRST!
            </div>
          </div>
        )}
        <div className="">
          <div className="text-right text-7xl md:text-8xl font-bold mb-2 text-white">
            TOTAL: ₱{total}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="h-auto md:h-[500px] border-green-500 border-2 bg-green-500">
          <CardContent className="p-4 md:p-6">
            <Label className="text-lg text-white">Quantity</Label>
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <Input
                className="w-full md:w-[300px] mt-2 md:mt-0"
                ref={qtyRef}
                type="text"
                value={qty}
                onChange={handleNumericInput((value: any) =>
                  setQty(Number(value))
                )}
              />
            </div>
            <Label className="text-lg text-white">Bar Code</Label>
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <Input
                className="w-full md:w-[300px] mt-2 md:mt-0"
                ref={barCodeRef}
                type="text"
                value={barCode}
                onChange={handleNumericInput(setBarCode)}
              />
            </div>
            <div className="flex justify-center items-center">
              <img src="/ayal.png" alt="" width={350} height={350} />
            </div>
            <BarcodeScanner onDetected={handleBarcodeDetected} />
          </CardContent>
        </Card>
        <div className="col-span-1 md:col-span-3">
          <Dialog open={isVoidDialogOpen} onOpenChange={setIsVoidDialogOpen}>
            <DialogContent className="border border-yellow border-2 bg-green-500 w-full max-w-4xl">
              <DialogHeader>
                <DialogTitle>Select Products to Void</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col">
                    <Label className="text-lg">Select Products</Label>
                    <div className="mt-2 p-2 bg-green border border-gray-300 rounded">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectAll}
                          onChange={() => setSelectAll((prev) => !prev)}
                        />
                        <label className="text-yellow-300">Select All</label>
                      </div>
                      {orderList.map((order: any, index: number) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            className="mr-2"
                            value={order.product}
                            checked={productToVoid.includes(order.product)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProductToVoid((prev) =>
                                prev.includes(value)
                                  ? prev.filter((product) => product !== value)
                                  : [...prev, value]
                              );
                            }}
                          />
                          <label className="text-yellow-300">
                            {order.product} (Qty: {order.qty})
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => {
                          if (productToVoid.length > 0) {
                            voidProduct(productToVoid.join(","));
                            setIsVoidDialogOpen(false);
                            setProductToVoid([]);
                            setSelectAll(false);
                          } else {
                            toast({
                              variant: "destructive",
                              title: "No Products Selected",
                              description: "Please select products to void.",
                            });
                          }
                        }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAdminPasswordModalOpen}
            onOpenChange={setIsAdminPasswordModalOpen}
          >
            <DialogContent className="border border-yellow-500 bg-green-500">
              <DialogHeader>
                <DialogTitle>Admin Authentication</DialogTitle>
                <DialogDescription>
                  Enter the admin password to proceed.
                </DialogDescription>
              </DialogHeader>
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-2"
              />
              <div className="flex justify-end mt-4">
                <Button onClick={handleAdminPasswordSubmit}>Submit</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="col-span-1">
            <Card className="md:h-[500px] border-green-500 border-2 bg-green-500">
              <CardContent className="p-4">
                <ScrollArea className="h-[450px] rounded-md border p-4 border-yellow-200 border-2">
                  <Table className="">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Quantity</TableHead>
                        <TableHead className="text-white">Product</TableHead>
                        <TableHead className="text-white">Price</TableHead>
                        <TableHead className="text-white">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderList.map((order: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="text-yellow-300">
                            {order.qty}
                          </TableCell>
                          <TableCell className="text-yellow-300">
                            {order.product}
                          </TableCell>
                          <TableCell className="text-yellow-300">
                            {order.price}
                          </TableCell>
                          <TableCell className="text-yellow-300">
                            {order.amount}
                          </TableCell>
                          <Button
                            className="opacity-0"
                            onClick={() => handleVoidProduct(order.product)}
                            variant="destructive"
                          >
                            Void
                          </Button>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col mt-4 md:flex-row md:mt-8 gap-x-4">
            <div className="flex flex-col md:flex-row gap-x-4 text-xl justify-end items-center">
              <div className="text-6xl font-semibold text-green-400">CASH:</div>
              <Input
                className="w-full text-3xl md:w-[200px] md:h-[50px] bg-white"
                type="text"
                ref={cashRef}
                value={cash}
                onChange={handleNumericInput((value: any) =>
                  setCash(Number(value))
                )}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-x-4 text-xl justify-end items-center">
              <div className="text-6xl text-green-400 font-semibold">
                CHANGE:
              </div>
              <Input
                className="w-full text-3xl md:w-[200px] md:h-[50px] border border-none bg-white"
                value={change}
                readOnly
              />
            </div>
            <Button
              variant="link"
              onClick={() => setIsLoginModalOpen(true)}
              className="font-large text-yellow-400 opacity-0"
            >
              Login as Cashier
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border border-yellow-500 bg-green-500 w-full max-w-5xl">
          <DialogHeader>
            <DialogTitle>Sales of the Day</DialogTitle>
            <DialogDescription>
              {Object.values(groupSalesByCashier(salesList)).map(
                (cashierGroup: any, index: number) => (
                  <div key={index} className="mb-4">
                    <h2 className="text-xl font-bold text-yellow-300 mb-2">
                      {cashierGroup.cashierName}
                    </h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-yellow-300">
                            Quantity
                          </TableHead>
                          <TableHead className="text-yellow-300">
                            Product
                          </TableHead>
                          <TableHead className="text-yellow-300">
                            Price
                          </TableHead>
                          <TableHead className="text-yellow-300">
                            Amount
                          </TableHead>
                          <TableHead className="text-yellow-300">
                            Date & Time of Transaction
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cashierGroup.sales.map((sale: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell className="text-yellow-300">
                              {sale.qty}
                            </TableCell>
                            <TableCell className="text-yellow-300">
                              {sale.product}
                            </TableCell>
                            <TableCell className="text-yellow-300">
                              {sale.price}
                            </TableCell>
                            <TableCell className="text-yellow-300">
                              {sale.amount}
                            </TableCell>
                            <TableCell className="text-yellow-300">
                              {sale.timestamp}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption className="text-xl font-bold text-yellow-300">
                        Total Quantity: {cashierGroup.totalQty} | Total Amount:{" "}
                        {cashierGroup.totalAmount}
                      </TableCaption>
                    </Table>
                  </div>
                )
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <ShiftReportModal
        isOpen={isShiftReportOpen}
        onClose={() => setIsShiftReportOpen(false)}
        salesList={salesList}
        cashierId={cashier ? cashier.id : null}
        cashierName={cashier ? cashier.name : null}
      />
    </div>
  );
}
