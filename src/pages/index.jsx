"use client";
import {
  Button,
  Input,
  Pagination,
  Modal,
  message,
  Dropdown,
  Menu,
  Form, notification
} from "antd";
import { db } from "../../Firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  Timestamp
} from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import { SearchOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef, useMemo } from "react";
import { FilterOutlined } from "@ant-design/icons";
import OrderModal from "../components/orderModal";
import EditModal from "../components/Orders/EditModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderApi from "@/lib/order";


import moment from 'moment';
const Index = () => {
  const ITEMS_PER_PAGE = 5;
  const orders = [
    {
      id: 1,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "New",
    },
    {
      id: 2,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "Cancelled",
    },
    {
      id: 3,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "New",
    },
    {
      id: 4,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "In Progress",
    },
    {
      id: 5,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "Completed",
    },
    {
      id: 6,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "In Progress",
    },
    {
      id: 7,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "New",
    },
    {
      id: 8,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "New",
    },
    {
      id: 9,
      orderId: "PK756466",
      customer: "James Williams",
      amount: 124.00, // Changed to a number
      payment: "PayPal",
      orderDate: "August 06, 2023",
      status: "Cancelled",
    },
  ];


  const actionsRef = useRef();
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeButton, setActiveButton] = useState("All");
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [delivered, setDelivered] = useState(0);
  const [pickup, setPickup] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [sortByDate, setSortByDate] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

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
    const deliveredOrders = orders.filter(
      (order) => order.status === "Completed",
    );
    setDelivered(deliveredOrders.length);
  }, [orders]);

  useEffect(() => {
    const pickupOrders = orders.filter(
      (order) => order.status === "In Progress",
    );
    setPickup(pickupOrders.length);
  }, [orders]);

  useEffect(() => {
    const cancelledOrders = orders.filter(
      (order) => order.status === "New",
    );
    setCancelled(cancelledOrders.length);
  }, [orders]);


  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    ["Orders"],
    async (id) => {
      console.log("MUTATION", id)
      await OrderApi.deleteOrder(id);
    },
    {
      onError: (data) => { },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Order deleted successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Orders"]);
        setShowDeleteModal(false); setEditModalVisible(false)
      },
    }
  );

  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlemodify = (orderId) => {
    setShowActions(false);
    setShowModifyModal(true);
  };

  const handleModifyToggle = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModify(!showModify);
    setShowModifyModal(true);
  };

  const handleDeleteConfirmed = () => {
    setShowDeleteModal(false);
    handleDeleteConfirmation()
  };

  const handleDeleteConfirmation = () => {
    const updatedOrders = orders.filter(
      (order) => order.id !== selectedOrderId,
    );
    const updated = orders.filter((order) => order.id !== selectedOrderId);

    setFilteredOrders(updatedOrders);
    // setSelectedOrderId(null);
  };

  const handleOrderModal = () => {
    setShowOrderModal(true);
    console.log("modal open");
  };

  const handleDelete = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedOrderId(null);
  };

  const handleModifyCancel = () => {
    setShowModifyModal(false);
    setSelectedOrderId(null);
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return {
          color: "#1BB10E",
          border: "1px solid #1BB10E",
          backgroundColor: "#36E82617",
        };
      case "New":
        return {
          color: "#2668E8",
          border: "1px solid #2668E8",
          backgroundColor: "#2668E81A",
        };
      case "In Progress":
        return {
          color: "#E88326",
          border: "1px solid #E88326",
          backgroundColor: "#FFF9F4",
        };
      case "Cancelled":
        return {
          color: "#FF0000",
          border: "1px solid #FF0000",
          backgroundColor: "#FFD9D9",
        };
      default:
        return {};
    }
  };


  const handleActionsToggle = (orderId) => {
    // setSelectedOrderId(null)
    setSelectedOrderId(orderId);

    const order = filteredOrders.find((o) => o.id === orderId);
    setSelectedOrder(order);
  };

  const handleEditSubmit = ({ status, amount, ...values }) => {
    const numericAmount = parseFloat(amount.replace("$", "").replace(",", ""));

    if (isNaN(numericAmount)) {
      message.error("Invalid amount value");
      return;
    }

    const updatedOrders = filteredOrders.map((order) =>
      order.id === selectedOrder.id
        ? {
          ...order,
          ...values,
          status,
          amount: numericAmount,
        }
        : order
    );

    setFilteredOrders(updatedOrders);
    // setSelectedOrderId(null);
    setShowModifyModal(false);

    message.success("Order updated successfully.");
  };


  const handleEditModalOpen = (order) => {
    // setSelectedOrderId(null)
    setSelectedOrder(order);
    const orderDateMoment = moment(order.orderDate, "MMMM DD, YYYY");

    editForm.setFieldsValue({
      orderId: order.orderId,
      customer: order.customer,
      amount: order.amount,
      payment: order.payment,
      orderDate: orderDateMoment,
      status: order.status,
    });

    setShowModifyModal(true);
  };

  const handleDeleteEach = () => {
    setSelectedOrderId(selectedOrder.id);
    handleDeleteConfirmation();
  };



  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);


  const handleSearch = async () => {
    const snapshot = collection(db, "Orders");

    // Perform a query to filter documents that match the search text.
    // const lowercaseSearchText = searchText.toLowerCase(); // Convert the searchText to lowercase

    const querySnapshot = await getDocs(
      query(snapshot,
        where('fName', '>=', searchText),
        where('fName', '<=', searchText + '\uf8ff')
      )
    );

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });

    setSearchResults(results);
  };
  console.log("SEARCH", searchResults)


  const { data, isLoading, isError } = useQuery(
    ['Orders', activeButton],
    async () => {

      const response = await OrderApi.getOrders(activeButton);
      return response;// Assuming your API returns data property

    }
  );


  // const timestampData = data;
  // console.log(" stamp date:", timestampData);

  // const timestamp = new Timestamp(timestampData?.seconds, timestampData?.nanoseconds);
  // console.log(" stamp:", timestamp);

  // Convert the Firestore Timestamp to a JavaScript Date object
  // const jsDate = timestamp.toDate();
  // console.log(" Date:", jsDate);


  // Format the date as a string (e.g., "MM/DD/YYYY HH:MM:SS")
  // const formattedDate = jsDate.toLocaleString();

  // console.log("Formatted Date:", formattedDate);


  // const date = StampDate?.toDate();

  // Format the date and time
  // const formattedDate = date?.toLocaleDateString();
  // console.log("DATE)


  const { data: lengthData, isLoading: lengthLoading, isError: lengthError } = useQuery(
    ['Orders'],
    async () => {

      const response = await OrderApi.getAllOrders();
      return response;// Assuming your API returns data property

    }
  );
  const PickupTasks = lengthData?.filter((task) => task.status === "Pickup");
  const CanceledTasks = lengthData?.filter((task) => task.status === "Canceled");
  const CompletedTasks = lengthData?.filter((task) => task.status === "Completed");
  const NewTasks = lengthData?.filter((task) => task.status === "New");


  return (
    <div className="w-full h-full bg-[F9F9F9] px-4 ">
      <Head>
        <title>Orders</title>
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
                Create Order
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center my-5 px-2 w-full flex-wrap  ">
            <div className="flex overflow-x-scroll md:overflow-x-hidden text-[#777777]">
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "All" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("All");
                  setFilteredOrders(orders);
                }}>
                All Orders {" ("}
                {lengthData?.length}
                {") "}
              </button>
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "Completed" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("Completed");
                  const deliveredOrders = orders.filter(
                    (order) => order.status === "Completed",
                  );
                  setFilteredOrders(deliveredOrders);
                }}>
                Completed {" ("}
                {CompletedTasks?.length}
                {") "}
              </button>
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "New" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("New");
                  const deliveredOrders = orders.filter(
                    (order) => order.status === "New",
                  );
                  setFilteredOrders(deliveredOrders);
                }}>
                New {" ("}
                {NewTasks?.length}
                {") "}
              </button>
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "PickUp" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("PickUp");
                  const pickupOrders = orders.filter(
                    (order) => order.status === "In Progress",
                  );
                  setFilteredOrders(pickupOrders);
                }}>
                PickUp {" ("}
                {PickupTasks?.length}
                {") "}
              </button>
              <button
                className={`uppercase font-[500] mr-3 ${activeButton === "Cancelled" ? "text-[#A51F6C]" : ""
                  }`}
                onClick={() => {
                  setActiveButton("Cancelled");
                  const cancelledOrders = orders.filter(
                    (order) => order.status === "Cancelled",
                  );
                  setFilteredOrders(cancelledOrders);
                }}>
                Cancelled {" ("}
                {CanceledTasks?.length}
                {") "}
              </button>
            </div>
            {/* <div className="flex items-center justify-center w-full sm:w-auto pt-6 sm:mt-0">
              <button
                className={`rounded-md bg-[#2668E81A] border border-[#2668E842] px-3 py-1 text-[#2668e8] font-[500] mr-3`}
                onClick={handleSortByDate}>
                <FilterOutlined style={{ color: "#2668e8" }} />
              </button>
            </div> */}
          </div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          {/* Table */}
          <div className="w-full h-full  px-5 py-4 ">
            <table
              className="w-full hidden lg:table border border-[#DFDFDF] "
              style={{ borderRadius: "30px" }}>
              <thead className=" my-3 fontFamily  border-b border-[DFDFDF] uppercase">
                <tr className="text-[#777777]  text-left px-4 py-2">
                  <th className=" px-2 font-[500] text-center text-sm md:text-[14px]">
                    Order ID
                  </th>
                  <th className="px-3 font-[500] text-center text-sm md:text-[14px]">
                    Customer
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Amount
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Payment
                  </th>
                  {/* <th className="font-[500] text-center text-sm md:text-[14px]">
                    Order Date
                  </th> */}
                  <th className=" font-[500] text-center text-sm md:text-[14px]">
                    Status
                  </th>
                  <th className=" font-[500] text-center text-sm md:text-[14px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {
                  searchResults.length > 0 && searchText !== '' ? searchResults?.map((order) => {
                    return <tr
                      key={order.id}
                      className={`hover:bg-gray-200 border-b border-[DFDFDF] `}>
                      {/* Checkbox column */}
                      <td className="text-center text-[#110F0F]">
                        <p>{order?.orderId || order?.id}</p>
                      </td>
                      <td className="font-[400] text-center ">
                        <p className="text-[#110F0F] text-[14px]">
                          {order.fName} {order.lName}
                        </p>
                      </td>
                      <td className="text-[#110F0F] text-center font-[400] text-[14px]">
                        ${order.amount}
                      </td>
                      <td className="text-[#110F0F] text-center font-[400] text-[14px]">
                        {order.payment}
                      </td>
                      {/* <td className="text-[#110F0F] text-center font-[400] text-[14px]">
                        <p>{order.orderDate}</p>
                      </td> */}
                      <td className=" font-[400] text-[14px] my-2">
                        <p
                          className={`rounded-md px-2 py-1 text-[14px] font-[400] text-center `}
                          style={getStatusStyle(order.status)}>
                          {order.status}
                        </p>
                      </td>{" "}
                      <td className="flex justify-around items-center">

                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item onClick={() => handleEditModalOpen(order)}>
                                <EditOutlined /> Edit
                              </Menu.Item>
                              <Menu.Item
                                onClick={() => { handleDelete(); setSelectedOrderId(order.id) }}
                                className="delete-option"
                              >
                                <DeleteOutlined /> Delete
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={["click"]}
                          placement="bottomRight"
                        // visible={selectedOrderId === order.id}
                        // onVisibleChange={(visible) => {
                        //   if (!visible) {
                        //     setSelectedOrderId(null);
                        //   }
                        // }}
                        >
                          <Button
                            icon={<MoreOutlined />}
                            className="more-button"
                            onClick={() => handleActionsToggle(order.id)}
                          />
                        </Dropdown>
                      </td>
                    </tr>
                  })

                    : searchResults.length === 0 && searchText !== '' ?
                      <h1>No results found</h1> : data?.map((order) => (
                        <tr
                          key={order.id}
                          className={`hover:bg-gray-200 border-b border-[DFDFDF] `}>
                          {/* Checkbox column */}
                          <td className="text-center text-[#110F0F]">
                            <p>{order?.orderId || order?.id}</p>
                          </td>
                          <td className="font-[400] text-center ">
                            <p className="text-[#110F0F] text-[14px]">
                              {order.fName} {order.lName}
                            </p>
                          </td>
                          <td className="text-[#110F0F] text-center font-[400] text-[14px]">
                            ${order.amount}
                          </td>
                          <td className="text-[#110F0F] text-center font-[400] text-[14px]">
                            {order.payment}
                          </td>
                          {/* <td className="text-[#110F0F] text-center font-[400] text-[14px]">
                          <p>{order.orderDate}</p>
                        </td> */}
                          <td className=" font-[400] text-[14px] my-2">
                            <p
                              className={`rounded-md px-2 py-1 text-[14px] font-[400] text-center `}
                              style={getStatusStyle(order.status)}>
                              {order.status}
                            </p>
                          </td>{" "}
                          <td className="flex justify-around items-center">

                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item onClick={() => handleEditModalOpen(order)}>
                                    <EditOutlined /> Edit
                                  </Menu.Item>
                                  <Menu.Item
                                    onClick={() => { handleDelete(); setSelectedOrderId(order.id) }}
                                    className="delete-option"
                                  >
                                    <DeleteOutlined /> Delete
                                  </Menu.Item>
                                </Menu>
                              }
                              trigger={["click"]}
                              placement="bottomRight"
                            // visible={selectedOrderId === order.id}
                            // onVisibleChange={(visible) => {
                            //   if (!visible) {
                            //     setSelectedOrderId(null);
                            //   }
                            // }}
                            >
                              <Button
                                icon={<MoreOutlined />}
                                className="more-button"
                                onClick={() => handleActionsToggle(order.id)}
                              />
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
              </tbody>
            </table>
            <div className="lg:hidden flex flex-col space-y-4">
              {searchResults.length > 0 && searchText !== '' ? searchResults?.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-md border border-grey-500 shadow-md my-5 p-3">
                  <div className="flex justify-between items-center border-b border-[#A51F6C] mt-2 pb-3 flex-wrap w-full">
                    <div className="">
                      <h3 className="font-semibold text-base">Order ID</h3>
                      <p className="text-base">{order.orderId}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base">Customer</h3>
                      <p className="text-base">{order.customer}</p>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-[#A51F6C] flex items-center justify-center">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item onClick={() => handleEditModalOpen(order)}>
                              <EditOutlined /> Edit
                            </Menu.Item>

                          </Menu>
                        }
                        trigger={["click"]}
                        placement="bottomRight"
                      // visible={selectedOrderId === order.id}
                      // onVisibleChange={(visible) => {
                      //   if (!visible) {
                      //     setSelectedOrderId(null);
                      //   }
                      // }}
                      >
                        <Button
                          icon={<MoreOutlined size={26} />}
                          className="more-button"

                          onClick={() => handleActionsToggle(order.id)}
                          style={{ color: "#A51F6C", fontWeight: "bolder" }}
                        />
                      </Dropdown>
                    </div>
                  </div>

                  <div className="flex  items-center mt-2 w-full border-b border-[#A51F6C] pb-3 mt-3 flex-wrap ">
                    <div className=" mr-[30%]">
                      <h3 className="font-semibold text-base">Payment</h3>
                      <p className="text-base">{order.payment}</p>
                    </div>
                    {/* <div className="">
                      <h3 className="font-semibold text-base">Order Date</h3>
                      <p className="text-base">{order.orderDate}</p>
                    </div> */}
                  </div>

                  <div className="flex justify-between items-center pb-3 mt-3 w-full flex-wrap">
                    <div>
                      <p className="font-semibold text-lg">Price</p>
                      <p className="font-[600] text-blue-600 text-lg">
                        ${order.amount}
                      </p>
                    </div>

                    <p
                      className={`rounded-md px-2 py-1 text-[18px] font-[400] text-center `}
                      style={getStatusStyle(order.status)}>
                      {order.status}
                    </p>
                  </div>
                </div>)) : searchResults.length === 0 && searchText !== '' ?
                <h1>No results found</h1> :
                data?.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-md border border-grey-500 shadow-md my-5 p-3">
                    <div className="flex justify-between items-center border-b border-[#A51F6C] mt-2 pb-3 flex-wrap w-full">
                      <div className="">
                        <h3 className="font-semibold text-base">Order ID</h3>
                        <p className="text-base">{order.orderId}</p>
                      </div>


                      <div className="w-10 h-10 rounded-full border border-[#A51F6C] flex items-center justify-center">
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item onClick={() => handleEditModalOpen(order)}>
                                <EditOutlined /> Edit
                              </Menu.Item>

                            </Menu>
                          }
                          trigger={["click"]}
                          placement="bottomRight"
                        // visible={selectedOrderId === order.id}
                        // onVisibleChange={(visible) => {
                        //   if (!visible) {
                        //     setSelectedOrderId(null);
                        //   }
                        // }}
                        >
                          <Button
                            icon={<MoreOutlined size={26} />}
                            className="more-button"

                            onClick={() => handleActionsToggle(order.id)}
                            style={{ color: "#A51F6C", fontWeight: "bolder" }}
                          />
                        </Dropdown>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 w-full border-b border-[#A51F6C] pb-3 mt-3 flex-wrap ">
                      <div>
                        <h3 className="font-semibold text-base">Customer</h3>
                        <p className="text-base">{order.fName}</p>
                      </div>

                      <div className=" mr-[30%]">
                        <h3 className="font-semibold text-base">Payment</h3>
                        <p className="text-base">{order.payment}</p>
                      </div>
                      {/* <div className="">
                      <h3 className="font-semibold text-base">Order Date</h3>
                      <p className="text-base">{order.orderDate}</p>
                    </div> */}
                    </div>

                    <div className="flex justify-between items-center pb-3 mt-3 w-full flex-wrap">
                      <div>
                        <p className="font-semibold text-lg">Price</p>
                        <p className="font-[600] text-blue-600 text-lg">
                          ${order.amount}
                        </p>
                      </div>

                      <p
                        className={`rounded-md px-2 py-1 text-[18px] font-[400] text-center `}
                        style={getStatusStyle(order.status)}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              <Pagination
                current={currentPage}
                pageSize={ITEMS_PER_PAGE}
                total={filteredOrders.length}
                onChange={onPageChange}
                className="my-4 flex justify-center"
              />
            </div>
          </div>
        </div>

        <EditModal
          visible={showModifyModal}
          onCancel={() => setShowModifyModal(false)}
          onOk={({ image: fileListImage, status, ...values }) =>
            handleEditSubmit({ image: fileListImage, status, ...values })
          }
          editForm={editForm}
          selectedOrder={selectedOrder}
        />
        <Modal
          title="Confirm Deletion"
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onOk={() => { console.log("DELETE", selectedOrder); deleteMutation.mutate(selectedOrderId) }}
          okText="Yes"
          cancelText="No"
          okButtonProps={{
            style: { backgroundColor: "#D83535", color: "#FFFFFF" },
          }}>
          <p>Are you sure you want to delete the selected Order?</p>
        </Modal>

        <OrderModal
          visible={showOrderModal}
          onCancel={() => setShowOrderModal(false)}
          onSubmit={() => console.log("submitted")}
        />
      </div>
    </div>
  );
};

export default Index;
