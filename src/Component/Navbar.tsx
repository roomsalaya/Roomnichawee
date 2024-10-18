import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Modal, List, Badge, Dropdown } from 'antd';
import {
    LoginOutlined, EllipsisOutlined,
    BellOutlined, HeartTwoTone,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, writeBatch, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './Navbar.css';

const { Header } = Layout;

interface Notification {
    id: string;
    message: string;
    timestamp: Date;
    read: boolean;
    userImage?: string;
}

const Navbar: React.FC = () => {
    const [role, setRole] = useState<'admin' | 'user' | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRoleAndNotifications = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    const userData = docSnap.data() as { role: 'admin' | 'user'; userImage?: string };
                    setRole(userData.role || null);

                    let notificationsQuery;
                    if (userData.role === 'admin') {
                        notificationsQuery = query(collection(db, 'notifications'), where('userId', '==', user.uid));
                    } else {
                        notificationsQuery = query(
                            collection(db, 'notifications'),
                            where('userId', '==', user.uid)
                        );
                    }

                    const notificationsSnap = await getDocs(notificationsQuery);
                    const userNotifications: Notification[] = notificationsSnap.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            message: data.message,
                            timestamp: data.timestamp
                                ? (data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp.seconds * 1000))
                                : new Date(), // ตรวจสอบรูปแบบ timestamp
                            read: data.read,
                            userImage: data.userImage,
                        };
                    });

                    const sortedNotifications = userNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                    setNotifications(sortedNotifications);
                } else {
                    setRole(null);
                }
            } else {
                setRole(null);
            }
        };

        fetchUserRoleAndNotifications();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error: Error) => {
                console.error('เกิดข้อผิดพลาดในการออกจากระบบ: ', error);
            });
    };

    const handleNotificationClick = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const markAsRead = async () => {
        const unreadNotifications = notifications.filter(notification => !notification.read);
        const batch = writeBatch(db);
        unreadNotifications.forEach(notification => {
            const notificationRef = doc(db, 'notifications', notification.id);
            batch.update(notificationRef, { read: true });
        });

        try {
            await batch.commit();
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, read: true }))
            );
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตการแจ้งเตือน: ', error);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'notifications', id));
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== id)
            );
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบการแจ้งเตือน: ', error);
        }
    };

    const unreadNotifications = notifications.filter(notification => !notification.read);

    // Define the menu for Dropdown
    const menu = (
        <Menu>
            {role === 'admin' && (
                <>
                    <Menu.Item key="dashboard">
                        <Link to="/adminDashboard">แดชบอร์ด</Link>
                    </Menu.Item>
                    <Menu.Item key="adminusers">
                        <Link to="/adminusers">แก้ไขข้อมูลผู้เช่า</Link>
                    </Menu.Item>
                    <Menu.Item key="ElectricityRate">
                        <Link to="/ElectricityRate">จดมิเตอร์</Link>
                    </Menu.Item>
                    <Menu.Item key="InvoiceForm">
                        <Link to="/InvoiceForm">ใบแจ้งหนี้</Link>
                    </Menu.Item>
                    <Menu.Item key="AdminInvoicesPage">
                        <Link to="/AdminInvoicesPage">แก้ไขบิลแจ้งหนี้</Link>
                    </Menu.Item>
                    <Menu.Item key="AdminPaymentStatusPage">
                        <Link to="/AdminPaymentStatusPage">สถานะการชำระเงิน</Link>
                    </Menu.Item>
                    <Menu.Item key="AdminPaymentStatusPage">
                        <Link to="/ChangePassword">ChangePassword</Link>
                    </Menu.Item>
                </>
            )}
            {role === 'user' && (
                <>
                    <Menu.Item key="profile">
                        <Link to="/profile">โปรไฟล์</Link>
                    </Menu.Item>
                    <Menu.Item key="SentInvoicesPage">
                        <Link to="/SentInvoicesPage">บิลแจ้งหนี้</Link>
                    </Menu.Item>
                    <Menu.Item key="PaymentPage">
                        <Link to="/PaymentPage">ส่งหลักฐานการโอน</Link>
                    </Menu.Item>
                    <Menu.Item key="PaymentHistoryPage">
                        <Link to="/PaymentHistoryPage">ประวัติการชำระเงิน</Link>
                    </Menu.Item>
                </>
            )}
            <Menu.Item key="logout" onClick={handleLogout}>
                <LoginOutlined /> ออกจากระบบ
            </Menu.Item>
        </Menu>
    );

    return (
        <Header style={{ background: '#fff', padding: 0, position: 'relative' }}>
            <div className="logo" style={{ float: 'left', marginLeft: '20px' }}>
                <h2>หอพักณิชชาวีร์</h2>
            </div>

            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['home']}
                style={{ lineHeight: '64px', float: 'right' }}
            />

            <div style={{ position: 'absolute', right: '20px', top: '20px', display: 'flex', alignItems: 'center' }}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <EllipsisOutlined style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
                </Dropdown>

                <Badge count={unreadNotifications.length} className="notification-badge">
                    <BellOutlined
                        className="notification-icon"
                        onClick={handleNotificationClick}
                        style={{ fontSize: '20px', cursor: 'pointer' }}
                    />
                </Badge>
            </div>

            {role === null && (
                <Button
                    type="primary"
                    style={{ marginRight: '10px', float: 'right' }}
                    onClick={() => navigate('/login')}
                >
                    เข้าสู่ระบบ
                </Button>
            )}

            <Modal
                title="การแจ้งเตือน"
                visible={isModalVisible}
                onCancel={handleModalClose}
                className="notification-modal"
                footer={[
                    <Button key="back" onClick={handleModalClose}>
                        ปิด
                    </Button>,
                    <Button key="markAsRead" onClick={markAsRead} disabled={unreadNotifications.length === 0}>
                        อ่านแจ้งเตือนทั้งหมด
                    </Button>,
                ]}
            >
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            className={`notification-item ${item.read ? 'read' : 'unread'}`}
                            actions={[
                                <Button onClick={() => handleDeleteNotification(item.id)}>ลบ</Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<HeartTwoTone twoToneColor="#eb2f96" />}
                                title={<span style={{ color: '#eb2f96' }}>{item.message}</span>}
                                description={<span style={{ color: '#555' }}>{item.timestamp.toLocaleString()}</span>}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </Header>
    );
};

export default Navbar;
