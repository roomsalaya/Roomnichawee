import React, { useEffect, useState } from 'react';
import { Modal, Button, Select, Input } from 'antd';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './InvoiceForm.css'; // Import CSS
import Navbar from './Navbar';
import Footer from './Footer';

const { Option } = Select;

interface UserData {
    name: string;
    room: string;
    rent: number;
    electricity: number; // Keep this in case individual electricity rates exist
    water: number;
}

interface ElectricityData {
    room: string;
    amount: number; // Example structure for electricity data
}

interface Invoice {
    month: string;
    year: number;
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
        year: currentYear,
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
    const [users, setUsers] = useState<UserData[]>([]);
    const [electricityData, setElectricityData] = useState<ElectricityData[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string>(''); 
    const [selectedMonth, setSelectedMonth] = useState<string>(''); 

    const db = getFirestore();

    // Fetch user data and electricity data from Firestore
    useEffect(() => {
        const fetchUserData = async () => {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map((doc) => doc.data() as UserData);
            setUsers(usersList);
        };

        const fetchElectricityData = async () => {
            const electricityCollection = collection(db, 'electricityData'); // Adjust collection name
            const electricitySnapshot = await getDocs(electricityCollection);
            const electricityList = electricitySnapshot.docs.map((doc) => doc.data() as ElectricityData);
            setElectricityData(electricityList);
        };

        fetchUserData();
        fetchElectricityData();
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
        const electricity = electricityData.find(data => data.room === value)?.amount || 0; // Fetch electricity data based on room

        if (userData) {
            setFormData({
                ...formData,
                name: userData.name,
                room: userData.room,
                rent: userData.rent,
                electricity, // Set electricity from fetched data
                water: userData.water,
            });
        }
    };

    const handleMonthSelect = (value: string) => {
        setSelectedMonth(value);
        setFormData({
            ...formData,
            month: value,
            year: currentYear,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newInvoice = { ...formData, total: calculateTotal() };
        setInvoices([...invoices, newInvoice]);
        handleCancel();
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
            </div>
            <Footer />
        </>
    );
};

export default InvoiceForm;
