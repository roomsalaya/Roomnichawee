import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Adjust the import path based on your project structure
import { doc, getDoc } from "firebase/firestore";
import * as XLSX from 'xlsx'; // Import XLSX library
import "./Showelectricity.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Define the shape of the electricity data for each room
interface ElectricityData {
    previous: string;
    current: string;
    units: string;
    amount: string;
}

// Define the type for the state holding electricity data
interface ElectricityDataState {
    [key: string]: ElectricityData;
}

const Showelectricity: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState("มกราคม");
    const [selectedYear, setSelectedYear] = useState("2567");
    const [electricityData, setElectricityData] = useState<ElectricityDataState>({});

    // Define the order of the rooms
    const roomOrder = [
        '201', '202', '203', '204', '205', '206', '207', '208',
        '309', '310', '311', '312', '313', '314', '315', '316',
        '225', '226', '227', '228', '329', '330', '331', '332'
    ];

    useEffect(() => {
        fetchDataForMonth(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(event.target.value);
    };

    const fetchDataForMonth = async (month: string, year: string) => {
        const monthYear = `${month} ${year}`;
        try {
            const docRef = doc(db, "electricityData", monthYear);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const fetchedData = docSnap.data() as ElectricityDataState;
                setElectricityData(fetchedData);
            } else {
                setElectricityData({});
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const calculateTotalAmount = (): number => {
        return Math.round(Object.values(electricityData).reduce((total, data) => {
            return total + (parseFloat(data.amount) || 0);
        }, 0));
    };

    const downloadExcel = () => {
        // Prepare data for the Excel file
        const data = roomOrder.map(room => ({
            Room: room,
            Previous: electricityData[room]?.previous || '',
            Current: electricityData[room]?.current || '',
            Units: electricityData[room]?.units || '',
            Amount: Math.round(parseFloat(electricityData[room]?.amount) || 0)
        }));

        // Add a total row
        data.push({
            Room: 'รวม',
            Previous: '',
            Current: '',
            Units: '',
            Amount: calculateTotalAmount()
        });

        // Create a new workbook and add a worksheet with the data
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Electricity Data");

        // Generate buffer and trigger download
        XLSX.writeFile(wb, `Electricity_Data_${selectedMonth}_${selectedYear}.xlsx`);
    };

    return (
        <>
            <Navbar />
            <div className="showelectricity-container">
                <div className="showelectricityr">
                    <h3>ดูข้อมูลการใช้ไฟฟ้า</h3>
                    <div className="dropdown">
                        <select
                            className="form-select"
                            aria-label="เลือกเดือน"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            <option value="มกราคม">มกราคม</option>
                            <option value="กุมภาพันธ์">กุมภาพันธ์</option>
                            <option value="มีนาคม">มีนาคม</option>
                            <option value="เมษายน">เมษายน</option>
                            <option value="พฤษภาคม">พฤษภาคม</option>
                            <option value="มิถุนายน">มิถุนายน</option>
                            <option value="กรกฎาคม">กรกฎาคม</option>
                            <option value="สิงหาคม">สิงหาคม</option>
                            <option value="กันยายน">กันยายน</option>
                            <option value="ตุลาคม">ตุลาคม</option>
                            <option value="พฤศจิกายน">พฤศจิกายน</option>
                            <option value="ธันวาคม">ธันวาคม</option>
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
                    </div>
                    <button onClick={downloadExcel}>ดาวน์โหลด Excel</button>
                </div>
                <div className="table-container">
                    <table className="table" id="electricity-table">
                        <thead>
                            <tr>
                                <th>ห้องพัก</th>
                                <th>เลขก่อนหน้า</th>
                                <th>เลขล่าสุด</th>
                                <th>หน่วยที่ใช้</th>
                                <th>จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomOrder.map(room => (
                                <tr key={room}>
                                    <th>{room}</th>
                                    <td className="color">{electricityData[room]?.previous || ''}</td>
                                    <td className="color-electricity">{electricityData[room]?.current || ''}</td>
                                    <td className="color-tomato">{electricityData[room]?.units || ''}</td>
                                    <td className="color-greenyellow">{Math.round(parseFloat(electricityData[room]?.amount) || 0)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={4} className="total-label">รวม</td>
                                <td className="color-greenyellow">
                                    {calculateTotalAmount()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Showelectricity;
