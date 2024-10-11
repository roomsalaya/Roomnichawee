import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Card, Spin, Switch, message } from 'antd';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import for storage
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
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [pdfFile, setPdfFile] = useState<File | null>(null); // State for PDF file
    const firestore = getFirestore();
    const storage = getStorage(); // Initialize Firebase storage

    // Fetch users data
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

    // Fetch electricity data
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
        setTotalAmount(0);
        setPdfFile(null); // Reset PDF file
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            message.error('กรุณาเลือกไฟล์ PDF เท่านั้น'); // Show error if not a PDF
        }
    };

    const handleUpdate = async () => {
        try {
            let pdfUrl = '';
            if (pdfFile) {
                // Upload the PDF file to Firebase Storage
                const pdfRef = ref(storage, `invoices/${pdfFile.name}`);
                await uploadBytes(pdfRef, pdfFile);
                pdfUrl = await getDownloadURL(pdfRef); // Get the download URL
            }

            const invoiceData = {
                userId: selectedUser.id,
                room: selectedUser.room || 'ไม่ระบุ',
                month: selectedMonth,
                year: selectedYear,
                rent: form.getFieldValue('rent'),
                water: form.getFieldValue('water'),
                electricity: electricityData[selectedUser.room]?.amount || 'ไม่ระบุ',
                fine: form.getFieldValue('fine'),
                total: totalAmount,
                roomStatus: form.getFieldValue('roomStatus') ? 'จ่ายแล้ว' : 'ค้างชำระ',
                pdfUrl, // Include PDF URL in invoice data
            };

            // Save the invoice data to Firestore
            const invoiceRef = doc(collection(firestore, "invoices"));
            await setDoc(invoiceRef, invoiceData);
            
            message.success("บิลแจ้งหนี้ถูกส่งเรียบร้อยแล้ว!");
            setIsModalVisible(false);
            form.resetFields();
            setTotalAmount(0);
            setPdfFile(null); // Reset PDF file after submission
        } catch (error) {
            console.error("Error saving invoice data: ", error);
            message.error("เกิดข้อผิดพลาดในการส่งบิลแจ้งหนี้");
        }
    };    

    const showModal = (user: any) => {
        setSelectedUser(user);
        form.setFieldsValue({
            room: user.room || 'ไม่ระบุ',
            rent: user.rent || '',
            water: user.water || '',
            electricity: electricityData[user.room]?.amount || 'ไม่ระบุ',
            fine: '',
            roomStatus: user.roomStatus || false,
            total: `${calculateTotal(user.rent, user.water, electricityData[user.room]?.amount)}`,
        });
        setIsModalVisible(true);
    };

    const calculateTotal = (rent: string | undefined, water: string | undefined, electricity: string | undefined, fine: string | undefined = '0') => {
        const rentAmount = parseFloat(rent || '0');
        const waterAmount = parseFloat(water || '0');
        const electricityAmount = parseFloat(electricity || '0');
        const fineAmount = parseFloat(fine || '0');
        const total = rentAmount + waterAmount + electricityAmount + fineAmount;
        setTotalAmount(total);
        form.setFieldsValue({ total: `${total}` });
        return total;
    };

    const handleFieldChange = (_changedValues: any, allValues: any) => {
        calculateTotal(allValues.rent, allValues.water, electricityData[selectedUser?.room]?.amount, allValues.fine);
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
                                <p>ค่าเช่า: {user.rent}</p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                title={`สร้างบิลสำหรับ ${selectedUser?.name}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <button key="back" onClick={handleCancel}>
                        ยกเลิก
                    </button>,
                    <button key="submit" onClick={handleUpdate}>
                        ส่งบิล
                    </button>
                ]}
            >
                <Form form={form} onValuesChange={handleFieldChange}>
                    <Form.Item name="room" label="ห้อง">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="rent" label="ค่าเช่า" rules={[{ required: true, message: 'กรุณากรอกค่าเช่า' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="water" label="ค่าน้ำ" rules={[{ required: true, message: 'กรุณากรอกค่าน้ำ' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="electricity" label="ค่าไฟ" rules={[{ required: true, message: 'กรุณากรอกค่าไฟ' }]}>
                        <Input disabled value={electricityData[selectedUser?.room]?.amount || 'ไม่ระบุ'} />
                    </Form.Item>
                    <Form.Item name="fine" label="ค่าปรับ">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="total" label="รวมทั้งหมด">
                        <Input disabled value={totalAmount.toFixed(2)} />
                    </Form.Item>
                    <Form.Item name="roomStatus" label="สถานะการชำระเงิน" valuePropName="checked">
                        <Switch checkedChildren="จ่ายแล้ว" unCheckedChildren="ค้างชำระ"/>
                    </Form.Item>
                    <Form.Item label="แนบไฟล์ PDF">
                        <Input type="file" accept="application/pdf" onChange={handleFileChange} />
                    </Form.Item>
                </Form>
            </Modal>
            <Footer />
        </>
    );
};

export default InvoiceForm;
