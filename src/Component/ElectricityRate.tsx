import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig"; // Adjust the import path based on your project structure
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./ElectricityRate.css";

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
    const currentMonthName = currentMonth.split(' ')[0]; // Extract month name
    const index = months.indexOf(currentMonthName);
    return index > 0 ? `${months[index - 1]} ${currentMonth.split(' ')[1]}` : `${months[months.length - 1]} ${currentMonth.split(' ')[1]}`;
};

const ElectricityRate: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState("มกราคม");
    const [selectedYear, setSelectedYear] = useState("2567");
    const [electricityData, setElectricityData] = useState<ElectricityDataState>({
        // Initialize with default values
    });

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
                // Retrieve data from Firestore
                const fetchedData = docSnap.data() as ElectricityDataState;

                // Merge fetched data with existing data
                setElectricityData(prevData => {
                    const updatedData = { ...prevData, ...fetchedData };
                    return updatedData;
                });
            } else {
                // If no data exists, set default values
                setElectricityData(prevData => ({
                    ...prevData,
                    '201': { previous: '0', current: '0', units: '0', amount: '0' },
                    '202': { previous: '0', current: '0', units: '0', amount: '0' },
                    '203': { previous: '0', current: '0', units: '0', amount: '0' },
                    '204': { previous: '0', current: '0', units: '0', amount: '0' },
                    '205': { previous: '0', current: '0', units: '0', amount: '0' },
                    '206': { previous: '0', current: '0', units: '0', amount: '0' },
                    '207': { previous: '0', current: '0', units: '0', amount: '0' },
                    '208': { previous: '0', current: '0', units: '0', amount: '0' },
                    '309': { previous: '0', current: '0', units: '0', amount: '0' },
                    '310': { previous: '0', current: '0', units: '0', amount: '0' },
                    '311': { previous: '0', current: '0', units: '0', amount: '0' },
                    '312': { previous: '0', current: '0', units: '0', amount: '0' },
                    '313': { previous: '0', current: '0', units: '0', amount: '0' },
                    '314': { previous: '0', current: '0', units: '0', amount: '0' },
                    '315': { previous: '0', current: '0', units: '0', amount: '0' },
                    '316': { previous: '0', current: '0', units: '0', amount: '0' },
                    '225': { previous: '0', current: '0', units: '0', amount: '0' },
                    '226': { previous: '0', current: '0', units: '0', amount: '0' },
                    '227': { previous: '0', current: '0', units: '0', amount: '0' },
                    '228': { previous: '0', current: '0', units: '0', amount: '0' },
                    '329': { previous: '0', current: '0', units: '0', amount: '0' },
                    '330': { previous: '0', current: '0', units: '0', amount: '0' },
                    '331': { previous: '0', current: '0', units: '0', amount: '0' },
                    '332': { previous: '0', current: '0', units: '0', amount: '0' },
                    // Add other rooms as needed
                }));
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
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
        fetchDataForMonth(selectedMonth, selectedYear);
        if (selectedMonth !== "มกราคม") {
            fetchPreviousMonthData(selectedMonth, selectedYear);
        }
    }, [selectedMonth, selectedYear]);

    const saveDataToFirestore = async () => {
        const monthYear = `${selectedMonth} ${selectedYear}`;
        try {
            await setDoc(doc(db, "electricityData", monthYear), electricityData);
            alert("Data saved successfully!");
        } catch (error) {
            console.error("Error saving data: ", error);
            alert("Failed to save data.");
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
        const previousValue = parseInt(previous, 10);
        const currentValue = parseInt(current, 10);
        const units = currentValue - previousValue;
        return units.toString();
    };

    const calculateAmount = (units: string): string => {
        const unitsValue = parseInt(units, 10);
        const amount = unitsValue * 9;
        return amount.toString();
    };

    const calculateTotalAmount = (): number => {
        return Object.values(electricityData).reduce((total, data) => {
            return total + parseFloat(data.amount || '0');
        }, 0);
    };

    return (
        <>
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
                            <option value="2567">2567</option>
                            <option value="2568">2568</option>
                            <option value="2569">2569</option>
                            <option value="2570">2570</option>
                            <option value="2571">2571</option>
                            <option value="2572">2572</option>
                            <option value="2573">2573</option>
                            {/* Add more years as needed */}
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
                            {Object.keys(electricityData).map(room => (
                                <tr key={room}>
                                    <th>{room}</th>
                                    <td className="color">
                                        <input
                                            type="number"
                                            value={electricityData[room].previous}
                                            onChange={(e) => handleInputChange(room, 'previous', e.target.value)}
                                        />
                                    </td>
                                    <td className="color-electricity">
                                        <input
                                            type="number"
                                            value={electricityData[room].current}
                                            onChange={(e) => handleInputChange(room, 'current', e.target.value)}
                                        />
                                    </td>
                                    <td className="color-tomato">
                                        <input
                                            type="number"
                                            value={electricityData[room].units}
                                            onChange={(e) => handleInputChange(room, 'units', e.target.value)}
                                        />
                                    </td>
                                    <td className="color-greenyellow">
                                        <input
                                            type="number"
                                            value={electricityData[room].amount}
                                            onChange={(e) => handleInputChange(room, 'amount', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={4} className="total-label">Total Amount:</td>
                                <td className="color-greenyellow">{calculateTotalAmount()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="save-button">
                        <button className="btn btn-primary" onClick={saveDataToFirestore}>
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ElectricityRate;
