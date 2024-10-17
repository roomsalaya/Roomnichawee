import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Modal } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import './PaymentHistoryPage.css';

interface PaymentData {
    id: string;
    invoiceId: string;
    room: string;
    month: string;
    year: number;
    total: number;
    uploadedImage: string;
    timestamp: any; // Firestore timestamp
    userId: string;
    roomStatus: string; // Added this field for room status
}

// Mapping month names to numerical values for sorting
const monthMapping: { [key: string]: number } = {
    'มกราคม': 1,
    'กุมภาพันธ์': 2,
    'มีนาคม': 3,
    'เมษายน': 4,
    'พฤษภาคม': 5,
    'มิถุนายน': 6,
    'กรกฎาคม': 7,
    'สิงหาคม': 8,
    'กันยายน': 9,
    'ตุลาคม': 10,
    'พฤศจิกายน': 11,
    'ธันวาคม': 12,
};

const PaymentHistoryPage: React.FC = () => {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to hold selected image
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

    const firestore = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;

                    // Get the payments collection for the logged-in user
                    const paymentsCollection = collection(firestore, 'payments');
                    const paymentsSnapshot = await getDocs(paymentsCollection);
                    const paymentsList = paymentsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as PaymentData[];

                    // Filter payments by the current user's ID
                    const userPayments = paymentsList.filter(payment => payment.userId === userId);

                    // Sort payments by year and month
                    userPayments.sort((a, b) => {
                        if (a.year === b.year) {
                            return monthMapping[a.month] - monthMapping[b.month];
                        }
                        return a.year - b.year;
                    });

                    setPayments(userPayments);
                }
            } catch (error) {
                console.error("Error fetching payment history: ", error);
                message.error("Failed to load payment history. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, [firestore, auth]);

    // Function to handle image click and open modal
    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsModalVisible(true);
    };

    // Function to close the modal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const columns = [
        {
            title: 'เดือน',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'ปี',
            dataIndex: 'year',
            key: 'year',
            render: (year: number) => year + 543,
        },
        {
            title: 'ยอดรวม',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => `${total} บาท`,
        },
        {
            title: 'ภาพหลักฐาน',
            dataIndex: 'uploadedImage',
            key: 'uploadedImage',
            render: (uploadedImage: string) => (
                <img
                    src={uploadedImage}
                    alt="Payment Slip"
                    style={{ width: '100px', cursor: 'pointer' }}
                    onClick={() => handleImageClick(uploadedImage)} // Open modal on click
                />
            ),
        },
        {
            title: 'เวลา',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: any) => new Date(timestamp.seconds * 1000).toLocaleString(),
        },
        {
            title: 'สถานะ',
            dataIndex: 'roomStatus',
            key: 'roomStatus',
            render: (roomStatus: string) => (
                <span>{roomStatus === 'จ่ายแล้ว' ? 'จ่ายแล้ว' : 'ค้างชำระ'}</span>
            ),
        },        
    ];

    return (
        <>
            <Navbar />
            <div className="payment-history-container">
                <h3>ประวัติการชำระเงิน</h3>
                {isLoading ? (
                    <Spin size="large" />
                ) : (
                    <Table
                        dataSource={payments}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                    />
                )}

                {/* Modal for displaying the clicked image */}
                <Modal
                    visible={isModalVisible}
                    footer={null}
                    onCancel={handleModalClose}
                    centered
                    width={600}
                >
                    <img
                        src={selectedImage || ''}
                        alt="Payment Slip"
                        style={{ width: '100%' }}
                    />
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default PaymentHistoryPage;
