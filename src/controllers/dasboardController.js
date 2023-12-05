import express from "express";
import dasboardModel from "../services/dasboardModel";

const getDasboardPage = async (req, res) =>{
    let countUser = await dasboardModel.countUser()
    let countOrder = await dasboardModel.countOder()
    let countProductSold = await dasboardModel.countProductSold()
    let totalSales = await dasboardModel.totalSales()
    let countOrderPaid = await dasboardModel.getOrderPaid()
    let countOrderConfirmed = await dasboardModel.getOrderConfirmed()
    let countOrderWait = await dasboardModel.getOrderWait()
    let countOrderCancel = await dasboardModel.getOrderCancel()
    let countCategory = await dasboardModel.countProductCategory()
    let totalDay = await dasboardModel.totalSalesOfDay()
    parseInt(totalSales)
    return res.render('admin', { data: 
        { 
            title: '', 
            page: 'dasboard/index', 
            getUrl: req.url,
            countUser,
            countOrder,
            countProductSold,
            totalSales,
            countOrderPaid,
            countOrderConfirmed,
            countOrderWait,
            countOrderCancel,
            countCategory,
            totalDay
        } 
    });
}
export default{
    getDasboardPage
}