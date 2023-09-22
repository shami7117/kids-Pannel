"use client";

import {
  Button,
  Input,
  Pagination,
  Checkbox,
  Space,
  Modal,
  message,
  Dropdown,
  Menu,
  Form,
  Select, notification
} from "antd";
import Image from "next/image";
import Head from "next/head";
import { SearchOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { FilterOutlined, EditOutlined } from "@ant-design/icons";
import ProductModal from "../../components/ProductModal";
import EditModal from "../../components/EditModal";
const { Option } = Select;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import firebase from '../../../Firebase/firebase'; // Import your Firebase configuration.
import {
  collection,
  addDoc, doc, getDoc, setDoc, where, query, getDocs
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";
import { Diplomata } from "next/font/google";

const Index = () => {
  const ITEMS_PER_PAGE = 5;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    ["Products"],
    async (id) => {
      console.log("MUTATION", id)
      await ProductApi.deleteProduct(id);
    },
    {
      onError: (data) => { },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Product deleted successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Products"]);
        setShowDeleteConfirmationModal(false)
        setEditModalVisible(false)
      },
    }
  );

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);


  const handleSearch = async () => {
    const snapshot = collection(db, "Products");

    // Perform a query to filter documents that match the search text.
    const lowercaseSearchText = searchText.toLowerCase(); // Convert the searchText to lowercase

    const querySnapshot = await getDocs(
      query(snapshot,
        where('product', '>=', lowercaseSearchText),
        where('product', '<=', lowercaseSearchText + '\uf8ff')
      )
    );

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });

    setSearchResults(results);
  };



  const products = [
    {
      id: 1,
      image: "/images/products1.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Available",
    },
    {
      id: 2,
      image: "/images/product2.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Disabled",
    },
    {
      id: 3,
      image: "/images/product3.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Available",
    },
    {
      id: 4,
      image: "/images/products1.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Available",
    },
    {
      id: 5,
      image: "/images/product2.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Available",
    },
    {
      id: 6,
      image: "/images/product3.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Disabled",
    },
    {
      id: 7,
      image: "/images/products1.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Disabled",
    },
    {
      id: 8,
      image: "/images/product2.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Available",
    },
    {
      id: 9,
      image: "/images/product3.svg",
      name: "AFO Standard",
      price: 124.0,
      sold: 1,
      earning: 14676.0,
      status: "Available",
    },
  ];

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeButton, setActiveButton] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [available, setAvailable] = useState(0);
  const [disabled, setDisabled] = useState(0);
  const [sortByDate, setSortByDate] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [allRowsSelected, setAllRowsSelected] = useState(false);


  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmationModal(true);
  };



  const handleSortByDate = () => {
    setSortByDate(!sortByDate);
    if (sortByDate) {
      setFilteredOrders(
        [...filteredOrders].sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
        ),
      );
    } else {
      setFilteredOrders(
        [...filteredOrders].sort(
          (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
        ),
      );
    }
  };
  useEffect(() => {
    const availableProducts = products.filter(
      (product) => product.status === "Available",
    );
    setAvailable(availableProducts.length);
  }, [products]);

  useEffect(() => {
    const disabledProducts = products.filter(
      (product) => product.status === "Disabled",
    );
    setDisabled(disabledProducts.length);
  }, [products]);



  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (productId) => {
    setFilteredProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selected: !product.selected }
          : product,
      );

      const updatedSelectedIds = updatedProducts
        .filter((product) => product.selected)
        .map((product) => product.id);

      setSelectedProductIds(updatedSelectedIds);

      return updatedProducts;
    });
  };

  const handleActionsToggle = (productId) => {
    setSelectedProductId(productId);
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
  };

  const handleEditSubmit = ({
    image: fileListImage,
    status,
    price,
    earning,
    ...values
  }) => {
    const numericPrice = parseFloat(price);
    const numericEarning = parseFloat(earning);

    if (isNaN(numericPrice) || isNaN(numericEarning)) {
      message.error("Invalid price or earning value");
      return;
    }

    const updatedProducts = filteredProducts.map((product) =>
      product.id === selectedProduct.id
        ? {
          ...product,
          ...values,
          image: fileListImage,
          status,
          price: numericPrice,
          earning: numericEarning,
        }
        : product,
    );

    setFilteredProducts(updatedProducts);
    setSelectedProductIds([]);
    setEditModalVisible(false);

    message.success("Product updated successfully.");
  };

  const handleEditModalOpen = (product) => {
    setSelectedProduct(product);
    editForm.setFieldsValue({
      productID: product.id,
      product: product.name,
      price: typeof product.price === "number" ? product.price.toFixed(2) : "",
      earning:
        typeof product.earning === "number" ? product.earning.toFixed(2) : "",
      sold: product.sold,
      status: product.status,
    });
    setEditModalVisible(true);
  };

  const handleDeleteEach = selectedProduct => {
    setSelectedProductId(selectedProduct);
    handleDeleteConfirmation();
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handleOrderModal = () => {
    setShowOrderModal(true);
    console.log("modal open");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return {
          color: "#1BB10E",
          border: "1px solid #1BB10E",
          backgroundColor: "#36E82617",
        };
      case "Disabled":
        return {
          color: "#E82626",
          border: "1px solid #E82626",
          backgroundColor: "#E826261A",
        };
      case "Pending":
        return {
          color: "#FFBF00",
          border: "1px solid #FFBF00",
          backgroundColor: "#FF57331A",
        };
      default:
        return {};
    }
  };


  const handleHeaderCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setAllRowsSelected(isChecked);

    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) => ({ ...product, selected: isChecked }))
    );

    setSelectedProductIds(isChecked ? filteredProducts.map((product) => product.id) : []);
  };








  const { data, isLoading, isError } = useQuery(
    ['Products', selectedStatus],
    async () => {

      const response = await ProductApi.getProducts(selectedStatus);
      return response;// Assuming your API returns data property

    }
  );
  const { data: lengthData, isLoading: lengthLoading, isError: lengthError } = useQuery(
    ['Products',],
    async () => {

      const response = await ProductApi.getAllProducts();
      return response;// Assuming your API returns data property

    }
  );
  console.log("length", lengthData)
  const pendingTasks = lengthData?.filter((task) => task.status === "Pending");
  const DisabledTasks = lengthData?.filter((task) => task.status === "Disabled");
  const AvailableTasks = lengthData?.filter((task) => task.status === "Available");
  console.log("PENDING", pendingTasks)


  if (isLoading) {
    return <h1>Loading...</h1>
  }
  if (isError) {
    return <h1>Error</h1>
  }
  return (
    <div className="w-full h-full bg-[F9F9F9] px-4 ">
      <Head>
        <title>Products</title>
      </Head>
      <div className="h-full w-full my-4 py-3  bg-[#FFFFFF] rounded-md">
        <div className="w-full px-3  py-1 border-b border-[#DFDFDF]">
          <div className="flex justify-between items-center w-full px-3 flex-wrap-reverse">
            <div className="relative flex items-center w-full sm:w-auto">
              <Image
                src="/images/search.svg"
                className="text-gray-500 absolute top-[13px] left-4 z-10"
                width={15}
                height={15}
              />
              <Input
                placeholder="Search Products..."
                className={` fontFamily pl-10 py-2 text-[#777777]`}
                style={{ borderRadius: "5px" }}
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); handleSearch(); }}
              />

            </div>
            <div className="flex items-center w-full sm:w-auto">
              <Button
                type="primary"
                className="create-order-button w-full sm:w-auto mb-4 sm:mb-0"
                onClick={handleOrderModal}
                style={{
                  backgroundColor: "#A51F6C",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  height: "45px",
                }}>
                Add Product
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center my-5 px-2 w-full flex-wrap  ">
            <div className="flex overflow-x-scroll md:overflow-x-hidden text-[#777777] w-full sm:w-auto  justify-center sm:justify-center ">
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "All" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("All");
                  setSelectedStatus(null); setFilteredProducts(products);
                }}>
                All Products {" ("}
                {lengthData?.length}
                {") "}
              </button>
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "Available" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("Available");
                  setSelectedStatus("Available");
                  const availableProducts = products.filter(
                    (product) => product.status === "Available",
                  );
                  setFilteredProducts(availableProducts);
                }}>
                Available {" ("}
                {AvailableTasks?.length}
                {") "}
              </button>
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "Pending" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("Pending");
                  setSelectedStatus("Pending");
                  setFilteredProducts(products);
                }}>
                Pending {" ("}
                {pendingTasks?.length}
                {") "}
              </button>
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "Disabled" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("Disabled");
                  setSelectedStatus("Disabled");
                  const disabledProducts = products.filter(
                    (products) => products.status === "Disabled",
                  );
                  setFilteredProducts(disabledProducts);
                }}>
                Disabled {" ("}
                {DisabledTasks?.length}
                {") "}
              </button>
            </div>
            {/* <div className="flex items-center  justify-center  w-full sm:w-auto pt-6 sm:pt-0">
              <button
                className={`rounded-md bg-[#2668E81A] border border-[#2668E842] px-3 py-1 text-[#2668e8] font-[500] mr-3`}
                onClick={handleSortByDate}>
                <FilterOutlined style={{ color: "#2668e8" }} />
              </button>
            </div> */}
          </div>
        </div>
        <div>
          {/* Table */}
          <div className="w-full h-full  px-5 py-4 ">


            <table
              className="w-full hidden lg:table border border-[#DFDFDF] "
              style={{ borderRadius: "30px" }}>
              <thead className="my-3 fontFamily border-b border-[DFDFDF] uppercase">
                <tr className="text-[#777777] text-left px-4 py-2">

                  <th className="  font-[500] text-center self-start text-sm md:text-[14px]">
                    Products
                  </th>
                  <th className="  font-[500] text-center self-start text-sm md:text-[14px]">
                    Product Name
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Price
                  </th>

                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Status
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Color
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Size
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Description
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Featured
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Popular
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {searchResults.length > 0 && searchText !== '' ? searchResults?.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-200 border-b border-[DFDFDF] ${product.selected ? "bg-[#F4F4F4]" : ""
                      }`}>

                    {/* Product Image */}
                    <td className="">
                      <div className="flex items-center justify-center">
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-4 ">
                          <Image
                            src={product.file}
                            width={40}
                            height={40}
                            alt="Product"
                          />
                        </div>
                        <p className="text-[#110F0F]  uppercase text-[14px]">
                          {product.category}
                        </p>
                      </div>
                    </td>
                    {/* Product Name */}
                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {product.product}
                      </p>
                    </td>

                    {/* Product Price */}
                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        ${product.price}
                      </p>
                    </td>
                    {/* Product Status */}
                    <td className="font-[400] text-center">
                      <p
                        className="rounded-md px-2 py-1 text-[14px] font-[400] text-center"
                        style={getStatusStyle(product.status)}>
                        {product.status}
                      </p>
                    </td>
                    {/* Sold */}
                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {product.color}
                      </p>
                    </td>
                    {/* Total Earning */}
                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {product.size}
                      </p>
                    </td>
                    {/* description */}
                    <td className="font-[400]  text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {product.description}
                      </p>
                    </td>

                    {/* description */}
                    <td className="font-[400] max-w-[150px] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {product.featured}
                      </p>
                    </td>

                    {/* description */}
                    <td className="font-[400] max-w-[150px] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {product.popular}
                      </p>
                    </td>
                    {/* Actions */}
                    <td className="flex justify-around items-center">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item
                              onClick={() => handleEditModalOpen(product)}>
                              <EditOutlined /> Edit
                            </Menu.Item>
                            <Menu.Item
                              onClick={() => { handleDeleteEach(product.id) }}
                              className="delete-option">
                              <DeleteOutlined /> Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                        placement="bottomRight"
                      // visible={selectedProductId === product.id}
                      // onVisibleChange={(visible) => {
                      //   if (!visible) {
                      //     setSelectedProductId(null);
                      //   }
                      // }}
                      >
                        <Button
                          icon={<MoreOutlined />}
                          className="more-button"
                          onClick={() => handleActionsToggle(product.id)}
                        />
                      </Dropdown>
                    </td>
                  </tr>
                )) : searchResults.length === 0 && searchText !== '' ?
                  <h1>No results found</h1> :
                  data?.map((product) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-200 border-b border-[DFDFDF] ${product.selected ? "bg-[#F4F4F4]" : ""
                        }`}>

                      {/* Product Image */}
                      <td className="">
                        <div className="flex items-center justify-center">
                          <div className="w-10 h-10 rounded-md overflow-hidden mr-4 ">
                            <Image
                              src={product.file}
                              width={40}
                              height={40}
                              alt="Product"
                            />
                          </div>
                          <p className="text-[#110F0F]  uppercase text-[14px]">
                            {product.category}
                          </p>
                        </div>
                      </td>


                      {/* Product Name */}
                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {product.product}
                        </p>
                      </td>


                      {/* Product Price */}
                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          ${product.price}
                        </p>
                      </td>
                      {/* Product Status */}
                      <td className="font-[400] text-center">
                        <p
                          className="rounded-md px-2 py-1 text-[14px] font-[400] text-center"
                          style={getStatusStyle(product.status)}>
                          {product.status}
                        </p>
                      </td>
                      {/* Sold */}
                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {product.color}
                        </p>
                      </td>
                      {/* Total Earning */}
                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {product.size}
                        </p>
                      </td>
                      {/* description */}
                      <td className="font-[400]  text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {product.description}
                        </p>
                      </td>

                      {/* description */}
                      <td className="font-[400] max-w-[150px] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {product.featured}
                        </p>
                      </td>

                      {/* description */}
                      <td className="font-[400] max-w-[150px] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {product.popular}
                        </p>
                      </td>
                      {/* Actions */}
                      <td className="flex justify-around items-center">
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item
                                onClick={() => handleEditModalOpen(product)}>
                                <EditOutlined /> Edit
                              </Menu.Item>
                              <Menu.Item
                                onClick={() => { handleDeleteEach(product.id) }}
                                className="delete-option">
                                <DeleteOutlined /> Delete
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={["click"]}
                          placement="bottomRight"
                        // visible={selectedProductId === product.id}
                        // onVisibleChange={(visible) => {
                        //   if (!visible) {
                        //     setSelectedProductId(null);
                        //   }
                        // }}
                        >
                          <Button
                            icon={<MoreOutlined />}
                            className="more-button"
                            onClick={() => handleActionsToggle(product.id)}
                          />
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="lg:hidden flex flex-col space-y-4">
              {data?.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-md border border-grey-500 shadow-md my-5 py-3 px-4 flex flex-col">
                  <div className="flex justify-between items-center border-b border-[#A51F6C] pb-3 w-full">
                    <div className="flex  items-center">
                      <div className="w-20 h-20 rounded-md overflow-hidden  flex items-center justify-center">
                        <Image
                          src={product.file}
                          width={80}
                          height={80}
                          alt="Product"
                        />
                      </div>
                      <div className="ml-2">
                        <h3 className="font-semibold text-base">{product.category}</h3>
                      </div>
                    </div>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item onClick={() => handleEditModalOpen(product)}>
                            <EditOutlined /> Edit
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => { handleDeleteEach(product.id) }}
                            className="delete-option">
                            <DeleteOutlined /> Delete
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={["click"]}
                      placement="bottomRight"
                    // visible={selectedProductId === product.id}
                    // onVisibleChange={(visible) => {
                    //   if (!visible) {
                    //     setSelectedProductId(null);
                    //   }
                    // }}
                    >
                      <Button icon={<MoreOutlined />} className="more-button rounded-full border border-[#A51F6C]" onClick={() => handleActionsToggle(product.id)} />
                    </Dropdown>
                  </div>


                  <div className="flex justify-between items-center pb-3 mt-3 w-full px-[6%] sm:px-auto">
                    <div>
                      <p className="font-semibold text-lg">Product Name</p>
                      <p className="font-[600] text-blue-600 text-lg">{product.product}</p>
                    </div>

                  </div>

                  <div className="flex items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full px-[6%] sm:px-auto">
                    <div className="mr-[30%]">
                      <h3 className="font-semibold text-base">Color</h3>
                      <p className="text-base">{product.color}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">Status</h3>
                      <p className="text-base">${product.status}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-3 mt-3 w-full px-[6%] sm:px-auto">
                    <div>
                      <p className="font-semibold text-lg">Price</p>
                      <p className="font-[600] text-blue-600 text-lg">${product.price}</p>
                    </div>
                    <p
                      className={`rounded-md px-2 py-1 text-[18px] font-[400] text-center `}
                      style={getStatusStyle(product.status)}>
                      {product.status}
                    </p>
                  </div>
                </div>
              ))}
              <Pagination
                current={currentPage}
                pageSize={ITEMS_PER_PAGE}
                total={filteredProducts.length}
                onChange={onPageChange}
                className="my-4 flex justify-center"
              />
            </div>

          </div>
        </div>

        <EditModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onOk={({ image: fileListImage, status, ...values }) =>
            handleEditSubmit({ image: fileListImage, status, ...values })
          }
          editForm={editForm}
          selectedProduct={selectedProduct}
        />
        <Modal
          title="Confirm Deletion"
          visible={showDeleteConfirmationModal}
          onCancel={() => setShowDeleteConfirmationModal(false)}
          onOk={() => { console.log("DELETE", selectedProduct); deleteMutation.mutate(selectedProductId) }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{
            style: { backgroundColor: "#D83535", color: "#FFFFFF" },
          }}>
          <p>Are you sure you want to delete the selected products?</p>
        </Modal>

        <ProductModal
          visible={showOrderModal}
          onCancel={() => setShowOrderModal(false)}
          onSubmit={() => console.log("submitted")}
        />
      </div>
    </div>
  );
};

export default Index;
