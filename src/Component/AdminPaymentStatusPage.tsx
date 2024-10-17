import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Select, Modal } from 'antd';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './AdminPaymentStatusPage.css';

interface PaymentData {
    id: string;
    invoiceId: string;
    room: string;
    month: string;
    year: number;
    total: number;
    uploadedImage: string;
    timestamp: any;
    userId: string;
    roomStatus: string;
}

// Define the order for room sorting
const roomOrder = [
    '201', '202', '203', '204', '205', '206', '207', '208',
    '309', '310', '311', '312', '313', '314', '315', '316',
    '225', '226', '227', '228', '329', '330', '331', '332'
];

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

const AdminPaymentStatusPage: React.FC = () => {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined); // New state for selected year
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const firestore = getFirestore();

    useEffect(() => {
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                const paymentsCollection = collection(firestore, 'payments');
                const paymentsSnapshot = await getDocs(paymentsCollection);
                const paymentsList = paymentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as PaymentData[];

                // Sort payments by year and month
                paymentsList.sort((a, b) => {
                    if (a.year === b.year) {
                        return monthMapping[a.month] - monthMapping[b.month];
                    }
                    return a.year - b.year;
                });

                setPayments(paymentsList);
                setFilteredPayments(paymentsList); // Initialize filtered payments
            } catch (error) {
                console.error("Error fetching payment history: ", error);
                message.error("Failed to load payment data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, [firestore]);

    useEffect(() => {
        // Filter payments based on selected room and year
        setFilteredPayments(payments.filter(payment => {
            const roomMatch = selectedRoom ? payment.room === selectedRoom : true;
            const yearMatch = selectedYear ? payment.year === selectedYear : true;
            return roomMatch && yearMatch;
        }));
    }, [selectedRoom, selectedYear, payments]);

    const handleStatusChange = async (paymentId: string, currentStatus: string) => {
        setIsUpdating(paymentId);
        const newStatus = currentStatus === 'จ่ายแล้ว' ? 'ค้างชำระ' : 'จ่ายแล้ว';
    
        try {
            const paymentDocRef = doc(firestore, 'payments', paymentId);
            await updateDoc(paymentDocRef, { roomStatus: newStatus });
    
            // ดึงการชำระเงินเพื่อตรวจสอบ invoiceId
            const updatedPayment = payments.find(payment => payment.id === paymentId);
            if (updatedPayment) {
                // อัปเดตใบแจ้งหนี้ที่เกี่ยวข้อง
                const invoiceDocRef = doc(firestore, 'invoices', updatedPayment.invoiceId);
                await updateDoc(invoiceDocRef, { roomStatus: newStatus });
            }
    
            // อัปเดตสถานะใน state
            setFilteredPayments(prevPayments =>
                prevPayments.map(payment =>
                    payment.id === paymentId ? { ...payment, roomStatus: newStatus } : payment
                )
            );
    
            message.success('อัปเดตสถานะเรียบร้อยแล้ว.');
    
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ: ", error);
            message.error("ไม่สามารถอัปเดตสถานะได้.");
        } finally {
            setIsUpdating(null);
        }
    };    

    const handleDelete = async (paymentId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this payment record?');
        if (confirmDelete) {
            try {
                const paymentDocRef = doc(firestore, 'payments', paymentId);
                await deleteDoc(paymentDocRef);
                setFilteredPayments(prevPayments => prevPayments.filter(payment => payment.id !== paymentId));
                message.success('Payment record deleted successfully.');
            } catch (error) {
                console.error("Error deleting payment record: ", error);
                message.error("Failed to delete payment record.");
            }
        }
    };

    const handleImageClick = (image: string) => {
        setPreviewImage(image);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setPreviewImage(null);
    };

    const columns = [
        {
            title: 'ห้อง',
            dataIndex: 'room',
            key: 'room',
        },
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
            title: 'สถานะ',
            dataIndex: 'roomStatus',
            key: 'roomStatus',
            render: (roomStatus: string, record: PaymentData) => (
                <Button
                    type={roomStatus === 'paid' ? 'primary' : 'default'}
                    loading={isUpdating === record.id}
                    onClick={() => handleStatusChange(record.id, roomStatus)}
                >
                    {roomStatus === 'จ่ายแล้ว' ? 'จ่ายแล้ว' : 'ค้างชำระ'}
                </Button>
            ),
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
            title: 'Actions',
            key: 'actions',
            render: (_: unknown, record: PaymentData) => (
                <Button
                    type="default"
                    danger
                    loading={isUpdating === record.id}
                    onClick={() => handleDelete(record.id)}
                >
                    ลบ
                </Button>
            ),
        }
    ];

    // Extract unique years from payments
    const uniqueYears = Array.from(new Set(payments.map(payment => payment.year))).sort();

    return (
        <>
            <Navbar />
            <div className="admin-payment-status-container">
                <h3>จัดการสถานะการชำระเงิน</h3>

                {/* Room Selection Dropdown */}
                <Select
                    placeholder="เลือกห้อง"
                    style={{ width: 200, marginBottom: 20 }}
                    onChange={setSelectedRoom}
                    allowClear
                >
                    {Array.from(new Set(payments.map(payment => payment.room)))
                        .sort((a, b) => roomOrder.indexOf(a) - roomOrder.indexOf(b)) // Sort according to defined room order
                        .map(room => (
                            <Select.Option key={room} value={room}>
                                {room}
                            </Select.Option>
                        ))}
                </Select>

                {/* Year Selection Dropdown */}
                <Select
                    placeholder="เลือกปี"
                    style={{ width: 200, marginBottom: 20, marginLeft: 10 }}
                    onChange={setSelectedYear}
                    allowClear
                >
                    {uniqueYears.map(year => (
                        <Select.Option key={year} value={year}>
                            {year + 543} {/* Display year in Buddhist calendar */}
                        </Select.Option>
                    ))}
                </Select>

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

                {/* Modal for image preview */}
                <Modal visible={isModalVisible} footer={null} onCancel={handleModalClose}>
                    <img src={previewImage || ''} alt="Payment Slip Preview" style={{ width: '100%' }} />
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default AdminPaymentStatusPage;