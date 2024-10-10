import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoicesTable.css';

interface InvoiceData {
    userId: string;
    room: string; // เลขห้อง
    month: string;
    year: string; // ปีในรูปแบบ string
    rent: number; 
    water: number; 
    electricity: number; 
    fine: number; 
    total: number; 
    roomStatus: string;
}

const InvoicesTable: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>(""); // State สำหรับปีที่เลือก
    const firestore = getFirestore();

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const invoicesCollection = collection(firestore, 'invoices');
                const invoicesSnapshot = await getDocs(invoicesCollection);
                const invoicesList = invoicesSnapshot.docs.map(doc => {
                    const data = doc.data() as {
                        userId: string;
                        room: string; // ฟิลด์เลขห้อง
                        month: string;
                        year: string;
                        rent: number; 
                        water: number; 
                        electricity: number; 
                        fine: number; 
                        total: number; 
                        roomStatus: string;
                    };

                    return {
                        id: doc.id,
                        userId: data.userId || "",
                        room: data.room || "", // เลขห้องที่ถูกดึงมา
                        month: data.month || "",
                        year: data.year || "",
                        rent: data.rent || 0,
                        water: data.water || 0,
                        electricity: data.electricity || 0,
                        fine: data.fine || 0,
                        total: data.total || 0,
                        roomStatus: data.roomStatus || "",
                    } as InvoiceData;
                });

                setInvoices(invoicesList);
                setFilteredInvoices(invoicesList);
            } catch (error) {
                console.error("Error fetching invoices: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [firestore]);

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = e.target.value;
        setSelectedYear(selectedYear);

        if (selectedYear) {
            const filtered = invoices.filter(invoice => {
                const buddhistYear = parseInt(invoice.year) + 543; // แปลงเป็นปีพุทธศักราช
                return buddhistYear.toString() === selectedYear; // กรองข้อมูลตามปีที่เลือก
            });
            setFilteredInvoices(filtered);
        } else {
            setFilteredInvoices(invoices); // แสดงทั้งหมดถ้าไม่มีการเลือกปี
        }
    };

    const columns = [
        {
            title: 'ห้อง',
            dataIndex: 'room', // ตรวจสอบให้แน่ใจว่าชื่อฟิลด์ถูกต้อง
            key: 'room',
        },
        {
            title: 'เดือน',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'ปี (พ.ศ.)',
            dataIndex: 'year',
            key: 'year',
            render: (year: string) => {
                const buddhistYear = parseInt(year) + 543; // แปลงเป็นปีพุทธศักราช
                return buddhistYear.toString();
            },
        },
        {
            title: 'ค่าเช่า',
            dataIndex: 'rent',
            key: 'rent',
        },
        {
            title: 'ค่าน้ำ',
            dataIndex: 'water',
            key: 'water',
        },
        {
            title: 'ค่าไฟ',
            dataIndex: 'electricity',
            key: 'electricity',
        },
        {
            title: 'ค่าปรับ',
            dataIndex: 'fine',
            key: 'fine',
        },
        {
            title: 'รวมทั้งหมด',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'สถานะการชำระเงิน',
            dataIndex: 'roomStatus',
            key: 'roomStatus',
        },
    ];

    return (
        <>
            <Navbar />
            <div className="invoices-table-container">
                <h3>ใบแจ้งหนี้</h3>

                {/* Year selection */}
                <div className="filter-container">
                    <label htmlFor="year-select">เลือกปี:</label>
                    <select
                        id="year-select"
                        className="form-select"
                        aria-label="เลือกปี"
                        value={selectedYear}
                        onChange={handleYearChange}
                    >
                        <option value="">ทั้งหมด</option>
                        {Array.from({ length: 10 }, (_, i) => (2567 + i)).map((year) => (
                            <option key={year} value={year.toString()}>{year}</option>
                        ))}
                    </select>
                </div>

                {/* Invoices table */}
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Table
                        dataSource={filteredInvoices}
                        columns={columns}
                        rowKey="userId"
                        pagination={{ pageSize: 10 }}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default InvoicesTable;
