"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AddProductModal from "@/components/buttons/buttons";
import Link from "next/link";

function Product() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("prod_name");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .post("http://192.168.1.2/GaisanoCarmens/app/api/add_product.php", {
        operation: "getproduct",
      })
      .then((response) => {
        console.log(response.data); // Add this line to inspect the response
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  // Search filter
  const filteredProducts = products.filter((product: any) =>
    product.prod_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort function
  const sortedProducts = filteredProducts.sort((a: any, b: any) => {
    const isAsc = sortOrder === "asc";
    if (sortColumn === "prod_name") {
      return isAsc
        ? a.prod_name.localeCompare(b.prod_name)
        : b.prod_name.localeCompare(a.prod_name);
    } else if (sortColumn === "prod_price") {
      return isAsc ? a.prod_price - b.prod_price : b.prod_price - a.prod_price;
    } else {
      return isAsc
        ? a.prod_code.localeCompare(b.prod_code)
        : b.prod_code.localeCompare(a.prod_code);
    }
  });

  // Handle sorting
  const handleSort = (column: any) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <img src="/ayal.png" alt="" width={350} height={350} />
          <ul className="mt-8">
            <li className="p-2 hover:bg-gray-700 rounded-lg">
              <Link href="/admin">Dashboard</Link>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded-lg">
              <Link href="/product">Add Products</Link>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded-lg">Tables</li>
            <li className="p-2 hover:bg-gray-700 rounded-lg">
              <Link href="/">Logout</Link>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Grocery Products</h2>
              <AddProductModal />
            </div>
            <input
              type="text"
              placeholder="Filter Product..."
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th
                  className="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("prod_code")}
                >
                  Product Code{" "}
                  {sortColumn === "prod_code" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("prod_name")}
                >
                  Product Name{" "}
                  {sortColumn === "prod_name" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  className="py-2 px-6 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("prod_price")}
                >
                  Price{" "}
                  {sortColumn === "prod_price" && (
                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product: any, index: any) => (
                  <tr key={index}>
                    <td className="py-2 px-6 whitespace-nowrap">
                      {product.prod_code}
                    </td>
                    <td className="py-2 px-6 whitespace-nowrap">
                      {product.prod_name}
                    </td>
                    <td className="py-2 px-6 whitespace-nowrap">
                      ${product.prod_price.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 px-6 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Product;
