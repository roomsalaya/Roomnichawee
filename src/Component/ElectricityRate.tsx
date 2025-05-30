import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Adjust the import path based on your project structure
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./ElectricityRate.css";
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

// Helper function to get the previous month
const getPreviousMonth = (currentMonth: string): string => {
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม",
        "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม",
        "พฤศจิกายน", "ธันวาคม"
    ];
    const currentMonthIndex = months.indexOf(currentMonth);
    return currentMonthIndex > 0
        ? months[currentMonthIndex - 1]
        : months[months.length - 1]; // Wrap around to December if it's January
};

const ElectricityRate: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState("มกราคม");
    const [selectedYear, setSelectedYear] = useState("2567");
    const [electricityData, setElectricityData] = useState<ElectricityDataState>({});

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
                setElectricityData(prevData => {
                    const newData = { ...prevData };
                    for (const room in fetchedData) {
                        newData[room] = {
                            previous: fetchedData[room].previous || '0', // Default to '0'
                            current: fetchedData[room].current || '0',
                            units: fetchedData[room].units || '0',
                            amount: fetchedData[room].amount || '0',
                        };
                    }
                    return newData;
                });
            } else {
                const defaultData = generateDefaultElectricityData();
                setElectricityData(defaultData);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };


    const generateDefaultElectricityData = (): ElectricityDataState => {
        const roomNumbers = [
            '201', '202', '203', '204', '205', '206', '207', '208',
            '309', '310', '311', '312', '313', '314', '315', '316',
            '225', '226', '227', '228', '329', '330', '331', '332'
        ]; // Ordered rooms
        return roomNumbers.reduce((acc, room) => {
            acc[room] = { previous: '0', current: '0', units: '0', amount: '0' };
            return acc;
        }, {} as ElectricityDataState);
    };

    const fetchPreviousMonthData = async (month: string, year: string) => {
        const previousMonth = getPreviousMonth(month);
        const monthYear = `${previousMonth} ${year}`;
        try {
            const docRef = doc(db, "electricityData", monthYear);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Retrieve previous month data from Firestore
                const fetchedData = docSnap.data() as ElectricityDataState;

                // Use the previous month's current readings as the default previous readings for the new month
                setElectricityData(prevData => {
                    const updatedData = { ...prevData };
                    for (const room in fetchedData) {
                        updatedData[room] = {
                            ...updatedData[room],
                            previous: fetchedData[room].current
                        };
                    }
                    return updatedData;
                });
            }
        } catch (error) {
            console.error("Error fetching previous month data: ", error);
        }
    };

    useEffect(() => {
        if (selectedMonth !== "มกราคม") {
            fetchPreviousMonthData(selectedMonth, selectedYear);
        }
    }, [selectedMonth, selectedYear]);

    const saveDataToFirestore = async () => {
        const monthYear = `${selectedMonth} ${selectedYear}`;
        try {
            // Filter out any undefined values and provide default values
            const filteredData = Object.fromEntries(
                Object.entries(electricityData).map(([room, data]) => [
                    room,
                    {
                        previous: data.previous || '0', // Default to '0' if undefined
                        current: data.current || '0',
                        units: data.units || '0',
                        amount: data.amount || '0',
                    }
                ])
            );

            // Log the data being saved for debugging
            console.log("Saving data to Firestore: ", filteredData);

            await setDoc(doc(db, "electricityData", monthYear), filteredData);
            alert("บันทึกสำเร็จ");
        } catch (error) {
            console.error("บันทึกไม่สำเร็จ: ", error);
            alert("บันทึกไม่สำเร็จ.");
        }
    };

    const handleInputChange = (room: string, field: keyof ElectricityData, value: string) => {
        setElectricityData(prevData => {
            const updatedData = {
                ...prevData,
                [room]: {
                    ...prevData[room],
                    [field]: value,
                },
            };

            // Calculate units and amount based on the previous and current values
            if (field === 'previous' || field === 'current') {
                updatedData[room].units = calculateUnits(updatedData[room].previous, updatedData[room].current);
                updatedData[room].amount = calculateAmount(updatedData[room].units);
            }

            if (field === 'units') {
                updatedData[room].amount = calculateAmount(value);
            }

            return updatedData;
        });
    };

    const calculateUnits = (previous: string, current: string): string => {
        const previousValue = parseInt(previous, 10) || 0;
        const currentValue = parseInt(current, 10) || 0;
        const units = currentValue - previousValue;
        return Math.max(units, 0).toString(); // Ensure units are not negative
    };

    const calculateAmount = (units: string): string => {
        const unitsValue = parseInt(units, 10) || 0;
        const amount = unitsValue * 8; // Replace 8 with your rate per unit if necessary
        return amount.toString();
    };

    const calculateTotalAmount = (): number => {
        return Object.values(electricityData).reduce((total, data) => {
            return total + parseFloat(data.amount || '0');
        }, 0);
    };

    return (
        <>
            <Navbar />
            <div className="electricityrate-container">
                <div className="electricityrate">
                    <h3>เลือกรอบจดมิเตอร์ไฟฟ้า</h3>
                    <div className="dropdown">
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
                </div>
                <div className="electricityrate-dropdown">
                    <h3>{`${selectedMonth} ${selectedYear}`}</h3>
                </div>
                <div className="table-container">
                    <table className="table">
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
                            {/* Ordered room numbers */}
                            {[
                                '201', '202', '203', '204', '205', '206', '207', '208',
                                '309', '310', '311', '312', '313', '314', '315', '316',
                                '225', '226', '227', '228', '329', '330', '331', '332'
                            ].map((room) => (
                                <tr key={room}>
                                    <td>{room}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={electricityData[room]?.previous || ''}
                                            onChange={(e) => handleInputChange(room, 'previous', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={electricityData[room]?.current || ''}
                                            onChange={(e) => handleInputChange(room, 'current', e.target.value)}
                                        />
                                    </td>
                                    <td>{electricityData[room]?.units || ''}</td>
                                    <td>{electricityData[room]?.amount || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={saveDataToFirestore}>บันทึกข้อมูล</button>
                <div className="total-amount">
                    <strong>{`จำนวนเงินทั้งหมด: ${calculateTotalAmount()} บาท`}</strong>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ElectricityRate;
