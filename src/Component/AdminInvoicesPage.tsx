import React, { useEffect, useState } from 'react';
import { Table, Spin, Input, message, Select, Button } from 'antd';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './AdminInvoicesPage.css';

interface InvoiceData {
    id: string;
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
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
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

                invoicesList.sort((a, b) => {
                    const monthA = monthOrder[a.month] || 0;
                    const monthB = monthOrder[b.month] || 0;
                    return monthA - monthB || (a.year - b.year);
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
            
            // Get the current invoice data to compute the total
            const currentInvoice = invoices.find(invoice => invoice.id === id);
            
            if (currentInvoice) {
                // Update the current invoice with the new data
                const updatedInvoice = { ...currentInvoice, ...updatedData };
                
                // Calculate the new total
                const rent = parseFloat(updatedInvoice.rent) || 0;
                const water = parseFloat(updatedInvoice.water) || 0;
                const electricity = parseFloat(updatedInvoice.electricity) || 0;
                const fine = parseFloat(updatedInvoice.fine) || 0;
                const newTotal = rent + water + electricity + fine;
    
                // Update Firestore
                await updateDoc(invoiceRef, { ...updatedData, total: newTotal });
    
                // Update local state
                message.success('ข้อมูลบิลได้ถูกแก้ไขเรียบร้อยแล้ว!');
                const updatedInvoices = invoices.map(invoice =>
                    invoice.id === id ? { ...invoice, ...updatedData, total: newTotal } : invoice
                );
                setInvoices(updatedInvoices);
                setIsEditing(prev => ({ ...prev, [id]: false }));
            }
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
            setInvoices(invoices.filter(invoice => invoice.id !== id));
        } catch (error) {
            console.error("Error deleting invoice: ", error);
            message.error('เกิดข้อผิดพลาดในการลบข้อมูลบิล!');
        }
    };

    const handleRoomChange = (value: string) => {
        setSelectedRoom(value);
    };

    const handleYearChange = (value: number) => {
        setSelectedYear(value);
    };

    const filteredInvoices = invoices.filter(invoice => {
        return (!selectedRoom || invoice.room === selectedRoom) &&
            (!selectedYear || invoice.year === selectedYear);
    });

    const toggleRoomStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'จ่ายแล้ว' ? 'ค้างชำระ' : 'จ่ายแล้ว';
        await handleSave(id, { roomStatus: newStatus });
    };

    const toggleEdit = (id: string) => {
        setIsEditing(prev => ({ ...prev, [id]: !prev[id] }));
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
                <div style={{ marginBottom: 20 }}>
                    <Select
                        placeholder="เลือกห้อง"
                        onChange={handleRoomChange}
                        style={{ width: 200, marginRight: 10 }}
                    >
                        {['201', '202', '203', '204', '205', '206', '207', '208', '309', '310', '311', '312', '313', '314', '315', '316', '225', '226', '227', '228', '329', '330', '331', '332'].map(room => (
                            <Select.Option key={room} value={room}>
                                {room}
                            </Select.Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="เลือกปี"
                        onChange={handleYearChange}
                        style={{ width: 200 }}
                    >
                        {Array.from(new Set(invoices.map(invoice => invoice.year)))
                            .sort((a, b) => b - a)
                            .map(year => (
                                <Select.Option key={year} value={year}>
                                    {year + 543}
                                </Select.Option>
                            ))}
                    </Select>
                </div>
                {loading ? (
                    <Spin />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredInvoices}
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
