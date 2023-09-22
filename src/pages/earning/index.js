"use client";

import {
  Pagination,
  Checkbox,
  Modal
} from "antd";
import Image from "next/image";
import Head from "next/head";
import { SearchOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FilterOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OrderApi from "@/lib/order";
import SellerApi from "@/lib/sellers";
import UserApi from "@/lib/buyer";

const Index = () => {
  const earnings = [
    {
      id: 1,
      image: "/images/products1.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 2,
      image: "/images/product2.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 3,
      image: "/images/product3.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 4,
      image: "/images/products1.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 5,
      image: "/images/product2.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 6,
      image: "/images/product3.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 7,
      image: "/images/products1.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 8,
      image: "/images/product2.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
    {
      id: 9,
      image: "/images/product3.svg",
      seller: "James William",
      product: "AFO Standard",
      amount: 146.0,
      buyer: "James Williams",
      commission: 14.0,
    },
  ];

  const ITEMS_PER_PAGE = 5;

  const [pageContent, setPageContent] = useState(earnings.slice(0, ITEMS_PER_PAGE));
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const onPageChange = (page) => {
    setCurrentPage(page);
    setPageContent(earnings.slice(startIndex, endIndex));
  };

  const handleCheckboxChange = (productId) => {
    setPageContent((prevContent) => {
      const updatedContent = prevContent.map((content) =>
        content.id === productId
          ? { ...content, selected: !content.selected }
          : content,
      );

      const updatedSelectedIds = updatedContent
        .filter((content) => content.selected)
        .map((content) => content.id);

      setSelectedProductIds(updatedSelectedIds);

      return updatedContent;
    });
  };
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setPageContent((prevContent) =>
      prevContent.map((content) => ({
        ...content,
        selected: !selectAll,
      }))
    );

    setSelectedProductIds(
      !selectAll ? pageContent.map((content) => content.id) : []
    );
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmationModal(true);
  };

  const handleDeleteConfirmed = () => {
    console.log("Delete");
  }


  const { data: CompletedData, isLoading: CompletedLoading, isError: CompletedError } = useQuery(
    ['Orders'],
    async () => {

      const response = await OrderApi.getOrders("Completed");
      return response;// Assuming your API returns data property

    }
  );
  console.log("CompletedData", CompletedData)
  const ids = CompletedData?.map(seller => seller.sellerIds);
  const BuyerIds = CompletedData?.map(buyer => buyer.buyerId);

  console.log("IDS", ids)

  const { data: SellerData, isLoading: SellerLoading, isError: SellerError } = useQuery(
    ['Sellers'],
    async () => {

      const response = await SellerApi.getUsersByUserIds(ids);
      return response;// Assuming your API returns data property

    }
  );
  console.log("SellerData", SellerData)

  const { data: BuyerData, isLoading: BuyerLoading, isError: BuyerError } = useQuery(
    ['Users'],
    async () => {

      const response = await UserApi.getUserByUserId(BuyerIds)
      return response;// Assuming your API returns data property

    }
  );
  console.log("BUYER", BuyerData)



  const concatenatedArray = [];

  // Iterate over each sellerId in CompletedData
  CompletedData?.forEach(obj1 => {

    const matchingObjs = SellerData?.filter(obj2 =>
      obj1.sellerIds?.some(id => id === obj2.id)
    );
    console.log("MATCHING", matchingObjs);

    if (matchingObjs?.length > 0) {
      const fNames = matchingObjs.map(matchingObj => matchingObj.fName);

      // Add the array of fNames to obj1
      obj1["fNAMES"] = fNames;

      // Push the modified obj1 into concatenatedArray
      concatenatedArray.push(obj1);
    }
  });




  //   if (matchingObjs?.length > 0) {
  //     // Merge all matching objects from SellerData into obj1
  //     return { ...obj1, ...matchingObjs.reduce((acc, curr) => ({ ...acc, ...curr }), {}) };
  //   } else {
  //     return obj1;
  //   }
  // }).concat(SellerData?.filter(obj2 => !CompletedData?.some(obj1 => obj1.sellerIds.includes(obj2.id))));


  console.log("concatenatedArray", concatenatedArray)



  return (
    <div className="w-full h-full bg-[F9F9F9] px-4 ">
      <Head>
        <title>Earning</title>
      </Head>
      <div className="h-full w-full my-4 py-3  bg-[#FFFFFF] rounded-md">
        <div>
          {/* Table */}
          <div className="w-full h-full  px-5 py-4 ">
            {selectedProductIds.length > 0 && (
              <div className="flex justify-end mb-3">
                <button
                  className="flex items-center justify-center py-2 rounded-md px-4 bg-[#D83535] text-[white]"
                  onClick={handleDeleteConfirmation}>
                  <DeleteOutlined
                    style={{ fontSize: "17px", color: "#FFFFFF", marginRight: 3 }}
                  />
                  Delete
                </button>
              </div>
            )}

            <table
              className="w-full hidden lg:table border border-[#DFDFDF] "
              style={{ borderRadius: "30px" }}>
              <thead className="my-3 fontFamily border-b border-[DFDFDF] uppercase">
                <tr className="text-[#777777] text-left px-4 py-2">

                  <th className=" font-[500] text-center text-sm md:text-[14px]">
                    Seller
                  </th>
                  <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                    Order Id
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Amount
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Payment Method
                  </th>
                  <th className="font-[500] text-center text-sm md:text-[14px]">
                    Commission
                  </th>
                </tr>
              </thead>

              <tbody>
                {concatenatedArray.length > 0 ? concatenatedArray?.map((content) => (
                  <tr
                    key={content.id}
                    className={`hover:bg-gray-200 border-b border-[DFDFDF] 
                      }`}>
                    {/* Checkbox column */}
                    <td className="font-[400] text-center">
                      <div className="flex items-center justify-center">

                        <p className="text-[#110F0F] text-[14px]">
                          {content?.fName} {content?.lName}                        </p>
                      </div>

                    </td>


                    <td className="font-[400] text-center">
                      <p
                        className="rounded-md px-2 py-1 text-[14px] font-[400] text-center">
                        {content?.orderId}
                      </p>
                    </td>

                    <td className="font-[400] text-center">
                      <p
                        className="rounded-md px-2 py-1 text-[14px] font-[400] text-center">
                        ${content.amount}
                      </p>
                    </td>

                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        {content.payment}
                      </p>
                    </td>
                    <td className="font-[400] text-center">
                      <p className="text-[#110F0F] text-[14px]">
                        ${content?.commission}
                      </p>
                    </td>

                  </tr>
                )) : <h1 className="flex justify-start  items-center">Earning not available</h1>}
              </tbody>
            </table>
            <div className="lg:hidden flex flex-col space-y-4">
              {concatenatedArray.length > 0 ? concatenatedArray?.map((earning) => (
                <div
                  key={earning.id}
                  className="bg-white rounded-md border border-grey-500 shadow-md my-5 py-3 px-4 flex flex-col"
                >
                  <div className="flex justify-between items-center border-b border-[#A51F6C] pb-3 w-full">
                    <div className="flex items-center">
                      {/* <div className="w-20 h-20 rounded-md overflow-hidden flex items-center justify-center">
                        <Image
                          src={earning.image}
                          width={80}
                          height={80}
                          alt="Product"
                        />
                      </div> */}
                      <div className="ml-4">
                        <h3 className="font-semibold text-base">Order Id: {earning.orderId}</h3>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full px-[6%] sm:px-auto">
                    <div className="">
                      <h3 className="font-semibold text-base">Seller:</h3>
                      <p className="text-base">   {earning?.fName} {earning?.lName}    </p>
                    </div>
                    <div className="">
                      <h3 className="font-semibold text-base">Payment Method:</h3>
                      <p className="text-base">{earning.payment}</p>
                    </div>

                  </div>

                  <div className="flex justify-between items-center pb-3 mt-3 w-full px-[6%] sm:px-auto">
                    <div>
                      <p className="font-semibold text-lg">Amount</p>
                      <p className="font-[600] text-blue-600 text-lg">${earning.amount}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Commission:</h3>
                      <p className="font-[600] text-blue-600 text-lg">${earning.commission}</p>
                    </div>
                  </div>
                </div>
              )) : <h1 className="flex justify-start  items-center">Earning not available</h1>}
              {/* <Pagination
                current={currentPage}
                pageSize={ITEMS_PER_PAGE}
                total={earnings.length}
                onChange={onPageChange}
                className="my-4 flex justify-center"
              /> */}
            </div>
            <Modal
              title="Confirm Deletion"
              visible={showDeleteConfirmationModal}
              onCancel={() => setShowDeleteConfirmationModal(false)}
              onOk={handleDeleteConfirmed}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: { backgroundColor: "#D83535", color: "#FFFFFF" },
              }}
            >
              <p>Are you sure you want to delete these items?</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
