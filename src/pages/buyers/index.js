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
import { EditOutlined } from "@ant-design/icons";
import BuyerModal from "../../components/Buyers/buyerModal";
import EditModal from "../../components/Buyers/EditModal";
import moment from 'moment';
const { Option } = Select;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BuyerApi from "@/lib/buyer";
import firebase from '../../../Firebase/firebase'; // Import your Firebase configuration.
import {
  collection,
  addDoc, doc, getDoc, setDoc, where, query, getDocs
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";
import { localeData } from "moment/moment";

const Index = () => {
  const ITEMS_PER_PAGE = 5;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    ["Buyers"],
    async (id) => {
      console.log("MUTATION", id)
      await BuyerApi.deleteUser(id);
    },
    {
      onError: (data) => { },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Buyer deleted successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Buyers"]);
        setShowDeleteConfirmationModal(false)
        setEditModalVisible(false)
      },
    }
  );

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const snapshot = collection(db, "Users");

    // Perform a query to filter documents that match the search text.
    const querySnapshot = await getDocs(
      query(snapshot, where('firstName', '>=', searchText), where('firstName', '<=', searchText + '\uf8ff'))
    );

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });

    setSearchResults(results);
  };


  const { data, isLoading, isError } = useQuery(
    ['Buyers'],
    async () => {

      const response = await BuyerApi.getUsers();
      return response;// Assuming your API returns data property

    }
  );


  const buyers = [
    {
      id: 1,
      image: "/images/buyer1.svg",
      name: "James Wiliams",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 2,
      image: "/images/buyer2.svg",
      name: "John Doe",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 3,
      image: "/images/buyer3.svg",
      name: "Steve Smith",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 4,
      image: "/images/buyer4.svg",
      name: "James Anderson",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 5,
      image: "/images/buyer1.svg",
      name: "Steve Smith",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 6,
      image: "/images/buyer2.svg",
      name: "John Doe",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 7,
      image: "/images/buyer3.svg",
      name: "James Anderson",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 8,
      image: "/images/buyer4.svg",
      name: "James Anderson",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
    {
      id: 9,
      image: "/images/buyer1.svg",
      name: "James Anderson",
      registered: "Aug 06,2023",
      country: "USA",
      group: "Default",
      spent: 14676.00,
    },
  ];

  const [selectedBuyerId, setSelectedBuyerId] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [activeButton, setActiveButton] = useState("All");
  const [filteredBuyers, setFilteredBuyers] = useState(buyers);
  const [sortByDate, setSortByDate] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmationModal(true);
  };

  const handleDeleteConfirmed = () => {
    const updatedBuyers = buyers.filter(
      (buyer) => !selectedBuyerIds.includes(buyer.id),
    );
    setFilteredBuyers(updatedBuyers);
    setSelectedBuyerIds([]);
    setShowDeleteConfirmationModal(false);

    message.success("Selected buyer deleted successfully.");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBuyerIds, setSelectedBuyerIds] = useState([]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (productId) => {
    setFilteredBuyers((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId
          ? { ...product, selected: !product.selected }
          : product,
      );

      const updatedSelectedIds = updatedProducts
        .filter((product) => product.selected)
        .map((product) => product.id);

      setSelectedBuyerIds(updatedSelectedIds);

      return updatedProducts;
    });
  };

  const handleActionsToggle = (buyerId) => {
    setSelectedBuyerId(null);

    setSelectedBuyerId(buyerId);
    const buyer = data?.find((b) => b.id === buyerId);
    setSelectedBuyer(buyer);
  };

  const handleEditSubmit = ({
    image: fileListImage,
    group,
    spent,
    ...values
  }) => {
    const numericSpent = parseFloat(spent);

    if (isNaN(numericSpent)) {
      message.error("Invalid spent value");
      return;
    }

    const updatedBuyers = filteredBuyers.map((buyer) =>
      buyer.id === selectedBuyer.id
        ? {
          ...buyer,
          ...values,
          image: fileListImage,
          group,
          spent: numericSpent,
        }
        : buyer
    );

    setFilteredBuyers(updatedBuyers);
    setEditModalVisible(false);

    message.success("Buyer updated successfully.");
  };

  const handleEditModalOpen = (buyer) => {
    setSelectedBuyer(buyer);
    // setShowActions(false);
    // const registeredDate = moment(buyer.registered, 'MMM DD,YYYY');

    editForm.setFieldsValue({
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      region: buyer.region,
      city: buyer.city,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      postCode: buyer.postCode,
    });

    setEditModalVisible(true);
  };


  const handleDeleteEach = (sellerID) => {
    setSelectedBuyerId(sellerID);

    handleDeleteConfirmation();
  };
  console.log("ID", selectedBuyerId)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handleBuyerModal = () => {
    setShowCustomerModal(true)
    console.log(showCustomerModal)
  }


  const handleHeaderCheckboxChange = () => {
    const newSelectAll = !selectedBuyerIds.length || selectedBuyerIds.length !== filteredBuyers.length;
    const updatedBuyers = filteredBuyers.map((buyer) => ({
      ...buyer,
      selected: newSelectAll,
    }));
    setFilteredBuyers(updatedBuyers);
    setSelectedBuyerIds(newSelectAll ? buyers.map((buyer) => buyer.id) : []);
  };

  if (isLoading) {
    // Render a loading indicator
    return <div>Loading...</div>;
  }

  if (isError) {
    // Handle the error, e.g., display an error message
    return <div>Error fetching data</div>;
  }



  return (
    <div className="w-full h-full bg-[F9F9F9] px-4 ">
      <Head>
        <title>Buyers</title>
      </Head>
      <div className="h-full w-full my-4 py-3  bg-[#FFFFFF] rounded-md">
        <div className="w-full  px-3  py-1 border-b border-[#DFDFDF]">
          <div className="flex justify-between items-center w-full px-3 pb-4 flex-wrap-reverse">
            <div className="relative flex items-center w-full sm:w-auto">
              <Image
                src="/images/search.svg"
                className="text-gray-500 absolute top-[13px] left-4 z-10"
                width={15}
                height={15}
              />
              <Input
                placeholder="Search Sellers..."
                className={` fontFamily pl-10 py-2 text-[#777777]`}
                style={{ borderRadius: "5px" }}
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); handleSearch(); }} />

            </div>
            <div className="flex items-center w-full sm:w-auto">
              <Button
                type="primary"
                className="create-order-button w-full sm:w-auto mb-4 sm:mb-0"
                onClick={handleBuyerModal}
                style={{
                  backgroundColor: "#A51F6C",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  height: "45px",
                }}>
                Add Buyer
              </Button>
            </div>
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

                  <th className=" font-[500] text-center text-sm md:text-[14px]">
                    First  Name
                  </th>
                  <th className=" font-[500] text-center text-sm md:text-[14px]">
                    Last  Name
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Address
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    City
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Phone
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Email
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Post Code
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Region
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {searchResults.length > 0 && searchText !== '' ? searchResults?.map((seller) => (
                  <tr
                    key={seller?.id}
                    className={`hover:bg-gray-200 border-b border-[DFDFDF] ${seller.selected ? "bg-[#F4F4F4]" : ""
                      }`}
                  >

                    {/* Seller Image */}
                    <td className="">
                      <div className="flex justify-center items-center ml-[10%]">

                        <p className="text-[#110F0F] text-[14px]">
                          {seller?.firstName}
                        </p>
                      </div>
                    </td>

                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {seller?.lastName}
                      </p>
                    </td>

                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {seller?.address}
                      </p>
                    </td>

                    <td className="font-[400] text-center">
                      <p
                        className="rounded-md px-2 py-1 text-[14px] font-[400] text-center"
                      >
                        {seller.city}
                      </p>
                    </td>

                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {seller?.phone}
                      </p>
                    </td>

                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {seller?.email}
                      </p>
                    </td>
                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {seller?.postCode}
                      </p>
                    </td>
                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {seller?.region}
                      </p>
                    </td>
                    {/* Actions */}
                    <td className="flex justify-around items-center">
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item
                              onClick={() => handleEditModalOpen(seller)}
                            >
                              <EditOutlined /> Edit
                            </Menu.Item>
                            <Menu.Item
                              onClick={() => { handleDeleteEach(seller?.id) }}
                              className="delete-option"
                            >
                              <DeleteOutlined /> Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                        placement="bottomRight"
                      // visible={selectedSellerId === seller.id}
                      // onVisibleChange={(visible) => {
                      //   if (!visible) {
                      //     setSelectedSellerId(null);
                      //   }
                      // }}
                      >
                        <Button
                          icon={<MoreOutlined />}
                          className="more-button"
                          onClick={() => handleActionsToggle(seller.id)}
                        />
                      </Dropdown>
                    </td>
                  </tr>
                )) : searchResults.length === 0 && searchText !== '' ?
                  <h1>No results found</h1> : data?.map((seller) => (
                    <tr
                      key={seller?.id}
                      className={`hover:bg-gray-200 border-b border-[DFDFDF] ${seller.selected ? "bg-[#F4F4F4]" : ""
                        }`}
                    >
                      {/* Seller Image */}
                      <td className="">
                        <div className="flex justify-center items-center ml-[10%]">

                          <p className="text-[#110F0F] text-[14px]">
                            {seller?.firstName}
                          </p>
                        </div>
                      </td>

                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {seller?.lastName}
                        </p>
                      </td>

                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {seller?.address}
                        </p>
                      </td>

                      <td className="font-[400] text-center">
                        <p
                          className="rounded-md px-2 py-1 text-[14px] font-[400] text-center"
                        >
                          {seller.city}
                        </p>
                      </td>

                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {seller?.phone}
                        </p>
                      </td>

                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {seller?.email}
                        </p>
                      </td>
                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {seller?.postCode}
                        </p>
                      </td>
                      <td className="font-[400] text-center">
                        <p className="text-[#110F0F] text-[14px]">
                          {seller?.region}
                        </p>
                      </td>
                      {/* Actions */}
                      <td className="flex justify-around items-center">
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item
                                onClick={() => handleEditModalOpen(seller)}
                              >
                                <EditOutlined /> Edit
                              </Menu.Item>
                              <Menu.Item
                                onClick={() => { handleDeleteEach(seller?.id) }}
                                className="delete-option"
                              >
                                <DeleteOutlined /> Delete
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={["click"]}
                          placement="bottomRight"
                        // visible={selectedSellerId === seller.id}
                        // onVisibleChange={(visible) => {
                        //   if (!visible) {
                        //     setSelectedSellerId(null);
                        //   }
                        // }}
                        >
                          <Button
                            icon={<MoreOutlined />}
                            className="more-button"
                            onClick={() => handleActionsToggle(seller.id)}
                          />
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="lg:hidden flex flex-col space-y-4">
              {searchResults.length > 0 && searchText !== '' ? searchResults?.map((buyer) => (
                <div
                  key={buyer.id}
                  className="bg-white rounded-md border border-grey-500 shadow-md my-5 py-3 px-4 flex flex-col">
                  <div className="flex justify-between items-center border-b border-[#A51F6C] pb-3 w-full">
                    <div className="flex items-center">
                      {/* <div className="w-20 h-20 rounded-md overflow-hidden  flex items-center justify-center">
                        <Image
                          src={buyer.image}
                          width={80}
                          height={80}
                          alt="Product"
                        />
                      </div> */}
                      <div className="">
                        <h3 className="font-semibold text-base">Buyer Id: {buyer.id}</h3>
                        <h3 className="font-semibold text-base">Name: {buyer.firstName}</h3>
                      </div>
                    </div>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item onClick={() => handleEditModalOpen(buyer)}>
                            <EditOutlined /> Edit
                          </Menu.Item>
                          <Menu.Item onClick={() => { handleDeleteEach(buyer.id) }} className="delete-option">
                            <DeleteOutlined /> Delete
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={["click"]}
                      placement="bottomRight"
                      visible={selectedBuyerId === buyer.id}
                      onVisibleChange={(visible) => {
                        if (!visible) {
                          // setSelectedBuyerId(null);
                        }
                      }}>
                      <Button icon={<MoreOutlined />} className="more-button rounded-full border border-[#A51F6C]" onClick={() => handleActionsToggle(buyer.id)} />
                    </Dropdown>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full  sm:px-auto">
                    <div className="mr-[30%]">
                      <h3 className="font-semibold text-base">Region:</h3>
                      <p className="text-base">{buyer.region}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">City:</h3>
                      <p className="text-base">{buyer.city}</p>
                    </div>
                  </div>

                  <div className="flex wrap   border-b border-[#A51F6C] justify-between items-center pb-3 mt-3 w-full  sm:px-auto">
                    <div className="flex-wrap">
                      <p className="font-semibold text-lg">Email</p>
                      <p className="font-[600] text-blue-600 text-lg">{buyer.email}</p>
                    </div>


                  </div>

                  <div className="flex justify-between  border-b border-[#A51F6C] items-center pb-3 mt-3 w-full  sm:px-auto">

                    <div>
                      <p className="font-semibold text-lg">Phone Number</p>
                      <p
                        className={` text-[18px] font-[400] text-center `}
                      >
                        {buyer.phone}
                      </p>
                    </div>

                  </div>
                  <div className="flex justify-between items-center pb-3 mt-3 w-full  sm:px-auto">
                    <div>
                      <p className="font-semibold text-lg">Address</p>
                      <p className="font-[600] text-blue-600 text-lg">{buyer.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Post Code</p>
                      <p
                        className={` text-[18px] font-[400] text-center `}
                      >
                        {buyer.postCode}
                      </p>
                    </div>

                  </div>
                </div>
              )) : searchResults.length === 0 && searchText !== '' ?
                <h1>No results found</h1> : data.slice(startIndex, endIndex).map((buyer) => (
                  <div
                    key={buyer.id}
                    className="bg-white rounded-md border border-grey-500 shadow-md my-5 py-3 px-4 flex flex-col">
                    <div className="flex justify-between items-center border-b border-[#A51F6C] pb-3 w-full">
                      <div className="flex items-center">
                        {/* <div className="w-20 h-20 rounded-md overflow-hidden  flex items-center justify-center">
                        <Image
                          src={buyer.image}
                          width={80}
                          height={80}
                          alt="Product"
                        />
                      </div> */}
                        <div className="">
                          <h3 className="font-semibold text-base">Buyer Id: {buyer.id}</h3>
                          <h3 className="font-semibold text-base">Name: {buyer.firstName}</h3>
                        </div>
                      </div>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item onClick={() => handleEditModalOpen(buyer)}>
                              <EditOutlined /> Edit
                            </Menu.Item>
                            <Menu.Item onClick={() => { handleDeleteEach(buyer.id) }} className="delete-option">
                              <DeleteOutlined /> Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                        placement="bottomRight"
                        visible={selectedBuyerId === buyer.id}
                        onVisibleChange={(visible) => {
                          if (!visible) {
                            // setSelectedBuyerId(null);
                          }
                        }}>
                        <Button icon={<MoreOutlined />} className="more-button rounded-full border border-[#A51F6C]" onClick={() => handleActionsToggle(buyer.id)} />
                      </Dropdown>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full  sm:px-auto">
                      <div className="mr-[30%]">
                        <h3 className="font-semibold text-base">Region:</h3>
                        <p className="text-base">{buyer.region}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">City:</h3>
                        <p className="text-base">{buyer.city}</p>
                      </div>
                    </div>

                    <div className="flex wrap   border-b border-[#A51F6C] justify-between items-center pb-3 mt-3 w-full  sm:px-auto">
                      <div className="flex-wrap">
                        <p className="font-semibold text-lg">Email</p>
                        <p className="font-[600] text-blue-600 text-lg">{buyer.email}</p>
                      </div>


                    </div>

                    <div className="flex justify-between  border-b border-[#A51F6C] items-center pb-3 mt-3 w-full  sm:px-auto">

                      <div>
                        <p className="font-semibold text-lg">Phone Number</p>
                        <p
                          className={` text-[18px] font-[400] text-center `}
                        >
                          {buyer.phone}
                        </p>
                      </div>

                    </div>
                    <div className="flex justify-between items-center pb-3 mt-3 w-full  sm:px-auto">
                      <div>
                        <p className="font-semibold text-lg">Address</p>
                        <p className="font-[600] text-blue-600 text-lg">{buyer.address}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Post Code</p>
                        <p
                          className={` text-[18px] font-[400] text-center `}
                        >
                          {buyer.postCode}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}
              <Pagination
                current={currentPage}
                pageSize={ITEMS_PER_PAGE}
                total={filteredBuyers.length}
                onChange={onPageChange}
                className="my-4 flex justify-center"
              />
            </div>

          </div>
        </div>

        <BuyerModal
          visible={showCustomerModal}
          onCancel={() => setShowCustomerModal(false)}
          onSubmit={() => {
            setShowCustomerModal(false)
            message.success("Buyer Added!")
          }
          }
        />

        <EditModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onOk={({ image: fileListImage, status, ...values }) =>
            handleEditSubmit({ image: fileListImage, status, ...values })
          }
          editForm={editForm}
          selectedBuyer={selectedBuyer}
        />




        <Modal
          title="Confirm Deletion"
          visible={showDeleteConfirmationModal}
          onCancel={() => setShowDeleteConfirmationModal(false)}
          onOk={() => { console.log("DELETE", selectedBuyerId); deleteMutation.mutate(selectedBuyerId) }} okText="Yes"
          cancelText="No"
          okButtonProps={{
            style: { backgroundColor: "#D83535", color: "#FFFFFF" },
          }}>
          <p>Are you sure you want to delete the selected buyer?</p>
        </Modal>

      </div>
    </div>

  );
};

export default Index;
