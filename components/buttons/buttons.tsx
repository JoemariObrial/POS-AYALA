import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Optional, for the close icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "../modal/modals";

function AddProductModal() {
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();

    // Construct the data to be sent to the PHP API
    const data = {
      operation: "save",
      json: JSON.stringify({
        code: barcode,
        name: productName,
        price: price,
      }),
    };

    try {
      const response = await axios.post(
        "http://localhost/GaisanoCarmen/app/api/add_product.php",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data === 1) {
        setIsSuccess(true);
        setModalMessage("Product added successfully!");
        // Clear the form fields after successful submission
        setBarcode("");
        setProductName("");
        setPrice("");
      } else {
        setIsSuccess(false);
        setModalMessage("Failed to add product. Please try again.");
      }
      setModalOpen(true);
    } catch (error) {
      console.error("Error adding product:", error);
      setIsSuccess(false);
      setModalMessage("An error occurred. Please try again.");
      setModalOpen(true);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="default">Add Product</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-medium">
            Add Product
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            Fill in the details to add a new product.
          </Dialog.Description>
          <form className="mt-4" onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Barcode
              </label>
              <Input
                type="number"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter barcode product"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <Input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter product price"
                required
              />
            </div>
            <div className="flex justify-end">
              <Dialog.Close asChild>
                <Button variant="default">Cancel</Button>
              </Dialog.Close>
              <Button type="submit" variant="secondary" className="ml-2">
                Save
              </Button>
            </div>
          </form>
          <Modal
            isOpen={modalOpen}
            onClose={closeModal}
            message={modalMessage}
            isSuccess={isSuccess}
          ></Modal>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddProductModal;
