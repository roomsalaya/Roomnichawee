import React, { useEffect, useState } from 'react';
import { Table, Spin, Select, Tooltip } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import './SentInvoicesPage.css';

const { Option } = Select;

interface InvoiceData {
    room: string;
    month: string;
    year: number;
    rent: string;
    water: string;
    electricity: string;
    fine: string;
    total: number;
    roomStatus: string;
    pdfUrl?: string;
}

const SentInvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const firestore = getFirestore();
    const auth = getAuth();
    const [userRoom, setUserRoom] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const user = auth.currentUser;
                if (user) {
                    const userEmail = user.email;
                    const room = userEmail?.split('@')[0] || null;
                    setUserRoom(room);

                    const invoicesCollection = collection(firestore, 'invoices');
                    const invoicesSnapshot = await getDocs(invoicesCollection);
                    const invoicesList = invoicesSnapshot.docs.map(doc => doc.data() as InvoiceData);

                    const filteredInvoices = invoicesList.filter(invoice => invoice.room === room);
                    setInvoices(filteredInvoices);
                }
            } catch (error) {
                console.error("Error fetching invoices data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [firestore, auth]);

    const handleYearChange = (value: number) => {
        setSelectedYear(value);
    };

    const monthMap: { [key: string]: number } = {
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

    const filteredInvoicesByYear = selectedYear
        ? invoices
            .filter(invoice => invoice.year === selectedYear - 543)
            .sort((a, b) => (monthMap[a.month] || 0) - (monthMap[b.month] || 0))
        : invoices.sort((a, b) => (monthMap[a.month] || 0) - (monthMap[b.month] || 0));

    const columns = [
        {
            title: 'ห้อง',
            dataIndex: 'room',
            key: 'room',
        },
        {
            title: 'เดือนที่แจ้งหนี้',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'ปี (พ.ศ.)',
            dataIndex: 'year',
            key: 'year',
            render: (text: number) => text + 543,
        },
        {
            title: 'ค่าเช่า (บาท)',
            dataIndex: 'rent',
            key: 'rent',
        },
        {
            title: 'ค่าน้ำ (บาท)',
            dataIndex: 'water',
            key: 'water',
        },
        {
            title: 'ค่าไฟ (บาท)',
            dataIndex: 'electricity',
            key: 'electricity',
        },
        {
            title: 'ค่าปรับ (บาท)',
            dataIndex: 'fine',
            key: 'fine',
        },
        {
            title: 'ยอดรวม (บาท)',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'สถานะห้อง',
            dataIndex: 'roomStatus',
            key: 'roomStatus',
        },
        {
            title: 'ดาวน์โหลด PDF',
            dataIndex: 'pdfUrl',
            key: 'pdfUrl',
            render: (url: string) =>
                url ? (
                    <Tooltip title="กดเปิดลิงก์ในแท็บใหม่หากไม่สามารถดาวน์โหลดได้">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                // Check for iOS user agents
                                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                                if (isIOS) {
                                    window.open(url, "_blank");
                                    e.preventDefault();
                                }
                            }}
                        >
                            ดาวน์โหลด
                        </a>
                    </Tooltip>
                ) : 'ไม่มีไฟล์',            
        },
    ];

    return (
        <>
            <Navbar />
            <div className="sent-invoices-container">
                <h3>บิลแจ้งหนี้</h3>
                {loading ? (
                    <Spin size="large" />
                ) : userRoom ? (
                    <>
                        <Select
                            style={{ width: 200, marginBottom: 20 }}
                            placeholder="เลือกปี"
                            onChange={handleYearChange}
                        >
                            {Array.from({ length: 11 }, (_, i) => 2567 + i).map(year => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                        <Table
                            dataSource={filteredInvoicesByYear}
                            columns={columns}
                            rowKey="room"
                            pagination={{ pageSize: 10 }}
                            className='table'
                        />
                    </>
                ) : (
                    <p>กรุณาล็อกอินเพื่อดูข้อมูล</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default SentInvoicesPage;
