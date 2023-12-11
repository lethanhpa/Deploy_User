import React, { useState, useEffect } from 'react';
import Styles from "../../styles/auth.module.css";
import axios from '../../libraries/axiosClient';
import Image from "next/image";
import logo from "../../images/logo.png"
import Link from "next/link";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/router';
import { Button, Input, Form } from 'antd';
import axiosClient from '../../libraries/axiosClient';
import { GoogleLogin } from 'react-google-login';

const Index = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const responseGoogle = async (response) => {
        try {
            // Xử lý dữ liệu từ Google response ở đây
            console.log(response);

            // Kiểm tra nếu tài khoản đã tồn tại trong hệ thống, thực hiện đăng nhập
            const existingUser = await axios.post("/customers/google-login", { googleId: response.profileObj.googleId });
            if (existingUser.data.token) {
                // Đăng nhập thành công
                const { token } = existingUser.data;
                console.log('««««« token »»»»»', token);
                localStorage.setItem('token', token);
                axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
                toast.success("Login successfully!!!");
                router.push('/products');
            } else {
                // Tài khoản chưa tồn tại, có thể tạo tài khoản mới
                // Thực hiện các bước để tạo tài khoản mới
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const account = {
            email,
            password,
        };

        try {
            const response = await axios.post("/customers/login", account);
            const { token } = response.data;

            // Kiểm tra trạng thái khóa trước khi cho phép đăng nhập
            const customer = await axios.get("/customers/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (customer.data.isLocked) {
                toast.error("Your account has been locked.");
            } else {
                localStorage.setItem('token', token);

                axiosClient.defaults.headers.Authorization = `Bearer ${token}`;

                toast.success("Login successfully!!!");

                router.push('/products');
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
        }
    };
    return (
        <>
            <div className={Styles.form}>
                <div className={Styles.logo}>
                    <Image className={Styles.logo} src={logo} alt="logo" />
                </div>
                <h4 className={Styles.form_title}>YOUR ARE MY EVERYTHING</h4>
                <Form
                    className={Styles.form_item}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                >
                    <p>
                        Welcome to YAME
                        <br />
                        YAME - Stand out with style and variety!
                    </p>
                    <span>Email:</span>
                    <Form.Item name="email" rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]} hasFeedback>
                        <Input
                            className={Styles.mb_2}
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </Form.Item>

                    <span>Password:</span>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]} hasFeedback>
                        <Input.Password
                            className={Styles.mb_2}
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder='Passwords must be at least 6 characters'
                        />
                    </Form.Item>

                    <div>
                        <GoogleLogin
                            clientId="338979881605-mhkugh3nmiqmpadrc644fbvj12p4smkr.apps.googleusercontent.com"
                            buttonText="Đăng nhập với Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                        }}
                    >
                        <Button onClick={handleSubmit} type="submit" htmlType='submit' className={Styles.btn}>
                            Sign In
                        </Button><ToastContainer />

                        <br />
                        <i>
                            Not a Member? <Link href="/signup">Join Us.</Link>
                        </i>
                    </Form.Item>
                </Form>
            </div >
        </>
    );
};

export default Index;