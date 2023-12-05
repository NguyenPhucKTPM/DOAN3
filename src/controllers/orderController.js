import express from "express";
import orderModel from "../services/orderModel";
import checkoutModel from "../services/checkoutModel";

const getOrderPaid = async (req, res) =>{
    let orderPaid = await orderModel.getOrderPaid()
    return res.render('admin', { data: { title: 'Danh sách đơn hàng thanh toán online', page: 'order/listOrderPaid', rows: orderPaid, getUrl: req.url } });
}
const getOrderWait = async (req, res) =>{
    let orderWait = await orderModel.getOrderWait()
    return res.render('admin', { data: { title: 'Danh sách đơn hàng chờ xác nhận', page: 'order/listOrderWait', rows: orderWait, getUrl: req.url } });
}
const getOrderCancel = async (req, res) =>{
    let orderCancel = await orderModel.getOrderCancel()
    return res.render('admin', { data: { title: 'Danh sách đơn hàng đã hủy', page: 'order/listOrderCancel', rows: orderCancel, getUrl: req.url } });
}
const getOrderConfirmed = async (req, res) =>{
    let orderConfirmed = await orderModel.getOrderConfirmed()
    return res.render('admin', { data: { title: 'Danh sách đơn hàng đã hủy', page: 'order/listOrderConfirmed', rows: orderConfirmed, getUrl: req.url } });
}
const confirmOrder = async (req, res) =>{
    let trangThai = req.params.trangThai
    let id = req.params.idDonhang
    await orderModel.confirmOrder(trangThai,id)
    if(trangThai == 1){
        return res.redirect('/list-order-confirmed');
    }
    if(trangThai == 3){
        return res.redirect('/list-order-cancel');
    }
}
const getDetailOrder = async(req, res) =>{
    let idDonHang = req.params.idDonHang
    const order = await checkoutModel.getOrder(idDonHang);
    const detailOrder = await checkoutModel.getDetailOrder(idDonHang);
    // console.log(order)
    // console.log(detailOrder)
    return res.render('admin', { data: { title: 'Chi tiết đơn hàng', order,detailOrder, page: 'order/detailOrder', getUrl: req.url } });
}
export default{
    getOrderPaid,
    getOrderWait,
    getOrderCancel,
    getOrderConfirmed,
    confirmOrder,
    getDetailOrder,
}