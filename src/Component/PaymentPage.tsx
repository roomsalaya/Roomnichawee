import React, { useEffect, useState } from 'react';
import { Card, Space, Button, Upload, message, Select, Spin, Tooltip } from 'antd';
import { CopyOutlined, UploadOutlined } from '@ant-design/icons';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'; // Add addDoc import
import { getAuth } from 'firebase/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import './PaymentPage.css';

const { Option } = Select;

// Interface for invoice data
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

const PaymentPage: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const firestore = getFirestore();
    const auth = getAuth();

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

                    const filteredInvoices = invoicesList.filter(invoice => invoice.room === room);
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
            setUploadedImage(reader.result as string); // Set the uploaded image
        };
        reader.readAsDataURL(file); // Read the file as a data URL
        message.success(`${file.name} uploaded successfully.`);
        return false; // Prevent auto upload
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                message.success("Copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
    };

    // Function to submit payment information
    const handleSubmitPayment = async () => {
        if (!selectedInvoice) {
            message.error("Please select an invoice.");
            return;
        }

        try {
            const paymentData = {
                invoiceId: selectedInvoice.id,
                room: selectedInvoice.room,
                month: selectedInvoice.month,
                year: selectedInvoice.year,
                total: selectedInvoice.total,
                uploadedImage,
                userId: auth.currentUser?.uid,
                timestamp: new Date()
            };

            // Save payment data to Firestore
            const paymentCollection = collection(firestore, 'payments'); // Create a collection for payments
            await addDoc(paymentCollection, paymentData);

            message.success("Payment information submitted successfully!");
            setUploadedImage(null); // Clear uploaded image
            setSelectedInvoice(null); // Clear selected invoice
        } catch (error) {
            console.error("Error submitting payment information: ", error);
            message.error("Failed to submit payment information. Please try again.");
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
                                                <img 
                                                    src={uploadedImage} 
                                                    alt="Uploaded Slip" 
                                                    style={{ marginTop: 10, maxWidth: '100%', height: 'auto' }} 
                                                />
                                            )}

                                            <Button
                                                type="primary"
                                                style={{ marginTop: 20 }}
                                                disabled={!selectedInvoice}
                                                onClick={handleSubmitPayment} // Call the submission function
                                            >
                                                ส่งข้อมูลการชำระเงิน
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <p>ไม่มีบิลสำหรับห้องนี้</p>
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
