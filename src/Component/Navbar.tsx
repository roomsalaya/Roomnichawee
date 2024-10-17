import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Modal, List, Badge } from 'antd';
import {
    LoginOutlined, UserOutlined, DashboardOutlined,
    StarOutlined, BellOutlined, InboxOutlined, FileSyncOutlined,
    ToolOutlined, BulbOutlined, FileDoneOutlined, HeartTwoTone,
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
    
                    // Sort notifications by timestamp in descending order (most recent first)
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

    const menuItems = [
        role === 'admin' && {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/adminDashboard" className="menu-label">แดชบอร์ด</Link>,
        },
        role === 'admin' && {
            key: 'adminusers',
            icon: <FileSyncOutlined />,
            label: <Link to="/adminusers" className="menu-label">แก้ไขข้อมูลผู้เช่า</Link>,
        },
        //role === 'admin' && {
            //key: 'parcel',
            //icon: <InboxOutlined />,
            //label: <Link to="/parcel" className="menu-label">เพิ่มพัสดุ</Link>,
       //},
        //role === 'admin' && {
           // key: 'maintenanceHistory',
            //icon: <ToolOutlined />,
            //label: <Link to="/MaintenanceList" className="menu-label">ประวัติแจ้งซ่อมแซม</Link>,
       // },
        role === 'admin' && {
            key: 'ElectricityRate',
            icon: <BulbOutlined />,
            label: <Link to="/ElectricityRate" className="menu-label">จดมิเตอร์</Link>,
        },
        role === 'admin' && {
            key: 'InvoiceForm',
            icon: <FileDoneOutlined />,
            label: <Link to="/InvoiceForm" className="menu-label">ใบแจ้งหนี้</Link>,
        },
        role === 'admin' && {
            key: 'AdminInvoicesPage',
            icon: <FileDoneOutlined />,
            label: <Link to="/AdminInvoicesPage" className="menu-label">แก้ไขบิลแจ้งหนี้</Link>,
        },
        role === 'admin' && {
            key: 'AdminPaymentStatusPage',
            icon: <FileDoneOutlined />,
            label: <Link to="/AdminPaymentStatusPage" className="menu-label">สถานะการชำระเงิน</Link>,
        },
        role === 'user' && {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link to="/profile" className="menu-label">โปรไฟล์</Link>,
        },
        role === 'user' && {
            key: 'SentInvoicesPage',
            icon: <FileDoneOutlined />,
            label: <Link to="/SentInvoicesPage" className="menu-label">บิลแจ้งหนี้</Link>,
        },
        role === 'user' && {
            key: 'PaymentPage',
            icon: <FileDoneOutlined />,
            label: <Link to="/PaymentPage" className="menu-label">ส่งหลักฐานการโอน</Link>,
        },
        role === 'user' && {
            key: 'InvoiceDetails',
            icon: <FileDoneOutlined />,
            label: <Link to="/PaymentHistoryPage" className="menu-label">ประวัติการชำระเงิน</Link>,
        },
        {
            key: 'home',
            icon: <StarOutlined />,
            label: <Link to="/home" className="menu-label">เกมจับคู่</Link>,
        },
        role && {
            key: 'logout',
            icon: <LoginOutlined />,
            label: <span className="menu-label-Login" onClick={handleLogout}>ออกจากระบบ</span>,
            onClick: handleLogout,
        },
    ].filter(Boolean) as { key: string; icon: JSX.Element; label: JSX.Element; onClick?: (() => void) | undefined }[];

    return (
        <Header style={{ background: '#fff', padding: 0 }}>
            <div className="logo" style={{ float: 'left', marginLeft: '20px' }}>
                <h2>หอพักณิชชาวีร์</h2>
            </div>

            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['home']}
                style={{ lineHeight: '64px', float: 'right' }}
                items={menuItems}
            />

            <Badge count={unreadNotifications.length} className="notification-badge">
                <BellOutlined
                    className="notification-icon"
                    onClick={handleNotificationClick}
                />
            </Badge>

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
                                title={<span style={{ color: '#eb2f96' }}>{item.message}</span>} // Inline style for title
                                description={<span style={{ color: '#555' }}>{item.timestamp.toLocaleString()}</span>} // Inline style for description
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </Header>
    );
};

export default Navbar;
