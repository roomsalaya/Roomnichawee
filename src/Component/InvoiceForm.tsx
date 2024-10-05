import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Card, Spin } from 'antd';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoiceForm.css';

interface ElectricityData {
    [roomNumber: string]: {
        previous: string;
        current: string;
        units: string;
        amount: string;
    };
}

const InvoiceForm: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState("มกราคม");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [usersData, setUsersData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [form] = Form.useForm();
    const [electricityData, setElectricityData] = useState<ElectricityData>({});
    const [totalAmount, setTotalAmount] = useState<number>(0); // State for total amount
    const firestore = getFirestore();

    // Fetch all users data from Firestore
    useEffect(() => {
        const fetchUsersData = async () => {
            setLoading(true);
            try {
                const usersCollection = collection(firestore, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsersData(usersList);
            } catch (error) {
                console.error("Error fetching users data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersData();
    }, [firestore]);

    // Fetch electricity data for the selected month and year
    useEffect(() => {
        const fetchElectricityData = async () => {
            const thaiYear = selectedYear + 543;
            const monthYear = `${selectedMonth} ${thaiYear}`;

            try {
                const docRef = doc(firestore, "electricityData", monthYear);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setElectricityData(docSnap.data() as ElectricityData);
                } else {
                    console.log("No electricity data found for the selected month and year.");
                    setElectricityData(initializeDefaultElectricityData());
                }
            } catch (error) {
                console.error("Error fetching electricity data: ", error);
            }
        };

        fetchElectricityData();
    }, [selectedMonth, selectedYear, firestore]);

    const initializeDefaultElectricityData = () => {
        const roomNumbers = ['201', '202', '203', '204', '205', '206', '207', '208',
            '309', '310', '311', '312', '313', '314', '315', '316',
            '225', '226', '227', '228', '329', '330', '331', '332'];
        return roomNumbers.reduce((acc, room) => {
            acc[room] = { previous: '0', current: '0', units: '0', amount: '0' };
            return acc;
        }, {} as ElectricityData);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(e.target.value));
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setTotalAmount(0); // Reset total amount
    };

    const handleUpdate = () => {
        console.log("ทำการส่งบิลแจ้งหนี้ค่าเช่าไปยังผู้ใช้");
        setIsModalVisible(false);
    };

    const showModal = (user: any) => {
        setSelectedUser(user);
        form.setFieldsValue({
            rent: user.rent || '',
            water: user.water || '',
            electricity: electricityData[user.room]?.amount || 'ไม่ระบุ',
            roomStatus: user.roomStatus || ''
        });
        setIsModalVisible(true);
        calculateTotal(user.rent, user.water, electricityData[user.room]?.amount);
    };

    const calculateTotal = (rent: string | undefined, water: string | undefined, electricity: string | undefined) => {
        const rentAmount = parseFloat(rent || '0');
        const waterAmount = parseFloat(water || '0');
        const electricityAmount = parseFloat(electricity || '0');
        const total = rentAmount + waterAmount + electricityAmount;
        setTotalAmount(total); // Update the total amount
    };

    const handleFieldChange = (changedFields: any) => {
        const { rent, water } = changedFields;
        calculateTotal(rent, water, electricityData[selectedUser?.room]?.amount);
    };

    return (
        <>
            <Navbar />
            <div className="invoice-form-container">
                <h3>เลือกรอบบิล</h3>
                <select
                    className="form-select"
                    aria-label="เลือกเดือน"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                >
                    {["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"].map((month) => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
                <select
                    className="form-select"
                    aria-label="เลือกปี"
                    value={selectedYear}
                    onChange={handleYearChange}
                >
                    {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i)).map((year) => (
                        <option key={year} value={year.toString()}>{year}</option>
                    ))}
                </select>

                {loading ? (
                    <Spin size="large" />
                ) : (
                    <div className="cards-container">
                        {usersData.map(user => (
                            <Card
                                key={user.id}
                                title={`ห้อง: ${user.room || 'ไม่ระบุ'}`}
                                bordered={true}
                                style={{ width: 300, marginTop: 16, cursor: 'pointer' }}
                                onClick={() => showModal(user)}
                            >
                                <p>ชื่อ: {user.name}</p>
                                <p>ค่าเช่า: {user.rent ? `${user.rent} บาท` : 'ไม่ระบุ'}</p>
                            </Card>
                        ))}
                    </div>
                )}

                <Modal
                    title="ทำบิลแจ้งหนี้ค่าเช่า"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    {selectedUser && (
                        <Form form={form} layout="vertical" onValuesChange={(_, allValues) => handleFieldChange(allValues)}>
                            <Form.Item label="ค่าเช่า" name="rent">
                                <Input placeholder="ใส่ค่าเช่า" />
                            </Form.Item>

                            <Form.Item label="ค่าน้ำ" name="water">
                                <Input placeholder="ใส่ค่าน้ำ" />
                            </Form.Item>

                            <Form.Item label="ค่าไฟ" name="electricity">
                                <Input
                                    placeholder="ค่าไฟ"
                                    disabled
                                    value={electricityData[selectedUser.room]?.amount || 'ไม่ระบุ'}
                                />
                            </Form.Item>

                            <Form.Item label="รวมยอด" name="total">
                                <Input disabled value={`${totalAmount} บาท`} />
                            </Form.Item>

                            <Form.Item label="สถานะห้อง" name="roomStatus">
                                <Input placeholder="ใส่สถานะห้อง" />
                            </Form.Item>

                            <div style={{ marginTop: '16px' }}>
                                <button key="cancel" onClick={handleCancel} style={{ marginRight: '8px' }}>
                                    ยกเลิก
                                </button>
                                <button key="submit" type="submit" onClick={handleUpdate}>
                                    ส่งบิลแจ้งหนี้
                                </button>
                            </div>
                        </Form>
                    )}
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default InvoiceForm;
