import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Modal, Select } from 'antd';
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
    roomStatus: string;
}

const { Option } = Select;

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
    const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year as default

    const firestore = getFirestore();
    const auth = getAuth();

    useEffect(() => {
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;

                    const paymentsCollection = collection(firestore, 'payments');
                    const paymentsSnapshot = await getDocs(paymentsCollection);
                    const paymentsList = paymentsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as PaymentData[];

                    const userPayments = paymentsList.filter(payment => payment.userId === userId);

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

    useEffect(() => {
        const filtered = payments.filter(payment => payment.year === selectedYear);
        setFilteredPayments(filtered);
    }, [payments, selectedYear]);

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsModalVisible(true);
    };

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
                    onClick={() => handleImageClick(uploadedImage)}
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
                <span className={`room-status ${roomStatus === 'จ่ายแล้ว' ? 'paid' : 'pending'}`}>
                    {roomStatus === 'จ่ายแล้ว' ? 'จ่ายแล้ว' : 'รอตรวจสอบ'}
                </span>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <div className="payment-history-container">
                <h3>ประวัติการชำระเงิน</h3>
                <div style={{ marginBottom: '16px' }}>
                    <Select
                        value={selectedYear}
                        onChange={handleYearChange}
                        style={{ width: 200 }}
                        placeholder="เลือกปี"
                        allowClear
                    >
                        {Array.from({ length: 7 }, (_, i) => 2567 + i).map(year => (
                            <Option key={year} value={year - 543}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </div>
                {isLoading ? (
                    <Spin size="large" />
                ) : (
                    <Table
                        dataSource={filteredPayments}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                    />
                )}

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
