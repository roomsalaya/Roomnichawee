import React, { useState } from 'react';
import { Modal, Form, Input, Card } from 'antd';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoiceForm.css';

const InvoiceForm: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState("มกราคม"); // Default value
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
    const [isModalVisible, setIsModalVisible] = useState(false); // To handle modal visibility
    const roomNumber = 201; // สมมติเลขห้องพักเป็น 201, คุณสามารถแทนด้วยเลขห้องจาก user ได้

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(e.target.value));
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleUpdate = () => {
        console.log("ทำการส่งบิลแจ้งหนี้ค่าเช่าไปยังผู้ใช้");
        setIsModalVisible(false); // Close the modal after updating
    };

    const showModal = () => {
        setIsModalVisible(true);
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
                    {Array.from({ length: 10 }, (_, i) => (2567 + i)).map((year) => (
                        <option key={year} value={year.toString()}>{year}</option>
                    ))}
                </select>

                {/* ใช้ Card แทนการใช้ปุ่ม โดยคลิกที่ Card จะเปิด Modal */}
                <Card
                    title={`${roomNumber}`}
                    bordered={true}
                    style={{ width: 150, marginTop: 16, cursor: 'pointer' }} // ทำให้ Card มี cursor เป็น pointer
                    onClick={showModal} // เปิด Modal เมื่อคลิกที่ Card
                >
                    <p>ทำบิลแจ้งหนี้ค่าเช่าห้อง {roomNumber}</p>
                </Card>

                <Modal
                    title="ทำบิลแจ้งหนี้ค่าเช่า"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form layout="vertical">
                        <Form.Item label="ชื่อ" name="name">
                            <Input placeholder="ใส่ชื่อผู้ใช้" />
                        </Form.Item>

                        <Form.Item label="ห้อง" name="room">
                            <Input placeholder="ใส่หมายเลขห้อง" value={roomNumber} disabled />
                        </Form.Item>

                        <Form.Item label="อีเมล" name="email">
                            <Input placeholder="ใส่อีเมล" />
                        </Form.Item>

                        <Form.Item label="เบอร์โทรศัพท์" name="phone">
                            <Input placeholder="ใส่เบอร์โทรศัพท์" />
                        </Form.Item>

                        <Form.Item label="สัญญาเช่า" name="contract">
                            <Input placeholder="ใส่ข้อมูลสัญญาเช่า" />
                        </Form.Item>

                        <Form.Item label="ค่าเช่า" name="rent">
                            <Input placeholder="ใส่ค่าเช่า" />
                        </Form.Item>

                        <Form.Item label="ค่าน้ำ" name="water">
                            <Input placeholder="ใส่ค่าน้ำ" />
                        </Form.Item>

                        <Form.Item label="ค่าไฟ หน่วยละ" name="electricity">
                            <Input placeholder="ใส่ค่าไฟต่อหน่วย" />
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
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default InvoiceForm;
