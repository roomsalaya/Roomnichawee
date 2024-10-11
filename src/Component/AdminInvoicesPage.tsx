import React, { useEffect, useState } from 'react';
import { Table, Spin, Input, message, Select, Button } from 'antd';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './AdminInvoicesPage.css';

interface InvoiceData {
    id: string; // Add ID to the InvoiceData for Firestore reference
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

// Updated month order mapping in Thai
const monthOrder: { [key: string]: number } = {
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

const AdminInvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);
    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
    const firestore = getFirestore();

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const invoicesCollection = collection(firestore, 'invoices');
                const invoicesSnapshot = await getDocs(invoicesCollection);
                const invoicesList = invoicesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as InvoiceData[];

                // Sort invoices by month and year
                invoicesList.sort((a, b) => {
                    const monthA = monthOrder[a.month] || 0; // Default to 0 if month is unknown
                    const monthB = monthOrder[b.month] || 0;
                    return monthA - monthB || (a.year - b.year); // Sort by year if months are the same
                });

                setInvoices(invoicesList);
            } catch (error) {
                console.error("Error fetching invoices data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [firestore]);

    const handleSave = async (id: string, updatedData: Partial<InvoiceData>) => {
        try {
            const invoiceRef = doc(firestore, 'invoices', id);
            await updateDoc(invoiceRef, updatedData);
            message.success('ข้อมูลบิลได้ถูกแก้ไขเรียบร้อยแล้ว!');
            // Refresh invoices after update
            const updatedInvoices = invoices.map(invoice =>
                invoice.id === id ? { ...invoice, ...updatedData } : invoice
            );
            setInvoices(updatedInvoices);
            setIsEditing(prev => ({ ...prev, [id]: false })); // Exit edit mode after saving
        } catch (error) {
            console.error("Error updating invoice: ", error);
            message.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลบิล!');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const invoiceRef = doc(firestore, 'invoices', id);
            await deleteDoc(invoiceRef);
            message.success('ข้อมูลบิลได้ถูกลบเรียบร้อยแล้ว!');
            // Remove the deleted invoice from the state
            setInvoices(invoices.filter(invoice => invoice.id !== id));
        } catch (error) {
            console.error("Error deleting invoice: ", error);
            message.error('เกิดข้อผิดพลาดในการลบข้อมูลบิล!');
        }
    };

    const handleRoomChange = (value: string) => {
        setSelectedRoom(value);
    };

    const filteredInvoices = selectedRoom 
        ? invoices.filter(invoice => invoice.room === selectedRoom) 
        : invoices;

    const toggleRoomStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'จ่ายแล้ว' ? 'ค้างชำระ' : 'จ่ายแล้ว';
        await handleSave(id, { roomStatus: newStatus });
    };

    const toggleEdit = (id: string) => {
        setIsEditing(prev => ({ ...prev, [id]: !prev[id] })); // Toggle edit state
    };

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
            render: (text: string, record: InvoiceData) => (
                isEditing[record.id] ? (
                    <Input
                        defaultValue={text}
                        onBlur={e => handleSave(record.id, { rent: e.target.value })}
                    />
                ) : (
                    <span>{text}</span>
                )
            ),
        },
        {
            title: 'ค่าน้ำ (บาท)',
            dataIndex: 'water',
            key: 'water',
            render: (text: string, record: InvoiceData) => (
                isEditing[record.id] ? (
                    <Input
                        defaultValue={text}
                        onBlur={e => handleSave(record.id, { water: e.target.value })}
                    />
                ) : (
                    <span>{text}</span>
                )
            ),
        },
        {
            title: 'ค่าไฟ (บาท)',
            dataIndex: 'electricity',
            key: 'electricity',
            render: (text: string, record: InvoiceData) => (
                isEditing[record.id] ? (
                    <Input
                        defaultValue={text}
                        onBlur={e => handleSave(record.id, { electricity: e.target.value })}
                    />
                ) : (
                    <span>{text}</span>
                )
            ),
        },
        {
            title: 'ค่าปรับ (บาท)',
            dataIndex: 'fine',
            key: 'fine',
            render: (text: string, record: InvoiceData) => (
                isEditing[record.id] ? (
                    <Input
                        defaultValue={text}
                        onBlur={e => handleSave(record.id, { fine: e.target.value })}
                    />
                ) : (
                    <span>{text}</span>
                )
            ),
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
            render: (status: string, record: InvoiceData) => (
                <>
                    <span>{status}</span>
                    <Button onClick={() => toggleRoomStatus(record.id, status)} style={{ marginLeft: 8 }}>
                        เปลี่ยนสถานะ
                    </Button>
                </>
            ),
        },
        {
            title: 'ดาวน์โหลด PDF',
            dataIndex: 'pdfUrl',
            key: 'pdfUrl',
            render: (url: string) => url ? <a href={url} target="_blank" rel="noopener noreferrer">ดาวน์โหลด</a> : 'ไม่มีไฟล์',
        },
        {
            title: 'แก้ไข/บันทึก',
            key: 'edit',
            render: (_: any, record: InvoiceData) => (
                <Button onClick={() => toggleEdit(record.id)}>
                    {isEditing[record.id] ? 'บันทึก' : 'แก้ไข'}
                </Button>
            ),
        },
        {
            title: 'ลบ',
            key: 'delete',
            render: (_: any, record: InvoiceData) => (
                <Button onClick={() => handleDelete(record.id)} danger>
                    ลบ
                </Button>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <div className="admin-invoices-container">
                <h3>แก้ไขบิลแจ้งหนี้</h3>
                <Select 
                    placeholder="เลือกห้อง" 
                    onChange={handleRoomChange} 
                    style={{ width: 200, marginBottom: 20 }}
                >
                    {Array.from(new Set(invoices.map(invoice => invoice.room))).map(room => (
                        <Select.Option key={room} value={room}>
                            {room}
                        </Select.Option>
                    ))}
                </Select>
                {loading ? (
                    <Spin />
                ) : (
                    <Table 
                        dataSource={filteredInvoices} 
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

export default AdminInvoicesPage;
