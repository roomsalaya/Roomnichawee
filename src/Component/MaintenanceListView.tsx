import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Navbar from './Navbar';
import { List, Spin, message, Modal } from 'antd';
import './MaintenanceListView.css'
import Footer from './Footer';

interface MaintenanceReportData {
    id: string;
    issueDescription: string;
    location: string;
    urgency: string;
    imageUrl?: string;
    timestamp: any;
    status?: string;
}

const MaintenanceListView: React.FC = () => {
    const [reports, setReports] = useState<MaintenanceReportData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedReport, setSelectedReport] = useState<MaintenanceReportData | null>(null);

    useEffect(() => {
        const fetchMaintenanceReports = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'maintenanceReports'));
                const fetchedReports: MaintenanceReportData[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as Omit<MaintenanceReportData, 'id'>
                }));
                setReports(fetchedReports);
            } catch (error) {
                console.error('Error fetching maintenance reports:', error);
                message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
            } finally {
                setLoading(false);
            }
        };

        fetchMaintenanceReports();
    }, []);

    const showModal = (report: MaintenanceReportData) => {
        setSelectedReport(report);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedReport(null);
    };

    return (
        <div className="maintenance-list-wrapper">
            <Navbar />
            <div className="maintenance-list-container">
                <h3>รายการแจ้งซ่อมแซม</h3>
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : (
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={reports}
                        renderItem={(report) => (
                            <List.Item key={report.id} onClick={() => showModal(report)} style={{ cursor: 'pointer' }}>
                                <List.Item.Meta title={`สถานที่: ${report.location}`} />
                                <p>{`รายละเอียด: ${report.issueDescription}`}</p>
                            </List.Item>
                        )}
                    />
                )}
            </div>
            <Modal
                title={`รายละเอียดการแจ้งซ่อม: ${selectedReport?.location}`}
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                {selectedReport && (
                    <>
                        <p>{`รายละเอียด: ${selectedReport.issueDescription}`}</p>
                        {selectedReport.imageUrl && (
                            <img
                                src={selectedReport.imageUrl}
                                alt="ปัญหา"
                                style={{ maxWidth: '100%', maxHeight: '300px' }}
                            />
                        )}
                        <p>{`วันที่แจ้ง: ${new Date(selectedReport.timestamp.seconds * 1000).toLocaleString()}`}</p>
                        <p>{`สถานะ: ${selectedReport.status || 'ยังไม่ได้ระบุ'}`}</p>
                    </>
                )}
            </Modal>
            <Footer />
        </div>
    );
};

export default MaintenanceListView;
