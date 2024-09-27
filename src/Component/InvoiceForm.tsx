import React, { useEffect, useState } from 'react';
import { Modal, Button, Select, Input } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './InvoiceForm.css'; // นำเข้าไฟล์ CSS
import Navbar from './Navbar';
import Footer from './Footer';

const { Option } = Select;

interface UserData {
    name: string;
    room: string;
    rent: number;
    electricity: number;
    water: number;
}

interface Invoice {
    month: string;
    year: number;  // Add year to Invoice interface
    name: string;
    room: string;
    rent: number;
    electricity: number;
    water: number;
    fine: number;
    total: number;
    status: string;
}

// Define the current year
const currentYear = new Date().getFullYear();
const months = [
    { value: 'January', label: `มกราคม ${currentYear}` },
    { value: 'February', label: `กุมภาพันธ์ ${currentYear}` },
    { value: 'March', label: `มีนาคม ${currentYear}` },
    { value: 'April', label: `เมษายน ${currentYear}` },
    { value: 'May', label: `พฤษภาคม ${currentYear}` },
    { value: 'June', label: `มิถุนายน ${currentYear}` },
    { value: 'July', label: `กรกฎาคม ${currentYear}` },
    { value: 'August', label: `สิงหาคม ${currentYear}` },
    { value: 'September', label: `กันยายน ${currentYear}` },
    { value: 'October', label: `ตุลาคม ${currentYear}` },
    { value: 'November', label: `พฤศจิกายน ${currentYear}` },
    { value: 'December', label: `ธันวาคม ${currentYear}` }
];

const InvoiceForm: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [formData, setFormData] = useState({
        month: '',
        year: currentYear, // Add year to formData
        name: '',
        room: '',
        rent: 0,
        electricity: 0,
        water: 0,
        fine: 0,
        total: 0,
        status: 'pending',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [users, setUsers] = useState<UserData[]>([]); // เก็บข้อมูลผู้ใช้จาก Firestore
    const [selectedRoom, setSelectedRoom] = useState<string>(''); // ห้องที่เลือก
    const [selectedMonth, setSelectedMonth] = useState<string>(''); // เดือนที่เลือก

    const db = getFirestore();

    // ดึงข้อมูล users จาก Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            const usersCollection = collection(db, 'users'); // สมมุติว่ามี collection ชื่อ 'users'
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map((doc) => doc.data() as UserData);
            setUsers(usersList);
        };

        fetchUserData();
    }, [db]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoomSelect = (value: string) => {
        setSelectedRoom(value);
        const userData = users.find(user => user.room === value);
        if (userData) {
            setFormData({
                ...formData,
                name: userData.name,
                room: userData.room,
                rent: userData.rent,
                electricity: userData.electricity,
                water: userData.water,
            });
        }
    };

    const handleMonthSelect = (value: string) => {
        setSelectedMonth(value);
        setFormData({
            ...formData,
            month: value,
            year: currentYear, // Set year when month is selected
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newInvoice = { ...formData, total: calculateTotal() };
        setInvoices([...invoices, newInvoice]);
        handleCancel(); // ปิด Modal หลังจากเพิ่มรายการ
    };

    const calculateTotal = () => {
        return (
            Number(formData.rent) +
            Number(formData.electricity) +
            Number(formData.water) +
            Number(formData.fine)
        );
    };

    return (
        <>
            <Navbar />
            <div className="invoice-form-container">
                <Button type="primary" onClick={showModal}>
                    เพิ่มรายการแจ้งหนี้ค่าเช่า
                </Button>

                <Modal
                    title="เพิ่มรายการแจ้งหนี้ค่าเช่า"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <form onSubmit={handleSubmit}>
                        <Select
                            placeholder="เลือกเดือน"
                            value={selectedMonth || undefined}
                            onChange={handleMonthSelect}
                            style={{ width: '100%', marginBottom: '16px' }}
                        >
                            {months.map((month) => (
                                <Option key={month.value} value={month.value}>
                                    {month.label}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="เลือกห้อง"
                            value={selectedRoom || undefined}
                            onChange={handleRoomSelect}
                            style={{ width: '100%', marginBottom: '16px' }}
                        >
                            {users.map((user, index) => (
                                <Option key={index} value={user.room}>
                                    {user.room}
                                </Option>
                            ))}
                        </Select>

                        <Input
                            type="text"
                            name="name"
                            placeholder="ชื่อ"
                            value={formData.name}
                            readOnly
                        />
                        <Input
                            type="number"
                            name="rent"
                            placeholder="ค่าเช่า"
                            value={formData.rent}
                            readOnly
                        />
                        <Input
                            type="number"
                            name="electricity"
                            placeholder="ค่าไฟ"
                            value={formData.electricity}
                            readOnly
                        />
                        <Input
                            type="number"
                            name="water"
                            placeholder="ค่าน้ำ"
                            value={formData.water}
                            readOnly
                        />
                        <Input
                            type="number"
                            name="fine"
                            placeholder="ค่าปรับ"
                            value={formData.fine}
                            onChange={handleInputChange}
                        />

                        <button type="submit">เพิ่มรายการ</button>
                    </form>
                </Modal>

                <h3>รายการแจ้งหนี้</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>เดือน</th>
                                <th>ปี</th> {/* Add Year column */}
                                <th>ชื่อ</th>
                                <th>ห้อง</th>
                                <th>ค่าเช่า</th>
                                <th>ค่าไฟ</th>
                                <th>ค่าน้ำ</th>
                                <th>ค่าปรับ</th>
                                <th>รวม</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice, index) => (
                                <tr key={index}>
                                    <td>{months.find(m => m.value === invoice.month)?.label}</td>
                                    <td>{invoice.year}</td> {/* Display the year */}
                                    <td>{invoice.name}</td>
                                    <td>{invoice.room}</td>
                                    <td>{invoice.rent}</td>
                                    <td>{invoice.electricity}</td>
                                    <td>{invoice.water}</td>
                                    <td>{invoice.fine}</td>
                                    <td>{invoice.total}</td>
                                    <td>{invoice.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default InvoiceForm;
