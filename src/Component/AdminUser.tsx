import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Row, Col, Card, Button, Spin, message, Modal } from 'antd'; // นำเข้า Modal จาก Ant Design
import Navbar from './Navbar';
import Footer from './Footer';
import './AdminUser.css';

// กำหนดประเภทของผู้ใช้พร้อมสถานะห้อง
interface User {
    id: string;
    name: string;
    room: string;
    email: string;
    phone: string;
    rental: string;
    rent: number;
    water: number;
    electricity: number;
    roomStatus: 'available' | 'occupied';
}

// กำหนดประเภทสำหรับการอัปเดตบางส่วน
type PartialUserUpdate = Partial<Omit<User, 'id'>>;

const AdminUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [updatedUser, setUpdatedUser] = useState<PartialUserUpdate | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // จัดการสถานะ Modal
    const auth = getAuth();
    const db = getFirestore();
    const admin = auth.currentUser;

    useEffect(() => {
        if (admin) {
            const fetchUsers = async () => {
                setLoading(true);
                try {
                    const usersCollection = collection(db, 'users');
                    const usersSnapshot = await getDocs(usersCollection);
                    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];

                    usersList.sort((a, b) => {
                        const roomA = parseInt(a.room, 10);
                        const roomB = parseInt(b.room, 10);
                        return roomA - roomB;
                    });

                    setUsers(usersList);
                } catch (error) {
                    console.error("Error fetching users:", error);
                    message.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        }
    }, [admin, db]);

    const handleUserClick = (user: User) => {
        if (selectedUser?.id === user.id) {
            setSelectedUser(null);
            setUpdatedUser(null);
        } else {
            setSelectedUser(user);
            setUpdatedUser({ ...user });
            setIsModalVisible(true); // แสดง Modal เมื่อคลิกผู้ใช้
        }
    };

    const handleUpdate = async () => {
        if (updatedUser && selectedUser) {
            setLoading(true);
            try {
                const userDoc = doc(db, 'users', selectedUser.id);
                await updateDoc(userDoc, updatedUser as any);
                setSelectedUser(null);
                setUpdatedUser(null);
                message.success('อัปเดตข้อมูลสำเร็จ');

                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];

                usersList.sort((a, b) => {
                    const roomA = parseInt(a.room, 10);
                    const roomB = parseInt(b.room, 10);
                    return roomA - roomB;
                });

                setUsers(usersList);
                setIsModalVisible(false); // ปิด Modal หลังจากอัปเดต
            } catch (error) {
                console.error("Error updating user:", error);
                message.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        field: keyof User
    ) => {
        setUpdatedUser(prevUser => (prevUser ? {
            ...prevUser,
            [field]: e.target.value
        } : {}));
    };

    const handleCancel = () => {
        setIsModalVisible(false); // ปิด Modal เมื่อกดปุ่มยกเลิก
        setSelectedUser(null);
        setUpdatedUser(null);
    };

    return (
        <>
            <Navbar />
            <div className="admin-container">
                <h2>จัดการข้อมูลผู้ใช้</h2>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <>
                        <div className="user-list">
                            <Row gutter={[16, 8]}>
                                {users.map(user => (
                                    <Col span={12} key={user.id}>
                                        <Card
                                            title={user.room}
                                            onClick={() => handleUserClick(user)}
                                            hoverable
                                            className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                                        >
                                            <p>{user.email}</p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </>
                )}

                {/* Modal สำหรับการแสดงรายละเอียดและอัปเดตข้อมูลผู้ใช้ */}
                <Modal
                    title="ข้อมูลผู้ใช้"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                >
                    {selectedUser && (
                        <form>
                            <label>
                                ชื่อ:
                                <input
                                    type="text"
                                    className="input-field" // Added class
                                    value={updatedUser?.name || ''}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                />
                            </label>
                            <label>
                                ห้อง:
                                <input
                                    type="text"
                                    className="input-field" // Added class
                                    value={updatedUser?.room || ''}
                                    onChange={(e) => handleInputChange(e, 'room')}
                                />
                            </label>
                            <label>
                                อีเมล:
                                <input
                                    type="text"
                                    className="input-field" // Added class
                                    value={updatedUser?.email || ''}
                                    onChange={(e) => handleInputChange(e, 'email')}
                                />
                            </label>
                            <label>
                                เบอร์โทรศัพท์:
                                <input
                                    type="text"
                                    className="input-field" // Added class
                                    value={updatedUser?.phone || ''}
                                    onChange={(e) => handleInputChange(e, 'phone')}
                                />
                            </label>
                            <label>
                                สัญญาเช่า:
                                <input
                                    type="text"
                                    className="input-field" // Added class
                                    value={updatedUser?.rental || ''}
                                    onChange={(e) => handleInputChange(e, 'rental')}
                                />
                            </label>
                            <label>
                                ค่าเช่า:
                                <input
                                    type="number"
                                    className="input-field" // Added class
                                    value={updatedUser?.rent || ''}
                                    onChange={(e) => handleInputChange(e, 'rent')}
                                />
                            </label>
                            <label>
                                ค่าน้ำ:
                                <input
                                    type="number"
                                    className="input-field" // Added class
                                    value={updatedUser?.water || ''}
                                    onChange={(e) => handleInputChange(e, 'water')}
                                />
                            </label>
                            <label>
                                ค่าไฟ หน่วยละ:
                                <input
                                    type="number"
                                    className="input-field" // Added class
                                    value={updatedUser?.electricity || ''}
                                    onChange={(e) => handleInputChange(e, 'electricity')}
                                />
                            </label>
                            <label>
                                สถานะห้อง:
                                <select
                                    className="select-field" // Added class
                                    value={updatedUser?.roomStatus || 'occupied'}
                                    onChange={(e) => handleInputChange(e, 'roomStatus' as keyof User)}
                                >
                                    <option value="available">ว่าง</option>
                                    <option value="occupied">ไม่ว่าง</option>
                                </select>
                            </label>

                            {/* Move buttons here */}
                            <div style={{ marginTop: '16px' }}>
                                <Button key="cancel" onClick={handleCancel} style={{ marginRight: '8px' }}>
                                    ยกเลิก
                                </Button>
                                <Button key="submit" type="primary" onClick={handleUpdate}>
                                    อัปเดตข้อมูล
                                </Button>
                            </div>
                        </form>
                    )}
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default AdminUser;
