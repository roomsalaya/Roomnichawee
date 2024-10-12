import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd';
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

const PaymentHistoryPage: React.FC = () => {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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

    const columns = [
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Total Amount',
            dataIndex: 'total',
            key: 'total',
            render: (total: number) => `${total} บาท`,
        },
        {
            title: 'Payment Slip',
            dataIndex: 'uploadedImage',
            key: 'uploadedImage',
            render: (uploadedImage: string) => (
                <img src={uploadedImage} alt="Payment Slip" style={{ width: '100px' }} />
            ),
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: any) => new Date(timestamp.seconds * 1000).toLocaleString(),
        },
        {
            title: 'Room Status', // Add the column for room status
            dataIndex: 'roomStatus',
            key: 'roomStatus',
            render: (roomStatus: string) => roomStatus === 'paid' ? 'ชำระแล้ว' : 'รอการชำระ',
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
            </div>
            <Footer />
        </>
    );
};

export default PaymentHistoryPage;
