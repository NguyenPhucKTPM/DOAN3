import express from "express";
import orderModel from "../services/orderModel";

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
    let { idUser, ghiChu } = req.body;
    const idDonhang = await orderModel.insertOrder(idUser,ghiChu)
    let tongTien = 0;
    dataCart.forEach(sp => {
        tongTien += (sp.gia * (100 - sp.khuyenMai) / 100) * sp.qty
    });
    for (const sp of dataCart) {
        let idSanPham = sp.idSanPham;
        let giaTien = sp.gia - (sp.gia * (sp.khuyenMai / 100))
        let soLuong = sp.qty;
        await orderModel.insertDetailOrder(idDonhang,idSanPham,giaTien,soLuong,tongTien);
    }
    delete req.session.cart;
    res.redirect('/cart');

    // truong hop da dang nhap
    // if(req.session.user){
    //     console.log('co')
    // }

}
export default {
    checkout,
    insertOrder
}