import express from "express";
import dotenv from 'dotenv';
import orderModel from "../services/checkoutModel";
const moment = require('moment');
const dateFormat = require('dateformat');
const jwt = require('jsonwebtoken');
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
const checkout = async (req, res) => {
    let dataCart = req.session.cart;
    if (!req.session.cart) {
        dataCart = []
        res.redirect('/cart');
    }
    return res.render('index', { data: { title: 'Thanh toán', rows: dataCart, page: 'order/checkout' } });
}

const insertOrder = async (req, res) => {
    let dataCart = req.session.cart;
    let { fullName, address, email, SDT, idUser, ghiChu, pay } = req.body;
    const payload = {
        user: {  fullName, address, email, SDT,},          
        order: { dataCart, ghiChu},
    }
    const secretKey = process.env.SERECT_KEY; 
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // truong hop dang nhap
    if (req.session.user) {
        //thanh toan truc tiep
        if (pay === 'pay') {
            if (!fullName || !address || !SDT || !email || !idUser) {
                return res.render('index', { data: { title: 'Thanh toán', rows: dataCart, error: 'Thông tin không được bỏ trống', page: 'order/checkout' } });
            }
            await orderModel.updateInfoUser(fullName, address, email, SDT, idUser)
            const idDonhang = await orderModel.insertOrder(idUser, ghiChu, 0)
            let tongTien = 0;
            dataCart.forEach(sp => {
                tongTien += (sp.gia * (100 - sp.khuyenMai) / 100) * sp.qty
            });
            for (const sp of dataCart) {
                let idSanPham = sp.idSanPham;
                let giaTien = sp.gia - (sp.gia * (sp.khuyenMai / 100))
                let soLuong = sp.qty;
                await orderModel.insertDetailOrder(idDonhang, idSanPham, giaTien, soLuong, tongTien);
            }
            delete req.session.cart;
            res.redirect(`thank?token=${token}`);
        }
        // thanh toan qua vi vnpay
        if (pay === 'VNPAY') {
            if (!fullName || !address || !SDT || !idUser) {
                return res.render('index', { data: { title: 'Thanh toán', rows: dataCart, error: 'Thông tin không được bỏ trống', page: 'order/checkout' } });
            }
            await orderModel.updateInfoUser(fullName, address, email, SDT, idUser)
            const idDonhang = await orderModel.insertOrder(idUser, ghiChu, 2)
            let tongTien = 0;
            dataCart.forEach(sp => {
                tongTien += (sp.gia * (100 - sp.khuyenMai) / 100) * sp.qty
            });
            for (const sp of dataCart) {
                let idSanPham = sp.idSanPham;
                let giaTien = sp.gia - (sp.gia * (sp.khuyenMai / 100))
                let soLuong = sp.qty;
                await orderModel.insertDetailOrder(idDonhang, idSanPham, giaTien, soLuong, tongTien);
            }
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let tmnCode = 'ADIHHTSZ';
            let secretKey = 'JRJLFDPUSOIISVJJHKIPONMUNWYZVYTR'
            let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
            let returnUrl = 'http://localhost:3000/cart'

            let date = new Date();

            let createDate = moment().format('YYYYMMDDHHmmss');

            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = idDonhang;
            vnp_Params['vnp_OrderInfo'] = 'noi dung thanh toan';
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = tongTien * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            vnp_Params['vnp_BankCode'] = 'NCB';

            vnp_Params = sortObject(vnp_Params);

            var querystring = require('qs');
            var signData = querystring.stringify(vnp_Params, { encode: false });
            var crypto = require("crypto");
            var hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            delete req.session.cart;
            res.redirect(vnpUrl)

        }
    }
    // truong hop chưa dang nhập
    if (!req.session.user) {
        //thanh toan truc tiep
        if (pay === 'pay') {
            if (!fullName || !address || !email || !SDT) {
                return res.render('index', { data: { title: 'Thanh toán', rows: dataCart, error: 'Thông tin không được bỏ trống', page: 'order/checkout' } });
            }
            const user = await orderModel.insertUserOder(fullName, address, email, SDT)
            const idDonhang = await orderModel.insertOrder(user, ghiChu, 0)
            let tongTien = 0;
            dataCart.forEach(sp => {
                tongTien += (sp.gia * (100 - sp.khuyenMai) / 100) * sp.qty
            });
            for (const sp of dataCart) {
                let idSanPham = sp.idSanPham;
                let giaTien = sp.gia - (sp.gia * (sp.khuyenMai / 100))
                let soLuong = sp.qty;
                await orderModel.insertDetailOrder(idDonhang, idSanPham, giaTien, soLuong, tongTien);
            }
            delete req.session.cart;
            res.redirect('/thank');
        }
        if (pay === 'VNPAY') {
            if (!fullName || !address || !email || !SDT) {
                return res.render('index', { data: { title: 'Thanh toán', rows: dataCart, error: 'Thông tin không được bỏ trống', page: 'order/checkout' } });
            }
            const user = await orderModel.insertUserOder(fullName, address, email, SDT)
            const idDonhang = await orderModel.insertOrder(user, ghiChu, 0)
            let tongTien = 0;
            dataCart.forEach(sp => {
                tongTien += (sp.gia * (100 - sp.khuyenMai) / 100) * sp.qty
            });
            for (const sp of dataCart) {
                let idSanPham = sp.idSanPham;
                let giaTien = sp.gia - (sp.gia * (sp.khuyenMai / 100))
                let soLuong = sp.qty;
                await orderModel.insertDetailOrder(idDonhang, idSanPham, giaTien, soLuong, tongTien);
            }
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let tmnCode = 'ADIHHTSZ';
            let secretKey = 'JRJLFDPUSOIISVJJHKIPONMUNWYZVYTR'
            let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
            let returnUrl = 'http://localhost:3000/cart'

            let date = new Date();

            let createDate = moment().format('YYYYMMDDHHmmss');

            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_Locale'] = 'vn';
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = idDonhang;
            vnp_Params['vnp_OrderInfo'] = 'noi dung thanh toan';
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = tongTien * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            vnp_Params['vnp_BankCode'] = 'NCB';

            vnp_Params = sortObject(vnp_Params);

            var querystring = require('qs');
            var signData = querystring.stringify(vnp_Params, { encode: false });
            var crypto = require("crypto");
            var hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            delete req.session.cart;
            res.redirect(vnpUrl)

        }
    }
}
const thank = (req, res) => {
    const token = req.query.token;
    let {user, order} = {}
    if(!token) {
        return res.redirect('/')
        console.log('loi')
    }
    const secretKey = process.env.SERECT_KEY; 
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.redirect('/')
        }
        // Đã giải mã thành công, giờ bạn có thể truy xuất thông tin đơn hàng và người dùng từ decoded
        user = decoded.user;
        order = decoded.order
    });
    res.render('index', { data: { title: 'Cảm ơn',user, order, page: 'order/thank' } });
}
export default {
    checkout,
    insertOrder,
    thank
    // momo
}
