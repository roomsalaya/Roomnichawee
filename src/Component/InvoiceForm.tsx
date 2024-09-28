import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import Navbar from './Navbar';
import Footer from './Footer';
import './InvoiceForm.css';

const InvoiceForm: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("มกราคม"); // Default value
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
    const [rentAmount, setRentAmount] = useState(0); // State for rent amount
    const [electricityAmount, setElectricityAmount] = useState(0); // State for electricity amount
    const [electricityLabel, setElectricityLabel] = useState(""); // State for electricity label

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // Add your logic to save the invoice details here
        console.log(`Saving invoice for ${selectedMonth} ${selectedYear}`);
        console.log(`Rent: ${rentAmount}, Electricity: ${electricityAmount}, Electricity Label: ${electricityLabel}`);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(Number(e.target.value));
    };

    const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRentAmount(Number(e.target.value));
    };

    const handleElectricityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElectricityAmount(Number(e.target.value));
    };

    const handleElectricityLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElectricityLabel(e.target.value);
    };

    return (
        <>
            <Navbar />
            <div className="invoice-form-container">
                <Button type="primary" onClick={showModal}>
                    เพิ่มรายการแจ้งหนี้ค่าเช่า
                </Button>

                <Modal
                    title="เพิ่มรายการแจ้งหนี้"
                    open={isModalOpen}
                    footer={null} // Use custom footer
                    onCancel={handleCancel}
                >
                    <div>
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
                            {Array.from({ length: 6 }, (_, i) => (2567 + i)).map((year) => (
                                <option key={year} value={year.toString()}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">รายการ</th>
                                <th scope="col">จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={electricityLabel}
                                        onChange={handleElectricityLabelChange}
                                        style={{ width: '100%' }} // Make input full width
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={rentAmount}
                                        onChange={handleRentChange}
                                        style={{ width: '100%' }} // Make input full width
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={electricityLabel}
                                        onChange={handleElectricityLabelChange}
                                        style={{ width: '100%' }} // Make input full width
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={electricityAmount}
                                        onChange={handleElectricityChange}
                                        style={{ width: '100%' }} // Make input full width
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ marginTop: 16 }}>
                        <Button className="button-primary" onClick={handleOk}>
                            บันทึก
                        </Button>
                    </div>
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default InvoiceForm;
