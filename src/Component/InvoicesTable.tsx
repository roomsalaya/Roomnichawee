import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoicesTable.css';

interface InvoiceData {
    userId: string;
    room: string; // This will hold the room number
    month: string;
    year: string; // This can stay as a string since you're converting it to Buddhist year later
    rent: number; // Change from string to number
    water: number; // Change from string to number
    electricity: number; // Change from string to number
    fine: number; // Change from string to number
    total: number; // Change from string to number
    roomStatus: string;
}

const InvoicesTable: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>(""); // State for selected year
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
                        room: string; // Ensure room is included in the fetched data
                        month: string;
                        year: string;
                        rent: number; // Ensure these are numbers
                        water: number; 
                        electricity: number; 
                        fine: number; 
                        total: number; 
                        roomStatus: string;
                    };

                    return {
                        id: doc.id,
                        userId: data.userId || "",
                        room: data.room || "", // Room number pulled from Firestore
                        month: data.month || "",
                        year: data.year || "",
                        rent: data.rent || 0, // Default to 0 if undefined
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
                const buddhistYear = parseInt(invoice.year) + 543; // Convert to Buddhist year
                return buddhistYear.toString() === selectedYear; // Filter invoices by selected year
            });
            setFilteredInvoices(filtered);
        } else {
            setFilteredInvoices(invoices); // Show all if no year is selected
        }
    };

    const columns = [
        {
            title: 'ห้อง', // Room
            dataIndex: 'room',
            key: 'room',
        },
        {
            title: 'เดือน', // Month
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'ปี (พ.ศ.)', // Year (Buddhist)
            dataIndex: 'year',
            key: 'year',
            render: (year: string) => {
                const buddhistYear = parseInt(year) + 543; // Convert to Buddhist year
                return buddhistYear.toString();
            },
        },
        {
            title: 'ค่าเช่า', // Rent
            dataIndex: 'rent',
            key: 'rent',
        },
        {
            title: 'ค่าน้ำ', // Water
            dataIndex: 'water',
            key: 'water',
        },
        {
            title: 'ค่าไฟ', // Electricity
            dataIndex: 'electricity',
            key: 'electricity',
        },
        {
            title: 'ค่าปรับ', // Fine
            dataIndex: 'fine',
            key: 'fine',
        },
        {
            title: 'รวมทั้งหมด', // Total
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'สถานะการชำระเงิน', // Payment Status
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
                        rowKey="userId" // This can be updated to a unique field if necessary
                        pagination={{ pageSize: 10 }}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default InvoicesTable;
