import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db, doc, getDoc } from './firebaseConfig';
import './Login.css';
import Footer from './Footer';

const Login: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');

        if (savedEmail) {
            form.setFieldsValue({ email: savedEmail });
        }
        if (savedPassword) {
            form.setFieldsValue({ password: savedPassword });
        }
    }, [form]);

    const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
        setLoading(true);

        console.log('Email:', values.email);
        console.log('Password:', values.password);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            const userDoc = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
                const userData = docSnap.data();

                if (values.remember) {
                    localStorage.setItem('email', values.email);
                    localStorage.setItem('password', values.password);
                } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                }

                if (userData.role === 'admin') {
                    navigate('/admindashboard');
                } else if (userData.role === 'user') {
                    navigate('/Profile');
                } else {
                    message.error('บทบาทของผู้ใช้ไม่ถูกต้อง');
                    await auth.signOut();
                }
            } else {
                message.error('ไม่พบข้อมูลผู้ใช้ในระบบ');
                await auth.signOut();
            }
        } catch (error: any) {
            console.error('Error during sign-in:', error);
            message.error('การล็อกอินล้มเหลว กรุณาตรวจสอบข้อมูลประจำตัวของคุณ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <h2>ล็อกอิน</h2>
                <Form form={form} name="login" initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ required: true, message: 'กรุณากรอกอีเมลของคุณ!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="อีเมล" type="email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่านของคุณ!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>จำรหัสผ่าน</Checkbox>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            ล็อกอิน
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Footer />
        </>
    );
};

export default Login;
