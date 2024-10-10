import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Modal, Form, Input, message } from 'antd';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoicesTable.css';

interface InvoiceData {
    userId: string;
    room: string;
    month: string;
    year: string;
    rent: string;
    water: string;
    electricity: string;
    fine: string;
    total: string;
    roomStatus: string;
}

const InvoicesTableAdmin: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
    const firestore = getFirestore();

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const invoicesCollection = collection(firestore, 'invoices');
                const invoicesSnapshot = await getDocs(invoicesCollection);
                const invoicesList = invoicesSnapshot.docs.map(doc => ({ ...doc.data(), userId: doc.id } as InvoiceData));
                
                // Log the fetched invoices for debugging
                console.log("Fetched Invoices: ", invoicesList);

                setInvoices(invoicesList);
                setFilteredInvoices(invoicesList);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลใบแจ้งหนี้: ", error);
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
                const buddhistYear = parseInt(invoice.year) + 543;
                return buddhistYear.toString() === selectedYear;
            });
            setFilteredInvoices(filtered);
        } else {
            setFilteredInvoices(invoices);
        }
    };

    const handleEdit = (invoice: InvoiceData) => {
        setCurrentInvoice(invoice);
        setIsEditing(true);
    };

    const handleSave = async (values: any) => {
        if (currentInvoice) {
            const invoiceRef = doc(firestore, 'invoices', currentInvoice.userId);
            try {
                await updateDoc(invoiceRef, {
                    ...currentInvoice,
                    ...values, // รวมค่าจากฟอร์ม
                });
                message.success('ข้อมูลใบแจ้งหนี้ถูกแก้ไขเรียบร้อยแล้ว');
                setInvoices(prev => prev.map(inv => inv.userId === currentInvoice.userId ? { ...inv, ...values } : inv));
                setFilteredInvoices(prev => prev.map(inv => inv.userId === currentInvoice.userId ? { ...inv, ...values } : inv));
                setIsEditing(false);
                setCurrentInvoice(null);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ", error);
                message.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
            }
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
                const buddhistYear = parseInt(year) + 543;
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
        {
            title: 'ดำเนินการ',
            key: 'action',
            render: (_: any, record: InvoiceData) => (
                <Button onClick={() => handleEdit(record)}>แก้ไข</Button>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <div className="invoices-table-container">
                <h3>ใบแจ้งหนี้</h3>

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

            {isEditing && currentInvoice && (
                <Modal
                    title="แก้ไขใบแจ้งหนี้"
                    visible={isEditing}
                    onCancel={() => setIsEditing(false)}
                    footer={null}
                >
                    <Form
                        layout="vertical"
                        initialValues={currentInvoice}
                        onFinish={handleSave}
                    >
                        <Form.Item label="ห้อง" name="room" rules={[{ required: true, message: 'กรุณากรอกห้อง' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="เดือน" name="month" rules={[{ required: true, message: 'กรุณากรอกเดือน' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="ปี (พ.ศ.)" name="year" rules={[{ required: true, message: 'กรุณากรอกปี' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="ค่าเช่า" name="rent" rules={[{ required: true, message: 'กรุณากรอกค่าเช่า' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="ค่าน้ำ" name="water" rules={[{ required: true, message: 'กรุณากรอกค่าน้ำ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="ค่าไฟ" name="electricity" rules={[{ required: true, message: 'กรุณากรอกค่าไฟ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="ค่าปรับ" name="fine">
                            <Input />
                        </Form.Item>
                        <Form.Item label="รวมทั้งหมด" name="total">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                บันทึก
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
            <Footer />
        </>
    );
};

export default InvoicesTableAdmin;
