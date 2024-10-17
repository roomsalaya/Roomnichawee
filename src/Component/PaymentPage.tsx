import React, { useEffect, useState } from 'react';
import { Card, Space, Button, Upload, message, Select, Spin, Tooltip } from 'antd';
import { CopyOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { getFirestore, collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import Navbar from './Navbar';
import Footer from './Footer';
import './PaymentPage.css';

const { Option } = Select;

interface InvoiceData {
    id: string;
    room: string;
    month: string;
    year: number;
    rent: string;
    water: string;
    electricity: string;
    fine: string;
    total: number;
    roomStatus: string;
    pdfUrl?: string;
}

// Month mapping for sorting
const monthMap: { [key: string]: number } = {
    'มกราคม': 1,
    'กุมภาพันธ์': 2,
    'มีนาคม': 3,
    'เมษายน': 4,
    'พฤษภาคม': 5,
    'มิถุนายน': 6,
    'กรกฎาคม': 7,
    'สิงหาคม': 8,
    'กันยายน': 9,
    'ตุลาคม': 10,
    'พฤศจิกายน': 11,
    'ธันวาคม': 12,
};

const PaymentPage: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const firestore = getFirestore();
    const auth = getAuth();
    const storage = getStorage();

    useEffect(() => {
        const fetchInvoices = async () => {
            setIsLoading(true);
            try {
                const user = auth.currentUser;
                if (user) {
                    const userEmail = user.email;
                    const room = userEmail?.split('@')[0] || null;

                    const invoicesCollection = collection(firestore, 'invoices');
                    const invoicesSnapshot = await getDocs(invoicesCollection);
                    const invoicesList = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InvoiceData[];

                    // Filter and sort invoices by month using the monthMap
                    const filteredInvoices = invoicesList
                        .filter(invoice => invoice.room === room)
                        .sort((a, b) => {
                            const monthA = monthMap[a.month];
                            const monthB = monthMap[b.month];
                            return monthA - monthB;
                        });

                    setInvoices(filteredInvoices);
                }
            } catch (error) {
                console.error("Error fetching invoices data: ", error);
                message.error("Failed to load invoices. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, [firestore, auth]);

    const handleInvoiceSelect = (value: string) => {
        const selected = invoices.find(invoice => invoice.id === value);
        setSelectedInvoice(selected || null);
    };

    const handleUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        message.success(`${file.name} อัปโหลดเรียบร้อยแล้ว.`);
        return false; // Prevent auto upload
    };

    const handleRemoveImage = () => {
        setUploadedImage(null);
        message.success("รูปภาพที่อัปโหลดถูกลบออก.");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                message.success("คัดลอกไปยังคลิปบอร์ดแล้ว!");
            })
            .catch(err => {
                console.error("ไม่สามารถคัดลอกข้อความ: ", err);
            });
    };

    const handleSubmitPayment = async () => {
        if (!selectedInvoice) {
            message.error("โปรดเลือกใบแจ้งหนี้.");
            return;
        }

        setIsSubmitting(true);

        try {
            let imageUrl: string | null = null;

            if (uploadedImage) {
                const storageRef = ref(storage, `payments/${selectedInvoice.room}/${selectedInvoice.id}.png`);
                await uploadString(storageRef, uploadedImage, 'data_url');
                imageUrl = await getDownloadURL(storageRef);
            }

            const paymentData = {
                invoiceId: selectedInvoice.id,
                room: selectedInvoice.room,
                month: selectedInvoice.month,
                year: selectedInvoice.year,
                total: selectedInvoice.total,
                uploadedImage: imageUrl,
                userId: auth.currentUser?.uid,
                timestamp: new Date()
            };

            const paymentCollection = collection(firestore, 'payments');
            await addDoc(paymentCollection, paymentData);

            const usersQuery = query(collection(firestore, 'users'), where('role', '==', 'admin'));
            const usersSnapshot = await getDocs(usersQuery);

            const notificationPromises = usersSnapshot.docs.map(adminUser => {
                const notificationData = {
                    message: `ชำระเงินใหม่ส่งโดยห้อง ${selectedInvoice.room} สำหรับ ${selectedInvoice.month}`,
                    userId: adminUser.id,
                    read: false,
                    timestamp: new Date(),
                };
                return addDoc(collection(firestore, 'notifications'), notificationData);
            });

            await Promise.all(notificationPromises);

            message.success("ส่งข้อมูลการชำระเงินเรียบร้อยแล้ว!");
            setUploadedImage(null); // Clear uploaded image
            setSelectedInvoice(null); // Clear selected invoice
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการส่งข้อมูลการชำระเงิน: ", error);
            message.error("ส่งข้อมูลการชำระเงินไม่สำเร็จ โปรดลองอีกครั้ง");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="payment-container">
                <h3>ส่งหลักฐานการโอน</h3>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Card className='payment-card' title="บัญชีสำหรับชำระหนี้">
                        <p className='scb'>
                            <img src="https://img5.pic.in.th/file/secure-sv1/unnamed4edf9fa04b6e50f3.png" alt="Bank Logo" className='logo-image' />
                            &nbsp; ธนาคารไทยพาณิชย์
                        </p>
                        <p className='scb'>
                            ชื่อบัญชี : ธนกร แดนประเทือง
                        </p>
                        <p className='bum'>
                            เลขบัญชี : 403-992701-1
                            &nbsp;<Tooltip title="คัดลอกหมายเลขบัญชี">
                                <Button
                                    shape="circle"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard('403992701-1')}
                                    className='copy-button'
                                />
                            </Tooltip>
                        </p>
                        <p className='scb1'>
                            กำหนดชำระล่าช้าไม่เกินวันที่ 5 ของเดือนถัดไป
                        </p>
                    </Card>

                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        <>
                            {invoices.length > 0 ? (
                                <>
                                    <Select
                                        className="custom-select"
                                        style={{ width: 300, marginBottom: 20 }}
                                        placeholder="เลือกบิล"
                                        onChange={handleInvoiceSelect}
                                        value={selectedInvoice?.id || undefined}
                                    >
                                        {invoices.map(invoice => (
                                            <Option key={invoice.id} value={invoice.id}>
                                                {`${invoice.month} (ยอด: ${invoice.total} บาท, ${invoice.roomStatus})`}
                                            </Option>
                                        ))}
                                    </Select>

                                    {selectedInvoice && (
                                        <>
                                            <Upload beforeUpload={handleUpload} showUploadList={false}>
                                                <Button type="dashed" icon={<UploadOutlined />} style={{ marginTop: 10 }}>
                                                    แนบสลิปเงิน
                                                </Button>
                                            </Upload>

                                            {uploadedImage && (
                                                <div className="image-preview">
                                                    <img
                                                        src={uploadedImage}
                                                        alt="Uploaded Slip"
                                                        className="uploaded-image"
                                                    />
                                                    <Button
                                                        icon={<DeleteOutlined />}
                                                        onClick={handleRemoveImage}
                                                        type="link"
                                                        danger
                                                    >
                                                        ลบรูป
                                                    </Button>
                                                </div>
                                            )}

                                            <Button
                                                type="primary"
                                                onClick={handleSubmitPayment}
                                                loading={isSubmitting}
                                                style={{ marginTop: 20 }}
                                            >
                                                ส่งหลักฐานการชำระเงิน
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <p>ไม่พบบิลที่ต้องชำระ</p>
                            )}
                        </>
                    )}
                </Space>
            </div>
            <Footer />
        </>
    );
};

export default PaymentPage;
