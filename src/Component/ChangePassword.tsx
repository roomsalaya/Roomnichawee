import React, { useState, useEffect } from 'react';
import { getAuth, updatePassword } from 'firebase/auth'; // นำเข้า updatePassword
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Row, Col, Card, Button, Spin, message, Modal } from 'antd'; 
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

const ChangePassword: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [updatedUser, setUpdatedUser] = useState<PartialUserUpdate | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>(''); // สร้าง state สำหรับรหัสผ่านใหม่
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
            setIsModalVisible(true);
        }
    };

    const handleUpdate = async () => {
        if (updatedUser && selectedUser) {
            setLoading(true);
            try {
                const userDoc = doc(db, 'users', selectedUser.id);
                await updateDoc(userDoc, updatedUser as any);

                // ถ้าต้องการเปลี่ยนรหัสผ่าน
                if (newPassword) {
                    const userToUpdate = auth.currentUser;
                    if (userToUpdate) {
                        await updatePassword(userToUpdate, newPassword);
                        message.success('รหัสผ่านถูกเปลี่ยนเรียบร้อยแล้ว');
                    }
                }

                setSelectedUser(null);
                setUpdatedUser(null);
                setNewPassword(''); // รีเซ็ตรหัสผ่าน
                message.success('อัปเดตข้อมูลสำเร็จ');
                setIsModalVisible(false);
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
        setIsModalVisible(false);
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
                                    className="input-field"
                                    value={updatedUser?.name || ''}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                />
                            </label>
                            <label>
                                ห้อง:
                                <input
                                    type="text"
                                    className="input-field"
                                    value={updatedUser?.room || ''}
                                    onChange={(e) => handleInputChange(e, 'room')}
                                />
                            </label>
                            {/* ฟิลด์อื่น ๆ เช่น อีเมล เบอร์โทรศัพท์... */}
                            <label>
                                รหัสผ่านใหม่:
                                <input
                                    type="password"
                                    className="input-field"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)} // อัปเดตรหัสผ่านใหม่
                                />
                            </label>
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

export default ChangePassword;