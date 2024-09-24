import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function ShiftReportModal({
  isOpen,
  onClose,
  salesList,
  cashierId,
  cashierName,
}: any) {
  const [filteredSales, setFilteredSales] = useState<any>([]);

  useEffect(() => {
    if (cashierId) {
      const sales = salesList.filter(
        (sale: any) => sale.cashierId === cashierId
      );
      const groupedSales = groupSalesByProduct(sales);
      setFilteredSales(groupedSales);
    }
  }, [salesList, cashierId]);

  const groupSalesByProduct = (sales: any[]) => {
    const salesMap = new Map();

    sales.forEach((sale: any) => {
      if (salesMap.has(sale.product)) {
        const existingSale = salesMap.get(sale.product);
        existingSale.qty += sale.qty;
        existingSale.amount += parseFloat(sale.amount);
      } else {
        salesMap.set(sale.product, {
          ...sale,
          amount: parseFloat(sale.amount),
        });
      }
    });

    return Array.from(salesMap.values());
  };

  const getShiftTotal = () => {
    return filteredSales.reduce((acc: any, sale: any) => acc + sale.amount, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-primary bg-green-500 w-full max-w-6xl">
        <DialogHeader>
          <DialogTitle>Shift Report - {cashierName}</DialogTitle>
        </DialogHeader>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-yellow-300">Quantity</TableHead>
                <TableHead className="text-yellow-300">Product</TableHead>
                <TableHead className="text-yellow-300">Price</TableHead>
                <TableHead className="text-yellow-300">Amount</TableHead>
                <TableHead className="text-yellow-300">
                  Date & Time of Transaction
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale: any, index: any) => (
                <TableRow key={index}>
                  <TableCell className="text-yellow-300">{sale.qty}</TableCell>
                  <TableCell className="text-yellow-300">
                    {sale.product}
                  </TableCell>
                  <TableCell className="text-yellow-300">
                    {sale.price}
                  </TableCell>
                  <TableCell className="text-yellow-300">
                    {sale.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-yellow-300">
                    {sale.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-xl font-bold text-yellow-300">
              Shift Total: {getShiftTotal().toFixed(2)}
            </TableCaption>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
