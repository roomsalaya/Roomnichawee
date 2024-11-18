import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Navbar from './Navbar';
import './AdminDashboard.css';
import { Row, Col, Card, Progress, Spin, Input, List, message as AntMessage } from 'antd';
import Footer from './Footer';

interface User {
    id: string;
    name: string;
    phone: string;
    room: string;
}

const AdminDashboard: React.FC = () => {
    const [userCount, setUserCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const auth = getAuth();
    const db = getFirestore();
    const admin = auth.currentUser;

    useEffect(() => {
        if (admin?.uid) {
            const fetchUsers = async () => {
                setLoading(true);
                try {
                    const usersCollection = collection(db, 'users');
                    const usersSnapshot = await getDocs(usersCollection);

                    const usersData: User[] = [];
                    usersSnapshot.forEach((doc) => {
                        const data = doc.data();
                        usersData.push({
                            id: doc.id,
                            name: data.name || 'ไม่ทราบชื่อ',
                            phone: data.phone || 'ไม่ระบุเบอร์โทร',
                            room: data.room || 'ไม่ระบุห้อง',
                        });
                    });

                    setUsers(usersData);
                    setFilteredUsers(usersData);
                    setUserCount(usersData.length);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    AntMessage.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        }
    }, [admin, db]);

    // Handle search query change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.trim();
        setSearchQuery(query);

        // Filter users by phone number or room
        if (query) {
            const filtered = users.filter((user) =>
                user.phone.toLowerCase().includes(query.toLowerCase()) ||
                user.room.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const totalRooms = 100;
    const userPercentage = (userCount / totalRooms) * 100;

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>แดชบอร์ด</h2>
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title="จำนวนผู้ใช้">
                                <Progress
                                    percent={userPercentage}
                                    format={() => `${userCount} ห้อง`}
                                    status="active"
                                />
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Input
                                placeholder="ค้นหาเบอร์โทรหรือห้อง"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                            <Card title="ผลการค้นหา">
                                <List
                                    bordered
                                    dataSource={filteredUsers}
                                    renderItem={(user) => (
                                        <List.Item>
                                            {user.name} - {user.phone} - ห้อง: {user.room}
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard;
