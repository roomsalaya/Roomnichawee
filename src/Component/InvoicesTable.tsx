import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoicesTable.css';

interface InvoiceData {
    userId: string;
    room: string;
    month: string;
    year: string; // ควรเป็นปี ค.ศ. ที่เก็บใน Firestore
    rent: string;
    water: string;
    electricity: string;
    fine: string;
    total: string;
    roomStatus: string;
}

const InvoicesTable: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>(""); // state สำหรับปีที่เลือก
    const firestore = getFirestore();

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const invoicesCollection = collection(firestore, 'invoices');
                const invoicesSnapshot = await getDocs(invoicesCollection);
                const invoicesList = invoicesSnapshot.docs.map(doc => doc.data() as InvoiceData);
                setInvoices(invoicesList);
                setFilteredInvoices(invoicesList); // เริ่มต้นด้วยข้อมูลทั้งหมด
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลใบแจ้งหนี้: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [firestore]);

    // ฟังก์ชันจัดการการเลือกปี
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = e.target.value;
        setSelectedYear(selectedYear);

        if (selectedYear) {
            const filtered = invoices.filter(invoice => {
                const buddhistYear = parseInt(invoice.year) + 543; // แปลงเป็นปีพุทธศักราช
                return buddhistYear.toString() === selectedYear; // กรองข้อมูลตามปีที่เลือก
            });
            setFilteredInvoices(filtered); // กรองข้อมูลตามปีที่เลือก
        } else {
            setFilteredInvoices(invoices); // ถ้าไม่เลือกปีใด ให้แสดงข้อมูลทั้งหมด
        }
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

                {/* ส่วนเลือกปี */}
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

                {/* ตารางแสดงใบแจ้งหนี้ */}
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
