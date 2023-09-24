import { useState, useEffect } from "react";
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
import {
    SearchOutlined,
    DeleteOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
// import SellerModal from "../../components/Sellers/SellerModal";
import EditModal from "../../components/Messages/index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MessagesApi from "@/lib/contactUs";
import firebase from '../../../Firebase/firebase'; // Import your Firebase configuration.
import {
    collection,
    addDoc, doc, getDoc, setDoc, where, query, getDocs
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";


const { Option } = Select;

const Index = ({ Messages }) => {

    const queryClient = useQueryClient();

    const deleteMutation = useMutation(
        ["Messages"],
        async (id) => {
            await MessagesApi.deleteContactUs(id);
        },
        {
            onError: (data) => { },
            onSuccess: () => {

                notification.open({
                    type: "success",
                    message: "Message deleted successfully!",
                    placement: "top",
                });
                queryClient.invalidateQueries(["Messages"]);
                setShowDeleteConfirmationModal(false)
                setEditModalVisible(false)
            },
        }
    );

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        const snapshot = collection(db, "ContactUs");

        // Perform a query to filter documents that match the search text.
        const querySnapshot = await getDocs(
            query(snapshot, where('name', '>=', searchText), where('name', '<=', searchText + '\uf8ff'))
        );

        const results = [];
        querySnapshot.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id });
        });

        setSearchResults(results);
    };

    console.log("search", searchResults)


    const ITEMS_PER_PAGE = 5;
    const Orders = [
        {
            id: 1,
            image: "/images/seller1.svg",
            name: "Michael Johnson",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 20000.00,
        },
        {
            id: 2,
            image: "/images/seller2.svg",
            name: "Emily Brown",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 18000.00,
        },
        {
            id: 3,
            image: "/images/seller3.svg",
            name: "David Wilson",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 25000.00,
        },
        {
            id: 4,
            image: "/images/seller4.svg",
            name: "Sarah Johnson",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 22000.00,
        },
        {
            id: 5,
            image: "/images/seller1.svg",
            name: "David Wilson",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 28000.00,
        },
        {
            id: 6,
            image: "/images/seller2.svg",
            name: "Emily Brown",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 19000.00,
        },
        {
            id: 7,
            image: "/images/seller3.svg",
            name: "Michael Johnson",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 23000.00,
        },
        {
            id: 8,
            image: "/images/seller4.svg",
            name: "Michael Johnson",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 21000.00,
        },
        {
            id: 9,
            image: "/images/seller1.svg",
            name: "Michael Johnson",
            registered: "Aug 06, 2023",
            country: "USA",
            group: "Default",
            earn: 24000.00,
        },
    ];

    const { data, isLoading, isError } = useQuery(
        ['Messages'],
        async () => {

            const response = await MessagesApi.getContactUs();
            return response;// Assuming your API returns data property

        }
    );
    console.log("MESSAGES", data)


    const [selectedSellerId, setSelectedSellerId] = useState(null);
    const [showSellerModal, setShowSellerModal] = useState(false);
    const [activeButton, setActiveButton] = useState("All");
    const [filteredSellers, setFilteredSellers] = useState(data);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [selectedSeller, setSelectedSeller] = useState(null);

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirmationModal(true);
    };


    const handleDeleteConfirmed = () => {
        const updatedSellers = sellers.filter(
            (seller) => !selectedSellerIds.includes(seller.id)
        );
        setFilteredSellers(updatedSellers);
        setSelectedSellerIds([]);
        setShowDeleteConfirmationModal(false);

        message.success("Selected seller deleted successfully.");
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSellerIds, setSelectedSellerIds] = useState([]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxChange = (sellerId) => {
        setFilteredSellers((prevSellers) => {
            const updatedSellers = prevSellers.map((seller) =>
                seller.id === sellerId
                    ? { ...seller, selected: !seller.selected }
                    : seller
            );

            const updatedSelectedIds = updatedSellers
                .filter((seller) => seller.selected)
                .map((seller) => seller.id);

            setSelectedSellerIds(updatedSelectedIds);

            return updatedSellers;
        });
    };

    const handleActionsToggle = (sellerId) => {
        // setSelectedSellerId(null);
        console.log("SELLER ID", sellerId)
        setSelectedSellerId(sellerId);
        const seller = data.find((s) => s.id === sellerId);
        console.log("SELLER with id", seller)

        setSelectedSeller(seller);
    };

    const handleEditSubmit = ({
        image: fileListImage,
        group,
        earn,
        ...values
    }) => {
        const numericEarn = parseFloat(earn);

        if (isNaN(numericEarn)) {
            message.error("Invalid earn value");
            return;
        }

        const updatedSellers = filteredSellers.map((seller) =>
            seller.id === selectedSeller.id
                ? {
                    ...seller,
                    ...values,
                    image: fileListImage,
                    group,
                    earn: numericSpent,
                }
                : seller
        );

        setFilteredSellers(updatedSellers);
        setEditModalVisible(false);

        message.success("Seller updated successfully.");
    };

    const handleEditModalOpen = (seller) => {
        setSelectedSeller(seller);
        console.log("SELLER INfO", seller)


        // const registeredDate = moment(seller.registered, 'MMM DD,YYYY');

        editForm.setFieldsValue({
            id: seller.id,
            fName: seller.fName,
            register: seller.register,
            country: seller.country,
            email: seller.email,
            phone: seller.phone,
        });

        setEditModalVisible(true);
    };

    const handleDeleteEach = (sellerId) => {
        console.log("SELECTED", sellerId)
        setSelectedSellerId(sellerId);
        handleDeleteConfirmation();
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const handleSellerModal = () => {
        setShowSellerModal(true);
    };

    const handleHeaderCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setFilteredSellers((prevSellers) => {
            const updatedSellers = prevSellers.map((seller) => ({
                ...seller,
                selected: isChecked,
            }));

            const updatedSelectedIds = isChecked
                ? updatedSellers.map((seller) => seller.id)
                : [];

            setSelectedSellerIds(updatedSelectedIds);

            return updatedSellers;
        });
    };

    console.log("FILTER", filteredSellers)


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
                <title>Sellers</title>
            </Head>
            <div className="h-full w-full my-4 py-3  bg-[#FFFFFF] rounded-md">
                <div className="w-full px-3  py-1 border-b border-[#DFDFDF]">
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
                                onChange={(e) => { setSearchText(e.target.value); handleSearch(); }}
                            />

                        </div>
                        {/* <div className="flex items-center w-full sm:w-auto">
                            <Button
                                type="primary"
                                className="create-order-button w-full sm:w-auto mb-4 sm:mb-0"
                                onClick={handleSellerModal}
                                style={{
                                    backgroundColor: "#A51F6C",
                                    color: "#FFFFFF",
                                    borderRadius: "8px",
                                    height: "45px",
                                }}
                            >
                                Add Seller
                            </Button>
                        </div> */}
                    </div>
                </div>
                <div>
                    {/* Table */}
                    <div className="w-full h-full  px-5 py-4 ">


                        <table
                            className="w-full hidden lg:table border border-[#DFDFDF] "
                            style={{ borderRadius: "30px" }}
                        >
                            <thead className="my-3 fontFamily border-b border-[DFDFDF] uppercase">
                                <tr className="text-[#777777] text-left px-4 py-2">

                                    <th className=" font-[500] text-center text-sm md:text-[14px]">
                                        Name
                                    </th>
                                    <th className=" font-[500] text-center text-sm md:text-[14px]">
                                        Email
                                    </th>
                                    <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                                        Subject
                                    </th>
                                    <th className="font-[500] text-center text-sm md:text-[14px]">
                                        Messages
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
                                            <div className="flex items-center ml-[10%]">

                                                <p className="text-[#110F0F] text-[14px]">
                                                    {seller?.name}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="font-[400] text-center">
                                            <p className="text-[#110F0F] text-[14px]">
                                                {seller?.email}
                                            </p>
                                        </td>

                                        <td className="font-[400] text-center">
                                            <p className="text-[#110F0F] text-[14px]">
                                                {seller?.subject}
                                            </p>
                                        </td>

                                        <td className="font-[400] text-center">
                                            <p
                                                className="rounded-md px-2 py-1 text-[14px] font-[400] text-center"
                                            >
                                                {seller.message}
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
                                                            onClick={() => { console.log("ID", seller.id); handleDeleteEach(seller.id) }}
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
                                                <div className="flex items-center ml-[10%]">

                                                    <p className="text-[#110F0F] text-[14px]">
                                                        {seller?.name}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="font-[400] text-center">
                                                <p className="text-[#110F0F] text-[14px]">
                                                    {seller?.email}
                                                </p>
                                            </td>

                                            <td className="font-[400] text-center">
                                                <p className="text-[#110F0F] text-[14px]">
                                                    {seller?.subject}
                                                </p>
                                            </td>

                                            <td className="font-[400] text-center">
                                                <p
                                                    className="rounded-md px-2 py-1 text-[14px] font-[400] text-center"
                                                >
                                                    {seller.message}
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
                                                                onClick={() => { console.log("ID", seller?.id); handleDeleteEach(seller?.id) }}
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
                            {searchResults.length > 0 && searchText !== '' ? searchResults?.map((seller) => (
                                <div
                                    key={seller.id}
                                    className="bg-white rounded-md border border-grey-500 shadow-md my-5 py-3 px-4 flex flex-col"
                                >

                                    <div className="flex justify-between items-center border-b border-[#A51F6C] pb-3 w-full">
                                        <div className="flex items-center">

                                            <div className="">
                                                {/* <h3 className="font-semibold text-base">
                                                    Seller Id: {seller.id}
                                                </h3> */}
                                                <h3 className="font-semibold text-base">
                                                    Name: {seller.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleEditModalOpen(seller)}>
                                                        <EditOutlined /> Edit
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        onClick={() => { handleDeleteEach(seller.id) }}
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
                                                className="more-button rounded-full border border-[#A51F6C]"
                                                onClick={() => handleActionsToggle(seller.id)}
                                            />
                                        </Dropdown>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full sm:px-auto">
                                        <div className="mr-[30%]">
                                            <h3 className="font-semibold text-base">Subject:</h3>
                                            <p className="text-base">{seller.subject}</p>
                                        </div>

                                    </div>

                                    <div className="flex  items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full sm:px-auto">

                                        <div className="max-w-[150px]">
                                            <h3 className="font-semibold text-base">Email:</h3>
                                            <p className="text-base ">{seller.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex  justify-between items-center pb-3 mt-3 w-full sm:px-auto">
                                        <div className="max-w-[270px] w-full">
                                            <p className="font-semibold text-lg">Messages</p>
                                            <p className="font-[600] text-blue-600 text-lg">
                                                {seller.message}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            )) : searchResults.length === 0 && searchText !== '' ?
                                <h1>No results found</h1> : data?.map((seller) => (
                                    <div
                                        key={seller.id}
                                        className="bg-white rounded-md border border-grey-500 shadow-md my-5 py-3 px-4 flex flex-col"
                                    >

                                        <div className="flex justify-between items-center border-b border-[#A51F6C] pb-3 w-full">
                                            <div className="flex items-center">

                                                <div className="">
                                                    {/* <h3 className="font-semibold text-base">
                                                    Seller Id: {seller.id}
                                                </h3> */}
                                                    <h3 className="font-semibold text-base">
                                                        Name: {seller.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <Dropdown
                                                overlay={
                                                    <Menu>
                                                        <Menu.Item onClick={() => handleEditModalOpen(seller)}>
                                                            <EditOutlined /> Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => { handleDeleteEach(seller.id) }}
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
                                                    className="more-button rounded-full border border-[#A51F6C]"
                                                    onClick={() => handleActionsToggle(seller.id)}
                                                />
                                            </Dropdown>
                                        </div>

                                        <div className="flex items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full sm:px-auto">
                                            <div className="mr-[30%]">
                                                <h3 className="font-semibold text-base">Subject:</h3>
                                                <p className="text-base">{seller.subject}</p>
                                            </div>

                                        </div>

                                        <div className="flex  items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full sm:px-auto">

                                            <div className="max-w-[150px]">
                                                <h3 className="font-semibold text-base">Email:</h3>
                                                <p className="text-base ">{seller.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex  justify-between items-center pb-3 mt-3 w-full sm:px-auto">
                                            <div className="max-w-[270px] w-full">
                                                <p className="font-semibold text-lg">Messages</p>
                                                <p className="font-[600] text-blue-600 text-lg">
                                                    {seller.message}
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            {/* <Pagination
                current={currentPage}
                pageSize={ITEMS_PER_PAGE}
                total={filteredSellers.length}
                onChange={onPageChange}
                className="my-4 flex justify-center"
              /> */}
                        </div>
                    </div>
                </div>

                {/* <SellerModal
                    visible={showSellerModal}
                    onCancel={() => setShowSellerModal(false)}
                    onSubmit={() => {
                        setShowSellerModal(false);
                        message.success("Seller Added!");
                    }}
                /> */}

                <EditModal
                    visible={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    onOk={({ image: fileListImage, status, ...values }) =>
                        handleEditSubmit({ image: fileListImage, status, ...values })
                    }
                    editForm={editForm}
                    selectedSeller={selectedSeller}
                />

                <Modal
                    title="Confirm Deletion"
                    visible={showDeleteConfirmationModal}
                    onCancel={() => setShowDeleteConfirmationModal(false)}
                    onOk={() => { deleteMutation.mutate(selectedSellerId) }}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                        style: { backgroundColor: "#D83535", color: "#FFFFFF" },
                    }}
                >
                    <p>Are you sure you want to delete the selected seller?</p>
                </Modal>


            </div>
        </div>
    );
};

export default Index;
