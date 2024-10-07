import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Card, Spin, Switch } from 'antd';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoiceForm.css';

const SentInvoiceForm: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sentInvoices, setSentInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [form] = Form.useForm();
    const firestore = getFirestore();

    // Fetch users with sent invoices
    useEffect(() => {
        const fetchSentInvoices = async () => {
            setLoading(true);
            try {
                const invoiceQuery = query(collection(firestore, 'invoices'), where('roomStatus', '==', 'จ่ายแล้ว'));
                const invoiceSnapshot = await getDocs(invoiceQuery);
                const invoicesList = invoiceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSentInvoices(invoicesList);
            } catch (error) {
                console.error("Error fetching sent invoices: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSentInvoices();
    }, [firestore]);

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const showModal = (user: any) => {
        setSelectedUser(user);
        form.setFieldsValue({
            room: user.room || 'ไม่ระบุ',
            rent: user.rent || '',
            water: user.water || '',
            electricity: user.electricity || 'ไม่ระบุ',
            fine: '', 
            roomStatus: user.roomStatus || false,
            total: user.total || 'ไม่ระบุ',
        });
        setIsModalVisible(true);
    };

    return (
        <>
            <Navbar />
            <div className="invoice-form-container">
                <h3>รายการผู้ใช้ที่ส่งบิลแจ้งหนี้แล้ว</h3>

                {loading ? (
                    <Spin size="large" />
                ) : (
                    <div className="cards-container">
                        {sentInvoices.map(user => (
                            <Card
                                key={user.id}
                                title={`ห้อง: ${user.room || 'ไม่ระบุ'} (บิล: ${user.invoiceMonth || 'ไม่ระบุ'}/${user.invoiceYear || 'ไม่ระบุ'})`}
                                bordered={true}
                                style={{ width: 300, marginTop: 16, cursor: 'pointer' }}
                                onClick={() => showModal(user)}
                            >
                                <p>ชื่อ: {user.name}</p>
                                <p>รวม: {user.total ? `${user.total} บาท` : 'ไม่ระบุ'}</p>
                            </Card>
                        ))}
                    </div>
                )}

                <Modal
                    title="รายละเอียดบิลแจ้งหนี้"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    {selectedUser && (
                        <Form form={form} layout="vertical">
                            <Form.Item label="ห้อง" name="room">
                                <Input placeholder="ห้อง" disabled />
                            </Form.Item>

                            <Form.Item label="ค่าเช่า" name="rent">
                                <Input placeholder="ค่าเช่า" disabled />
                            </Form.Item>

                            <Form.Item label="ค่าน้ำ" name="water">
                                <Input placeholder="ค่าน้ำ" disabled />
                            </Form.Item>

                            <Form.Item label="ค่าไฟ" name="electricity">
                                <Input placeholder="ค่าไฟ" disabled />
                            </Form.Item>

                            <Form.Item label="ค่าปรับ" name="fine">
                                <Input placeholder="ค่าปรับ" disabled />
                            </Form.Item>

                            <Form.Item label="รวม" name="total">
                                <Input placeholder="ยอดรวมทั้งหมด" disabled />
                            </Form.Item>

                            <Form.Item label="สถานะห้อง" name="roomStatus">
                                <Switch checked={selectedUser.roomStatus === 'จ่ายแล้ว'} disabled />
                            </Form.Item>
                        </Form>
                    )}
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default SentInvoiceForm;
